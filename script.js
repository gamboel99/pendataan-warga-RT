
/* ======= State & Helpers ======= */
const LS_DRAFT = "rt_kk_draft";
const LS_FINALS = "rt_kk_finals"; // array of finalized KK objects

const UI = {
  show(id){
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(id==='dashboard'){ Dashboard.render(); }
    if(id==='form'){ Form.refreshJumlahAnggota(); Form.renderFinalsTable(); }
  }
};

const Form = {
  anggotaIndex: 0,
  perubahanIndex: 0,

  addAnggota(pref={}){
    const idx = ++this.anggotaIndex;
    const el = document.createElement('div');
    el.className = 'anggota-box';
    el.dataset.idx = idx;
    el.innerHTML = `
      <h4>Anggota #${idx}</h4>
      <div class="anggota-grid">
        <label>Nama Lengkap (KTP)<input type="text" name="a${idx}_nama" required></label>
        <label>NIK (16 digit)<input type="text" name="a${idx}_nik" required></label>
        <label>Jenis Kelamin
          <select name="a${idx}_jk">
            <option>Laki-laki</option><option>Perempuan</option>
          </select>
        </label>
        <label>Tempat Lahir<input type="text" name="a${idx}_tlahir"></label>
        <label>Tanggal Lahir<input type="date" name="a${idx}_tgllahir"></label>
        <label>Hubungan dgn KK
          <select name="a${idx}_hub">
            <option>Kepala Keluarga</option><option>Istri/Suami</option><option>Anak</option><option>Saudara</option><option>Lainnya</option>
          </select>
        </label>
        <label>Status Perkawinan
          <select name="a${idx}_kawin">
            <option>Belum Kawin</option><option>Kawin</option><option>Cerai Hidup</option><option>Cerai Mati</option>
          </select>
        </label>
        <label>Pendidikan Terakhir<input type="text" name="a${idx}_pendidikan" placeholder="SMA/SMK/D3/S1/..." required></label>
        <label>Pekerjaan Saat Ini<input type="text" name="a${idx}_pekerjaan" required></label>

        <!-- Dokumen Terperinci -->
        <label>Akta Kelahiran - Nomor<input type="text" name="a${idx}_akta_no"></label>
        <label>Akta Kelahiran - Nama di Akta<input type="text" name="a${idx}_akta_nama"></label>
        <label>Akta - Nama Ayah<input type="text" name="a${idx}_akta_ayah"></label>
        <label>Akta - Nama Ibu<input type="text" name="a${idx}_akta_ibu"></label>

        <label>Ijazah - Nomor<input type="text" name="a${idx}_ijazah_no"></label>
        <label>Ijazah - Nama (YBS)<input type="text" name="a${idx}_ijazah_nama"></label>
        <label>Ijazah - Nama Ayah<input type="text" name="a${idx}_ijazah_ayah"></label>
        <label>Ijazah - Nama Ibu<input type="text" name="a${idx}_ijazah_ibu"></label>

        <label>Buku Nikah - Nomor<input type="text" name="a${idx}_nikah_no"></label>
        <label>Buku Nikah - Nama Suami<input type="text" name="a${idx}_nikah_suami"></label>
        <label>Buku Nikah - Nama Istri<input type="text" name="a${idx}_nikah_istri"></label>

        <label>Catatan Ketidaksesuaian<textarea name="a${idx}_catatan"></textarea></label>
        <label><input type="checkbox" name="a${idx}_datasalah"> Data Salah ⚠️</label>
      </div>
      <div class="row-actions">
        <button type="button" class="btn" onclick="Form.removeBlock(this.closest('.anggota-box'))">Hapus Anggota</button>
      </div>
    `;
    document.getElementById('anggotaList').appendChild(el);
    // Prefill if provided
    Object.entries(pref).forEach(([k,v])=>{
      const input = el.querySelector(`[name="${k}"]`);
      if(input){ if(input.type==='checkbox') input.checked=!!v; else input.value=v; }
    });
    this.refreshJumlahAnggota();
  },

  addPerubahan(pref={}){
    const idx = ++this.perubahanIndex;
    const el = document.createElement('div');
    el.className = 'perubahan-box';
    el.dataset.idx = idx;
    el.innerHTML = `
      <h4>Perubahan #${idx}</h4>
      <div class="anggota-grid">
        <label>Jenis
          <select name="p${idx}_jenis">
            <option>Penambahan</option><option>Pengurangan</option><option>Koreksi</option>
          </select>
        </label>
        <label>Rincian (lahir, pindah datang/keluar, cerai, koreksi data)<input type="text" name="p${idx}_rincian"></label>
        <label>Nama Terkait<input type="text" name="p${idx}_nama"></label>
        <label>Tanggal Perubahan<input type="date" name="p${idx}_tanggal"></label>
        <label>Dokumen Pendukung (nomor/ket.)<input type="text" name="p${idx}_dok"></label>
      </div>
      <div class="row-actions">
        <button type="button" class="btn" onclick="Form.removeBlock(this.closest('.perubahan-box'))">Hapus Perubahan</button>
      </div>
    `;
    document.getElementById('perubahanList').appendChild(el);
  },

  removeBlock(el){ el.remove(); this.refreshJumlahAnggota(); },

  refreshJumlahAnggota(){
    const count = document.querySelectorAll('#anggotaList .anggota-box').length;
    document.querySelector('[name="jumlahAnggota"]').value = count;
  },

  collect(){
    const f = document.getElementById('kkForm');
    const get = n => f.querySelector(`[name="${n}"]`)?.value?.trim() || "";
    const kk = {
      nomorKK: get('nomorKK'),
      alamat: {
        jalan: get('jalan'), desa: get('desa'), kecamatan: get('kecamatan'),
        kabupaten: get('kabupaten'), provinsi: get('provinsi')
      },
      rt: get('rt'), rw: get('rw'),
      namaKetuaRT: get('namaKetuaRT'),
      kepalaKeluarga: get('kepalaKeluarga'),
      jumlahAnggota: Number(get('jumlahAnggota')||0),
      tanggalPembuatanKK: get('tanggalPembuatanKK'),
      statusKK: get('statusKK')
    };

    // anggota
    const anggota = [];
    document.querySelectorAll('#anggotaList .anggota-box').forEach(box=>{
      const q = n => box.querySelector(`[name="${n}"]`)?.value?.trim() || "";
      const qc = n => !!box.querySelector(`[name="${n}"]`)?.checked;
      const idx = box.dataset.idx;
      anggota.push({
        idx: Number(idx),
        nama: q(`a${idx}_nama`),
        nik: q(`a${idx}_nik`),
        jk: q(`a${idx}_jk`),
        tlahir: q(`a${idx}_tlahir`),
        tgllahir: q(`a${idx}_tgllahir`),
        hub: q(`a${idx}_hub`),
        kawin: q(`a${idx}_kawin`),
        pendidikan: q(`a${idx}_pendidikan`),
        pekerjaan: q(`a${idx}_pekerjaan`),
        akta: { no:q(`a${idx}_akta_no`), nama:q(`a${idx}_akta_nama`), ayah:q(`a${idx}_akta_ayah`), ibu:q(`a${idx}_akta_ibu`) },
        ijazah: { no:q(`a${idx}_ijazah_no`), nama:q(`a${idx}_ijazah_nama`), ayah:q(`a${idx}_ijazah_ayah`), ibu:q(`a${idx}_ijazah_ibu`) },
        nikah: { no:q(`a${idx}_nikah_no`), suami:q(`a${idx}_nikah_suami`), istri:q(`a${idx}_nikah_istri`) },
        catatan: q(`a${idx}_catatan`),
        dataSalah: qc(`a${idx}_datasalah`),
        lastUpdated: new Date().toISOString().slice(0,10)
      });
    });

    // perubahan
    const perubahan = [];
    document.querySelectorAll('#perubahanList .perubahan-box').forEach(box=>{
      const q = n => box.querySelector(`[name="${n}"]`)?.value?.trim() || "";
      const idx = box.dataset.idx;
      perubahan.push({
        idx: Number(idx),
        jenis: q(`p${idx}_jenis`),
        rincian: q(`p${idx}_rincian`),
        nama: q(`p${idx}_nama`),
        tanggal: q(`p${idx}_tanggal`),
        dok: q(`p${idx}_dok`)
      });
    });

    const verif = {
      statusValidasi: get('statusValidasi') || "Belum Dicek",
      catatanVerifikasi: get('catatanVerifikasi'),
      inisialRT: get('inisialRT')
    };

    const deteksi = Detect.run(kk, anggota);
    return { kk, anggota, perubahan, verif, deteksi, savedAt: new Date().toISOString() };
  }
};

