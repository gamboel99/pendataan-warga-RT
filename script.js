
let memberCount = 0;
let dataDraft = [];

function addMember(){
  memberCount++;
  const div = document.createElement('div');
  div.className = 'member';
  div.innerHTML = `
    <button type="button" class="remove-member" onclick="this.parentNode.remove()">X</button>
    <label>Nama Lengkap</label><input type="text" name="nama_${memberCount}" required>
    <label>NIK</label><input type="text" name="nik_${memberCount}" required maxlength="16">
    <label>Jenis Kelamin</label>
    <select name="jk_${memberCount}">
      <option value="L">Laki-laki</option>
      <option value="P">Perempuan</option>
    </select>
    <label>Tempat, Tanggal Lahir</label><input type="text" name="ttl_${memberCount}">
    <label>Hubungan dengan Kepala Keluarga</label><input type="text" name="hubungan_${memberCount}">
    <label>Status Perkawinan</label>
    <select name="status_kawin_${memberCount}">
      <option value="belum_kawin">Belum Kawin</option>
      <option value="kawin">Kawin</option>
      <option value="cerai">Cerai</option>
    </select>
    <label>Pendidikan Terakhir</label><input type="text" name="pendidikan_${memberCount}">
    <label>Pekerjaan</label><input type="text" name="pekerjaan_${memberCount}">
    <label>Ketidaksesuaian Data (KK/Akta/Ijazah/Buku Nikah)</label>
    <textarea name="ketidaksesuaian_${memberCount}" rows="2"></textarea>
    <label>Data Salah? ⚠️</label><input type="checkbox" name="flag_${memberCount}">
  `;
  document.getElementById('members').appendChild(div);
}

document.getElementById('kkForm').addEventListener('submit', function(e){
  e.preventDefault();
  saveDraft();
  alert('Data disimpan di draft!');
  renderDashboard();
});

function saveDraft(){
  const form = document.getElementById('kkForm');
  const formData = new FormData(form);
  const data = {
    nomor_kk: formData.get('nomor_kk'),
    alamat: formData.get('alamat'),
    kepala_keluarga: formData.get('kepala_keluarga'),
    perubahan: formData.get('perubahan'),
    catatan: formData.get('catatan'),
    anggota: []
  };
  for(let i=1;i<=memberCount;i++){
    if(formData.get('nama_'+i)){
      data.anggota.push({
        nama: formData.get('nama_'+i),
        nik: formData.get('nik_'+i),
        jk: formData.get('jk_'+i),
        ttl: formData.get('ttl_'+i),
        hubungan: formData.get('hubungan_'+i),
        status_kawin: formData.get('status_kawin_'+i),
        pendidikan: formData.get('pendidikan_'+i),
        pekerjaan: formData.get('pekerjaan_'+i),
        ketidaksesuaian: formData.get('ketidaksesuaian_'+i),
        flag: formData.get('flag_'+i)?true:false
      });
    }
  }
  dataDraft.push(data);
  localStorage.setItem('dataDraft', JSON.stringify(dataDraft));
}

function renderDashboard(){
  const container = document.getElementById('dashboard');
  if(dataDraft.length===0){ container.innerHTML='<p>Belum ada data.</p>'; return;}
  let html='<table><tr><th>KK</th><th>Kepala Keluarga</th><th>Anggota</th><th>Status Data</th></tr>';
  dataDraft.forEach(d=>{
    let anggotaHtml = '';
    let flagFound=false;
    d.anggota.forEach(a=>{
      if(a.flag) flagFound=true;
      anggotaHtml+=a.nama+' ('+a.nik+')<br>';
    });
    html+=`<tr ${flagFound?'class="member-flag"':''}><td>${d.nomor_kk}</td><td>${d.kepala_keluarga}</td><td>${anggotaHtml}</td><td>${flagFound?'⚠️ Data Salah':''}</td></tr>`;
  });
  html+='</table>';
  container.innerHTML=html;
}

function exportExcel(){
  if(dataDraft.length===0){ alert('Belum ada data!'); return;}
  const wb = XLSX.utils.book_new();
  dataDraft.forEach(d=>{
    const ws_data = d.anggota.map(a=>({
      Nama:a.nama,
      NIK:a.nik,
      Jenis_Kelamin:a.jk,
      TTL:a.ttl,
      Hubungan:a.hubungan,
      Status_PerKawin:a.status_kawin,
      Pendidikan:a.pendidikan,
      Pekerjaan:a.pekerjaan,
      Ketidaksesuaian:a.ketidaksesuaian,
      Data_Salah:a.flag?'⚠️':'OK'
    }));
    const ws = XLSX.utils.json_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, d.nomor_kk);
  });
  XLSX.writeFile(wb,'Data_Kependudukan_RT.xlsx');
}

window.onload=function(){
  if(localStorage.getItem('dataDraft')){
    dataDraft=JSON.parse(localStorage.getItem('dataDraft'));
    renderDashboard();
  }
}
