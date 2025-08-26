document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("umkmForm");
  const saveDraftBtn = document.getElementById("saveDraft");
  const saveFinalBtn = document.getElementById("saveFinal");
  const tableBody = document.querySelector("#dataTable tbody");
  const exportBtn = document.getElementById("exportExcel");

  // Load draft jika ada
  loadDraft();
  loadFinalData();

  saveDraftBtn.addEventListener("click", () => {
    const draftData = getFormData();
    localStorage.setItem("umkmDraft", JSON.stringify(draftData));
    alert("Draft berhasil disimpan!");
  });

  saveFinalBtn.addEventListener("click", () => {
    const formData = getFormData();

    // Hapus draft setelah final
    localStorage.removeItem("umkmDraft");

    // Simpan ke final data
    let data = JSON.parse(localStorage.getItem("umkmData")) || [];
    data.push(formData);
    localStorage.setItem("umkmData", JSON.stringify(data));

    addRowToTable(formData);
    form.reset();
    alert("Data berhasil disimpan final!");
  });

  exportBtn.addEventListener("click", () => {
    let data = JSON.parse(localStorage.getItem("umkmData")) || [];
    if (data.length === 0) {
      alert("Belum ada data final untuk diexport!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UMKM");
    XLSX.writeFile(workbook, "data_umkm.xlsx");
  });

  function getFormData() {
    return {
      nama: document.getElementById("nama").value,
      usaha: document.getElementById("usaha").value,
      sektor: document.getElementById("sektor").value,
      alamat: document.getElementById("alamat").value,
      hp: document.getElementById("hp").value
    };
  }

  function loadDraft() {
    const draft = JSON.parse(localStorage.getItem("umkmDraft"));
    if (draft) {
      document.getElementById("nama").value = draft.nama;
      document.getElementById("usaha").value = draft.usaha;
      document.getElementById("sektor").value = draft.sektor;
      document.getElementById("alamat").value = draft.alamat;
      document.getElementById("hp").value = draft.hp;
    }
  }

  function loadFinalData() {
    let data = JSON.parse(localStorage.getItem("umkmData")) || [];
    data.forEach(item => addRowToTable(item));
  }

  function addRowToTable(item) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.usaha}</td>
      <td>${item.sektor}</td>
      <td>${item.alamat}</td>
      <td>${item.hp}</td>
    `;
    tableBody.appendChild(row);
  }
});