/* ======= Detection ======= */
const Detect = {
  norm(s){ return (s||'').toUpperCase().replace(/\s+/g,' ').trim(); },

  run(kk, anggota){
    const issues = [];
    anggota.forEach(a=>{
      // NIK length check
      if(a.nik && a.nik.length!==16) issues.push(this.makeIssue(kk, a, "NIK", `Panjang NIK ${a.nik.length}/16`));

      // Name mismatches across docs
      const nmKTP = this.norm(a.nama);
      const nmAkta = this.norm(a.akta?.nama);
      const nmIjazah = this.norm(a.ijazah?.nama);
      if(nmAkta && nmKTP && nmAkta !== nmKTP)
        issues.push(this.makeIssue(kk, a, "Nama (KTP vs Akta)", `${a.nama} ≠ ${a.akta?.nama}`));
      if(nmIjazah && nmKTP && nmIjazah !== nmKTP)
        issues.push(this.makeIssue(kk, a, "Nama (KTP vs Ijazah)", `${a.nama} ≠ ${a.ijazah?.nama}`));

      // Parents consistency (Akta vs others, here we just check presence/length)
      if(a.akta?.ayah && a.ijazah?.ayah){
        const ayy = this.norm(a.akta.ayah), ayi = this.norm(a.ijazah.ayah);
        if(ayy && ayi && ayy !== ayi) issues.push(this.makeIssue(kk, a, "Nama Ayah (Akta vs Ijazah)", `${a.akta.ayah} ≠ ${a.ijazah.ayah}`));
      }
      if(a.akta?.ibu && a.ijazah?.ibu){
        const ibb = this.norm(a.akta.ibu), ibi = this.norm(a.ijazah.ibu);
        if(ibb && ibi && ibb !== ibi) issues.push(this.makeIssue(kk, a, "Nama Ibu (Akta vs Ijazah)", `${a.akta.ibu} ≠ ${a.ijazah.ibu}`));
      }

      // Monthly update check (pendidikan & pekerjaan)
      // If lastUpdated older than 30 days -> flag
      try{
        const dt = new Date(a.lastUpdated);
        if((Date.now()-dt.getTime())/(1000*60*60*24) > 30){
          issues.push(this.makeIssue(kk, a, "Perlu Update Bulanan", "Pendidikan/Pekerjaan perlu ditinjau kembali"));
        }
      }catch(e){/* ignore */}

      // Manual flag
      if(a.dataSalah){
        issues.push(this.makeIssue(kk, a, "Ditandai Data Salah ⚠️", a.catatan||""));
      }
    });
    return issues;
  },

  makeIssue(kk, a, jenis, detail){
    return {
      nomorKK: kk.nomorKK,
      anggota: a.nama || "(tanpa nama)",
      jenis, detail,
      tanggal: new Date().toISOString().slice(0,10)
    };
  }
};

