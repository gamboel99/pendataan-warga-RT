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
    <label>Nama <input type="text" name="nama_${anggotaCounter}" required value="${data.nama||''}"></label>
    <label>NIK <input type="text" name="nik_${anggotaCounter}" required value="${data.nik||''}"></label>
    <label>Jenis Kelamin
      <select name="jk_${anggotaCounter}">
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
    </label>
    <label>Tempat, Tanggal Lahir <input type="text" name="ttl_${anggotaCounter}" value="${data.ttl||''}"></label>
    <label>Hubungan dengan KK <input type="text" name="hub_${anggotaCounter}" value="${data.hub||''}"></label>
    <label>Status Kawin <input type="text" name="kawin_${anggotaCounter}" value="${data.kawin||''}"></label>
    <label>Pendidikan <input type="text" name="pendidikan_${anggotaCounter}" value="${data.pendidikan||''}"></label>
    <label>Pekerjaan <input type="text" name="pekerjaan_${anggotaCounter}" value="${data.pekerjaan||''}"></label>
    <button type="button" onclick="this.parentElement.remove()">Hapus Anggota</button>
  `;
  container.appendChild(div);
}

function simpanDraft() {
  const form = document.getElementById('kkForm');
  const data = new FormData(form);
  const anggotaNodes = document.querySelectorAll('.anggota-item');
  const anggotaData = [];
  anggotaNodes.forEach((node,i) => {
    anggotaData.push({
      nama: node.querySelector(`[name^=nama_]`).value,
      nik: node.querySelector(`[name^=nik_]`).value,
      jk: node.querySelector(`[name^=jk_]`).value,
      ttl: node.querySelector(`[name^=ttl_]`).value,
      hub: node.querySelector(`[name^=hub_]`).value,
      kawin: node.querySelector(`[name^=kawin_]`).value,
      pendidikan: node.querySelector(`[name^=pendidikan_]`).value,
      pekerjaan: node.querySelector(`[name^=pekerjaan_]`).value
    });
  });
  const payload = {
    nomorKK: data.get('nomorKK'),
    kepalaKeluarga: data.get('kepalaKeluarga'),
    alamat: data.get('alamat'),
    rt: data.get('rt'),
    rw: data.get('rw'),
    namaKetuaRT: data.get('namaKetuaRT'),
    tanggalPembuatanKK: data.get('tanggalPembuatanKK'),
    statusKK: data.get('statusKK'),
    anggota: anggotaData
  };
  localStorage.setItem('draftRT', JSON.stringify(payload));
  alert('Draft tersimpan di browser.');
}

function hapusDraft() {
  if(confirm('Hapus draft?')){
    localStorage.removeItem('draftRT');
    alert('Draft dihapus');
  }
}

function exportExcel() {
  const raw = localStorage.getItem('draftRT');
  if(!raw) { alert('Belum ada data tersimpan'); return; }
  const data = JSON.parse(raw);

  const wb = XLSX.utils.book_new();
  const wsData = [["Nomor KK","Kepala Keluarga","Alamat","RT","RW","Nama Ketua RT","Tanggal Pembuatan","Status KK"]];
  wsData.push([data.nomorKK,data.kepalaKeluarga,data.alamat,data.rt,data.rw,data.namaKetuaRT,data.tanggalPembuatanKK,data.statusKK]);
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "KK");

  const wsAnggota = [["Nama","NIK","JK","TTL","Hubungan","Status Kawin","Pendidikan","Pekerjaan"]];
  data.anggota.forEach(a => wsAnggota.push([a.nama,a.nik,a.jk,a.ttl,a.hub,a.kawin,a.pendidikan,a.pekerjaan]));
  const ws2 = XLSX.utils.aoa_to_sheet(wsAnggota);
  XLSX.utils.book_append_sheet(wb, ws2, "Anggota");

  XLSX.writeFile(wb, `KK_${data.nomorKK||'data'}.xlsx`);
  alert('Data diexport ke Excel.');
}

window.onload = () => {
  const raw = localStorage.getItem('draftRT');
  if(raw){
    const data = JSON.parse(raw);
    document.querySelector('[name=nomorKK]').value = data.nomorKK||'';
    document.querySelector('[name=kepalaKeluarga]').value = data.kepalaKeluarga||'';
    document.querySelector('[name=alamat]').value = data.alamat||'';
    document.querySelector('[name=rt]').value = data.rt||'';
    document.querySelector('[name=rw]').value = data.rw||'';
    document.querySelector('[name=namaKetuaRT]').value = data.namaKetuaRT||'';
    document.querySelector('[name=tanggalPembuatanKK]').value = data.tanggalPembuatanKK||'';
    document.querySelector('[name=statusKK]').value = data.statusKK||'';
    if(data.anggota){
      data.anggota.forEach(a=>tambahAnggota(a));
    }
  }
};
