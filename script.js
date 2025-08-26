let anggotaCounter = 0;

function showSection(id) {
  document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function tambahAnggota(data={}) {
  anggotaCounter++;
  const container = document.getElementById('anggotaList');
  const div = document.createElement('div');
  div.className = 'anggota-item';
  div.innerHTML = `
    <h4>Anggota ${anggotaCounter}</h4>
    <label>Nama Lengkap <input type="text" name="nama_${anggotaCounter}" required></label>
    <label>NIK <input type="text" name="nik_${anggotaCounter}" required></label>
    <label>No. Akta Kelahiran <input type="text" name="akta_${anggotaCounter}"></label>
    <label>Jenis Kelamin
      <select name="jk_${anggotaCounter}">
        <option value="">-Pilih-</option>
        <option value="L">Laki-laki</option>
        <option value="P">Perempuan</option>
      </select>
    </label>
    <label>Tempat Lahir <input type="text" name="tempat_${anggotaCounter}"></label>
    <label>Tanggal Lahir <input type="date" name="tgl_${anggotaCounter}"></label>
    <label>Hubungan dengan Kepala Keluarga <input type="text" name="hubungan_${anggotaCounter}"></label>
    <label>Status Perkawinan <input type="text" name="statusNikah_${anggotaCounter}"></label>
    <label>Pendidikan Terakhir <input type="text" name="pendidikan_${anggotaCounter}"></label>
    <label>Pekerjaan <input type="text" name="pekerjaan_${anggotaCounter}"></label>
    <label>No. Buku Nikah <input type="text" name="bukuNikah_${anggotaCounter}"></label>
    <label>No. Ijazah <input type="text" name="ijazah_${anggotaCounter}"></label>
    <label>Catatan Ketidaksesuaian <textarea name="catatan_${anggotaCounter}"></textarea></label>
    <label><input type="checkbox" name="salah_${anggotaCounter}"> Data Salah ⚠️</label>
  `;
  container.appendChild(div);
}

function simpanDraft(){
  localStorage.setItem('draftKK', document.getElementById('kkForm').innerHTML);
  alert('Draft tersimpan di browser');
}

function hapusDraft(){
  localStorage.removeItem('draftKK');
  alert('Draft dihapus');
}

function exportExcel(){
  alert('Export Excel belum diimplementasikan penuh di contoh ini.');
}

window.onload = function(){
  const draft = localStorage.getItem('draftKK');
  if(draft){
    document.getElementById('kkForm').innerHTML = draft;
  }
}