/* ======= Storage & Render ======= */
const Storage = {
  saveDraft(){
    const data = Form.collect();
    localStorage.setItem(LS_DRAFT, JSON.stringify(data));
    alert("✅ Draft disimpan di browser.");
  },
  clearDraft(){
    localStorage.removeItem(LS_DRAFT);
    alert("🗑️ Draft dihapus.");
  },
  loadDraft(){
    const raw = localStorage.getItem(LS_DRAFT);
    if(!raw) return;
    const data = JSON.parse(raw);
    Fill.form(data);
  },
  saveFinal(){
    const data = Form.collect();
    // push to finals
    const arr = JSON.parse(localStorage.getItem(LS_FINALS)||"[]");
    arr.push(data);
    localStorage.setItem(LS_FINALS, JSON.stringify(arr));
    alert("🎉 Data final disimpan & tampil di tabel.");
    Form.renderFinalsTable();
  },
  getFinals(){ return JSON.parse(localStorage.getItem(LS_FINALS)||"[]"); }
};

const Fill = {
  form(data){
    if(!data) return;
    const f = document.getElementById('kkForm');
    const set = (n,v)=>{const el=f.querySelector(`[name="${n}"]`); if(el) el.value=v||"";}
    set('nomorKK', data.kk?.nomorKK);
    set('jalan', data.kk?.alamat?.jalan);
    set('desa', data.kk?.alamat?.desa);
    set('kecamatan', data.kk?.alamat?.kecamatan);
    set('kabupaten', data.kk?.alamat?.kabupaten);
    set('provinsi', data.kk?.alamat?.provinsi);
    set('rt', data.kk?.rt);
    set('rw', data.kk?.rw);
    set('namaKetuaRT', data.kk?.namaKetuaRT);
    set('kepalaKeluarga', data.kk?.kepalaKeluarga);
    set('jumlahAnggota', data.kk?.jumlahAnggota||0);
    set('tanggalPembuatanKK', data.kk?.tanggalPembuatanKK);
    set('statusKK', data.kk?.statusKK);
    set('statusValidasi', data.verif?.statusValidasi);
    set('catatanVerifikasi', data.verif?.catatanVerifikasi);
    set('inisialRT', data.verif?.inisialRT);

    // clear old anggota & perubahan
    document.getElementById('anggotaList').innerHTML='';
    document.getElementById('perubahanList').innerHTML='';
    Form.anggotaIndex=0; Form.perubahanIndex=0;

    (data.anggota||[]).forEach(a=>{
      const pref = {};
      const i = ++Form.anggotaIndex;
      const map = {
        [`a${i}_nama`]:a.nama, [`a${i}_nik`]:a.nik, [`a${i}_jk`]:a.jk,
        [`a${i}_tlahir`]:a.tlahir, [`a${i}_tgllahir`]:a.tgllahir, [`a${i}_hub`]:a.hub,
        [`a${i}_kawin`]:a.kawin, [`a${i}_pendidikan`]:a.pendidikan, [`a${i}_pekerjaan`]:a.pekerjaan,
        [`a${i}_akta_no`]:a.akta?.no, [`a${i}_akta_nama`]:a.akta?.nama, [`a${i}_akta_ayah`]:a.akta?.ayah, [`a${i}_akta_ibu`]:a.akta?.ibu,
        [`a${i}_ijazah_no`]:a.ijazah?.no, [`a${i}_ijazah_nama`]:a.ijazah?.nama, [`a${i}_ijazah_ayah`]:a.ijazah?.ayah, [`a${i}_ijazah_ibu`]:a.ijazah?.ibu,
        [`a${i}_nikah_no`]:a.nikah?.no, [`a${i}_nikah_suami`]:a.nikah?.suami, [`a${i}_nikah_istri`]:a.nikah?.istri,
        [`a${i}_catatan`]:a.catatan, [`a${i}_datasalah`]:a.dataSalah
      };
      Form.addAnggota(map);
    });

    (data.perubahan||[]).forEach(p=>{
      const i = ++Form.perubahanIndex;
      const pref = { [`p${i}_jenis`]:p.jenis, [`p${i}_rincian`]:p.rincian, [`p${i}_nama`]:p.nama, [`p${i}_tanggal`]:p.tanggal, [`p${i}_dok`]:p.dok };
      Form.addPerubahan(pref);
    });

    Form.refreshJumlahAnggota();
  }
};

