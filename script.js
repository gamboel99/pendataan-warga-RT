let memberCount = 0;
let dataDraft = JSON.parse(localStorage.getItem('draftData')) || [];

// Fungsi tambah anggota keluarga
function addMember() {
  memberCount++;
  const div = document.createElement('div');
  div.className = 'member';
  div.innerHTML = `
    <button type="button" class="remove-member" onclick="this.parentNode.remove()">X</button>
    <div class="form-group">
      <label>Nama Lengkap</label>
      <input type="text" name="nama_${memberCount}" required>
    </div>
    <div class="form-group">
      <label>NIK</label>
      <input type="text" name="nik_${memberCount}" maxlength="16" required>
    </div>
    <div class="form-group">
      <label>Nomor Akta Kelahiran</label>
      <input type="text" name="akta_${memberCount}">
    </div>
    <div class="form-group">
      <label>Jenis Kelamin</label>
      <select name="jk_${memberCount}">
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>
    </div>
    <div class="form-group">
      <label>TTL</label>
      <input type="text" name="ttl_${memberCount}">
    </div>
    <div class="form-group">
      <label>Hubungan dengan Kepala Keluarga</label>
      <input type="text" name="hubungan_${memberCount}">
    </div>
    <div class="form-group">
      <label>Status Perkawinan</label>
      <select name="status_kawin_${memberCount}">
        <option value="belum_kawin">Belum Kawin</option>
        <option value="kawin">Kawin</option>
        <option value="cerai">Cerai</option>
      </select>
    </div>
    <div class="form-group">
      <label>Pendidikan Terakhir</label>
      <input type="text" name="pendidikan_${memberCount}">
    </div>
    <div class="form-group">
      <label>Pekerjaan</label>
      <input type="text" name="pekerjaan_${memberCount}">
    </div>
    <div class="form-group">
      <label>Nomor Buku Nikah</label>
      <input type="text" name="buku_nikah_${memberCount}">
    </div>
    <div class="form-group">
      <label>Nomor Ijazah</label>
      <input type="text" name="ijazah_${memberCount}">
    </div>
    <div class="form-group">
      <label>Catatan Ketidaksesuaian Data</label>
      <textarea name="ketidaksesuaian_${memberCount}" rows="2"></textarea>
    </div>
    <div class="form-group">
      <label>Data Salah? ⚠️</label>
      <input type="checkbox" name="flag_${memberCount}">
    </div>
  `;
  document.getElementById('members').appendChild(div);
}

// Simpan draft ke LocalStorage
function saveDraft() {
  const form = document.getElementById('kkForm');
  const formData = new FormData(form);
  let members = [];
  for (let i = 1; i <= memberCount; i++) {
    if (formData.get('nama_' + i)) {
      members.push({
        nama: formData.get('nama_' + i),
        nik: formData.get('nik_' + i),
        akta: formData.get('akta_' + i),
        jk: formData.get('jk_' + i),
        ttl: formData.get('ttl_' + i),
        hubungan: formData.get('hubungan_' + i),
        status_kawin: formData.get('status_kawin_' + i),
        pendidikan: formData.get('pendidikan_' + i),
        pekerjaan: formData.get('pekerjaan_' + i),
        buku_nikah: formData.get('buku_nikah_' + i),
        ijazah: formData.get('ijazah_' + i),
        ketidaksesuaian: formData.get('ketidaksesuaian_' + i),
        flag: formData.get('flag_' + i) ? true : false
      });
    }
  }

  const data = {
    nomor_kk: formData.get('nomor_kk'),
    alamat: formData.get('alamat'),
    rt: formData.get('rt'),
    rw: formData.get('rw'),
    ketua_rt: formData.get('ketua_rt'),
    kepala_keluarga: formData.get('kepala_keluarga'),
    jumlah_anggota: formData.get('jumlah_anggota'),
    perubahan: formData.get('perubahan'),
    catatan: formData.get('catatan'),
    status_validasi: formData.get('status_validasi'),
    catatan_rt: formData.get('catatan_rt'),
    ttd_rt: formData.get('ttd_rt'),
    members: members
  };
  dataDraft.push(data);
  localStorage.setItem('draftData', JSON.stringify(dataDraft));
  renderDashboard();
}

// Validasi form dasar
document.getElementById('kkForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = document.getElementById('kkForm');
  const formData = new FormData(form);
  for (let i = 1; i <= memberCount; i++) {
    const nik = formData.get('nik_' + i);
    if (nik && nik.length !== 16) {
      alert(`NIK anggota ke-${i} harus 16 digit`);
      return;
    }
  }
  saveDraft();
  alert('Data disimpan di draft!');
});

// Render dashboard
function renderDashboard() {
  const dash = document.getElementById('dashboard');
  if (dataDraft.length === 0) {
    dash.innerHTML = '<p>Belum ada data</p>';
    return;
  }
  let html = '<table><tr><th>Nomor KK</th><th>Kepala Keluarga</th><th>RT</th><th>RW</th><th>Ketua RT</th><th>Jumlah Anggota</th><th>Anggota Bermasalah ⚠️</th></tr>';
  dataDraft.forEach(d => {
    const flagCount = d.members.filter(m => m.flag).length;
    html += `<tr>
      <td>${d.nomor_kk}</td>
      <td>${d.kepala_keluarga}</td>
      <td>${d.rt}</td>
      <td>${d.rw}</td>
      <td>${d.ketua_rt}</td>
      <td>${d.members.length}</td>
      <td style="color:red;font-weight:600">${flagCount > 0 ? '⚠️ '+flagCount : ''}</td>
    </tr>`;
  });
  html += '</table>';
  dash.innerHTML = html;
}

// Export Excel per KK
function exportExcel() {
  if (dataDraft.length === 0) { alert('Tidak ada data untuk export'); return; }
  const wb = XLSX.utils.book_new();
  dataDraft.forEach((d, i) => {
    const ws_data = [];
    ws_data.push(['Nomor KK','Alamat','RT','RW','Ketua RT','Kepala Keluarga','Jumlah Anggota','Perubahan','Catatan','Status Validasi','Catatan RT','TTD RT']);
    ws_data.push([d.nomor_kk,d.alamat,d.rt,d.rw,d.ketua_rt,d.kepala_keluarga,d.members.length,d.perubahan,d.catatan,d.status_validasi,d.catatan_rt,d.ttd_rt]);
    ws_data.push([]);
    ws_data.push(['Nama','NIK','Akta','JK','TTL','Hubungan','Status Kawin','Pendidikan','Pekerjaan','Buku Nikah','Ijazah','Ketidaksesuaian','Flag']);
    d.members.forEach(m => {
      ws_data.push([m.nama,m.nik,m.akta,m.jk,m.ttl,m.hubungan,m.status_kawin,m.pendidikan,m.pekerjaan,m.buku_nikah,m.ijazah,m.ketidaksesuaian,m.flag ? '⚠️' : '']);
    });
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, `KK_${i+1}`);
  });
  XLSX.writeFile(wb, 'Pendataan_RT.xlsx');
}

// Render dashboard awal
renderDashboard();
