// Navigasi antar section
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Simpan data ke localStorage
document.getElementById("dataForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let warga = {
    nama: document.getElementById("nama").value,
    nik: document.getElementById("nik").value,
    ayah: document.getElementById("ayah").value,
    ibu: document.getElementById("ibu").value,
    pendidikan: document.getElementById("pendidikan").value,
    pekerjaan: document.getElementById("pekerjaan").value
  };

  let data = JSON.parse(localStorage.getItem("wargaData")) || [];
  data.push(warga);
  localStorage.setItem("wargaData", JSON.stringify(data));

  alert("Data berhasil disimpan!");
  this.reset();
  loadData();
  showSection("dashboard");
});

// Load data ke dashboard
function loadData() {
  let tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  let data = JSON.parse(localStorage.getItem("wargaData")) || [];

  data.forEach(w => {
    let status = cekValidasi(w);
    let row = `<tr>
      <td>${w.nama}</td>
      <td>${w.nik}</td>
      <td>${w.ayah}</td>
      <td>${w.ibu}</td>
      <td>${w.pendidikan}</td>
      <td>${w.pekerjaan}</td>
      <td>${status}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// Fungsi cek kesalahan data sederhana
function cekValidasi(w) {
  let errors = [];
  if (w.nama.split(" ").length < 2) errors.push("Nama tidak lengkap");
  if (w.nik.length !== 16) errors.push("NIK tidak valid");
  if (!w.pendidikan) errors.push("Pendidikan kosong");
  if (!w.pekerjaan) errors.push("Pekerjaan kosong");
  return errors.length > 0 ? "❌ " + errors.join(", ") : "✅ Valid";
}

// Load awal
window.onload = loadData;