/* ======= Export ======= */
const Export = {
  toExcel(){
    const data = Form.collect();
    const wb = XLSX.utils.book_new();

    // Ringkasan_KK
    const k = data.kk;
    const ringkasan = [[
      "Nomor KK","Kepala Keluarga","RT","RW","Ketua RT","Jalan","Desa/Kel","Kecamatan","Kabupaten","Provinsi","Jumlah Anggota","Tanggal Pembuatan","Status KK"
    ],[
      k.nomorKK,k.kepalaKeluarga,k.rt,k.rw,k.namaKetuaRT,k.alamat.jalan,k.alamat.desa,k.alamat.kecamatan,k.alamat.kabupaten,k.alamat.provinsi,k.jumlahAnggota,k.tanggalPembuatanKK,k.statusKK
    ]];
    const wsRingkasan = XLSX.utils.aoa_to_sheet(ringkasan);
    XLSX.utils.book_append_sheet(wb, wsRingkasan, "Ringkasan_KK");

    // Anggota
    const rowsA = [["Nama(KTP)","NIK","JK","Tempat Lahir","Tanggal Lahir","Hubungan","Status Kawin","Pendidikan","Pekerjaan",
      "Akta No","Akta Nama","Akta Ayah","Akta Ibu",
      "Ijazah No","Ijazah Nama","Ijazah Ayah","Ijazah Ibu",
      "Nikah No","Nikah Suami","Nikah Istri","Catatan","Data Salah","Last Updated"
    ]];
    data.anggota.forEach(a=>{
      rowsA.push([a.nama,a.nik,a.jk,a.tlahir,a.tgllahir,a.hub,a.kawin,a.pendidikan,a.pekerjaan,
        a.akta.no,a.akta.nama,a.akta.ayah,a.akta.ibu,
        a.ijazah.no,a.ijazah.nama,a.ijazah.ayah,a.ijazah.ibu,
        a.nikah.no,a.nikah.suami,a.nikah.istri,a.catatan,a.dataSalah?"YA":"TIDAK",a.lastUpdated]);
    });
    const wsA = XLSX.utils.aoa_to_sheet(rowsA);
    XLSX.utils.book_append_sheet(wb, wsA, "Anggota");

    // Perubahan
    const rowsP = [["Jenis","Rincian","Nama","Tanggal","Dokumen"]];
    data.perubahan.forEach(p=>rowsP.push([p.jenis,p.rincian,p.nama,p.tanggal,p.dok]));
    const wsP = XLSX.utils.aoa_to_sheet(rowsP);
    XLSX.utils.book_append_sheet(wb, wsP, "Perubahan");

    // Verifikasi_RT
    const wsV = XLSX.utils.aoa_to_sheet([["Status","Catatan","Inisial RT"],[data.verif.statusValidasi,data.verif.catatanVerifikasi,data.verif.inisialRT]]);
    XLSX.utils.book_append_sheet(wb, wsV, "Verifikasi_RT");

    // Deteksi
    const rowsD = [["Nomor KK","Nama Anggota","Jenis Mismatch","Detail","Tanggal"]];
    data.deteksi.forEach(d=>rowsD.push([d.nomorKK,d.anggota,d.jenis,d.detail,d.tanggal]));
    const wsD = XLSX.utils.aoa_to_sheet(rowsD);
    XLSX.utils.book_append_sheet(wb, wsD, "Deteksi");

    XLSX.writeFile(wb, `KK_${k.nomorKK||"tanpa_nomor"}.xlsx`);
  }
};

