/**
 * Madrasah Pro — Pelayan Penyegerakan (Google Apps Script)
 * ---------------------------------------------------------
 * Cara guna (sekali sahaja, oleh Admin):
 *   1. Buka https://sheets.new (Google Sheet baharu), namakan "Madrasah Pro Data".
 *   2. Menu Sambungan (Extensions) > Apps Script. Padam kod sedia ada, tampal SEMUA kod ini, tekan Simpan.
 *   3. Terapkan (Deploy) > Penerapan baharu (New deployment) > jenis "Apl web" (Web app).
 *        - Laksanakan sebagai (Execute as): Saya (Me)
 *        - Siapa yang mempunyai akses (Who has access): Sesiapa sahaja (Anyone)
 *   4. Tekan Terapkan, benarkan akses, salin "URL apl web" (berakhir dengan /exec).
 *   5. Tampal URL itu dalam Madrasah Pro > Tetapan > Penyegerakan Peranti.
 *
 * Data disimpan dalam helaian "data" (satu baris = satu rekod). Jangan ubah helaian itu secara manual.
 */
var SHEET_NAME = 'data';
var CHUNK = 45000; // had aksara bagi satu sel Google Sheet ialah 50,000

function doGet() {
  return out_({ ok: true, app: 'MadrasahPro', ready: !!prop_('KEY') });
}

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'bad_json' }); }
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    if (req.action === 'claim') {
      if (prop_('KEY')) return out_({ ok: false, error: 'claimed' });
      if (!req.key || String(req.key).length < 16) return out_({ ok: false, error: 'bad_key' });
      PropertiesService.getScriptProperties().setProperty('KEY', String(req.key));
      sheet_();
      return out_({ ok: true });
    }
    if (!prop_('KEY') || req.key !== prop_('KEY')) return out_({ ok: false, error: 'auth' });
    if (req.action === 'ping') return out_({ ok: true });
    if (req.action === 'sync') return out_(sync_(req));
    return out_({ ok: false, error: 'action' });
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function sync_(req) {
  var sh = sheet_();
  var last = sh.getLastRow();
  var width = Math.max(6, sh.getLastColumn());
  var rows = last > 1 ? sh.getRange(2, 1, last - 1, width).getValues() : [];
  var idx = {};
  for (var i = 0; i < rows.length; i++) idx[rows[i][0] + '|' + rows[i][1]] = i;

  var now = Date.now();
  var lastSrv = Number(prop_('SRV') || 0);
  if (now <= lastSrv) now = lastSrv + 1;

  var changes = req.changes || [];
  var dirty = false;
  changes.forEach(function (ch) {
    if (!ch || !ch.c || !ch.id) return;
    var k = ch.c + '|' + ch.id;
    var at = idx[k];
    if (at !== undefined && Number(rows[at][2]) > Number(ch.m || 0)) return; // rekod pelayan lebih baharu
    var json = ch.d == null ? '' : JSON.stringify(ch.d);
    var row = [String(ch.c), String(ch.id), String(Number(ch.m || now)), String(now), ch.d == null ? '1' : ''];
    if (!json) row.push('');
    for (var p = 0; p < json.length; p += CHUNK) row.push(json.slice(p, p + CHUNK));
    if (at !== undefined) rows[at] = row; else { rows.push(row); idx[k] = rows.length - 1; }
    dirty = true;
  });

  if (dirty) {
    var w = 6;
    rows.forEach(function (r) { if (r.length > w) w = r.length; });
    var data = rows.map(function (r) { var c = r.slice(); while (c.length < w) c.push(''); return c; });
    var range = sh.getRange(2, 1, data.length, w);
    range.setNumberFormat('@');
    range.setValues(data);
    PropertiesService.getScriptProperties().setProperty('SRV', String(now));
  }

  var since = Number(req.since || 0);
  var outList = [];
  rows.forEach(function (r) {
    if (Number(r[3]) > since) {
      var json = r.slice(5).join('');
      var d = null;
      if (json) { try { d = JSON.parse(json); } catch (e) { d = null; } }
      outList.push({ c: String(r[0]), id: String(r[1]), m: Number(r[2]), del: String(r[4]) === '1', d: d });
    }
  });
  return { ok: true, now: dirty ? now : Math.max(lastSrv, since), changes: outList };
}

function sheet_() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, 6).setValues([['koleksi', 'id', 'diubah', 'srv', 'dipadam', 'data']]);
    sh.setFrozenRows(1);
    sh.getRange('A:F').setNumberFormat('@');
  }
  return sh;
}

function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k); }

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