/* ======= Form finals table & Dashboard ======= */
Form.renderFinalsTable = function(){
  const tbody = document.querySelector('#finalTable tbody');
  tbody.innerHTML = "";
  const finals = Storage.getFinals();
  finals.forEach((rec, i)=>{
    const hasErr = rec.deteksi && rec.deteksi.length>0;
    const tr = document.createElement('tr');
    tr.className = hasErr ? 'bad' : 'ok';
    const addr = `${rec.kk.alamat.jalan}, ${rec.kk.alamat.desa}, ${rec.kk.alamat.kecamatan}, ${rec.kk.alamat.kabupaten}, ${rec.kk.alamat.provinsi}`;
    tr.innerHTML = `
      <td>${rec.kk.nomorKK}</td>
      <td>${rec.kk.kepalaKeluarga}</td>
      <td>${rec.kk.rt}/${rec.kk.rw}</td>
      <td>${addr}</td>
      <td>${rec.kk.jumlahAnggota}</td>
      <td>${rec.verif.statusValidasi}</td>
      <td>${hasErr ? '⚠️ '+rec.deteksi.length+' temuan' : '✅ Bersih'}</td>
      <td><button class="btn" onclick="Dashboard.inspect(${i})">Detail</button></td>
    `;
    tbody.appendChild(tr);
  });
};

/* ======= Dashboard ======= */
const Dashboard = {
  render(){
    const finals = Storage.getFinals();
    // stats
    const totalKK = finals.length;
    let totalAnggota = 0; let totalErr = 0; let perluUpdate = 0;
    finals.forEach(f=>{
      totalAnggota += (f.anggota||[]).length;
      totalErr += (f.deteksi||[]).length;
      (f.anggota||[]).forEach(a=>{
        try{
          const dt = new Date(a.lastUpdated);
          if((Date.now()-dt.getTime())/(1000*60*60*24) > 30) perluUpdate++;
        }catch(e){}
      });
    });
    document.getElementById('statKK').textContent = totalKK;
    document.getElementById('statAnggota').textContent = totalAnggota;
    document.getElementById('statErr').textContent = totalErr;
    document.getElementById('statUpdate').textContent = perluUpdate;

    // filter & mismatch table
    const filter = document.getElementById('dashFilter').value;
    const tbody = document.querySelector('#mismatchTable tbody');
    tbody.innerHTML = "";
    finals.forEach(f=>{
      // build rows depending on filter
      if(filter==='all' || filter==='error'){
        (f.deteksi||[]).forEach(d=>{
          if(filter==='error' && !d) return;
          const tr = document.createElement('tr');
          tr.className = 'warn';
          tr.innerHTML = `<td>${f.kk.nomorKK}</td><td>${d.anggota}</td><td>${d.jenis}</td><td>${d.detail}</td><td>${d.tanggal}</td>`;
          tbody.appendChild(tr);
        });
      }
      if(filter==='penambahan' || filter==='pengurangan' || filter==='koreksi'){
        (f.perubahan||[]).forEach(p=>{
          if(p.jenis.toLowerCase()!==filter) return;
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${f.kk.nomorKK}</td><td>${p.nama||'-'}</td><td>${p.jenis}</td><td>${p.rincian} (${p.dok||'-'})</td><td>${p.tanggal||'-'}</td>`;
          tbody.appendChild(tr);
        });
      }
    });
  },
  inspect(idx){
    const finals = Storage.getFinals();
    const f = finals[idx];
    if(!f){ alert("Data tidak ditemukan."); return; }
    // Simple detail popup
    const det = (f.deteksi||[]).map(d=>`- ${d.anggota}: ${d.jenis} -> ${d.detail}`).join('\n') || 'Tidak ada';
    alert(
`KK: ${f.kk.nomorKK}
Kepala Keluarga: ${f.kk.kepalaKeluarga}
RT/RW: ${f.kk.rt}/${f.kk.rw}
Jumlah Anggota: ${f.kk.jumlahAnggota}
Status Validasi: ${f.verif.statusValidasi}

Deteksi:
${det}`);
  }
};

/* ======= Init ======= */
window.addEventListener('DOMContentLoaded', ()=>{
  // Prepare blank one anggota for convenience
  Form.addAnggota();
  // One perubahan row by default
  Form.addPerubahan();
  // Load draft if any
  Storage.loadDraft();
  // Prepare finals table if any
  Form.renderFinalsTable();
});
