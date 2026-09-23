const API = "/api/results";

let allResults = [];
let editingId = null;

const sections = document.querySelectorAll(".section");
const navItems = document.querySelectorAll(".nav-item");

const resultForm = document.getElementById("resultForm");
const subjectsContainer = document.getElementById("subjectsContainer");

const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("resultModal");
const modalContent = document.getElementById("modalContent");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


document.addEventListener("DOMContentLoaded", () => {
  addSubject();
  loadResults();
});


/* NAVIGATION */

function showSection(sectionId) {
  sections.forEach((section) => {
    section.classList.toggle(
      "active",
      section.id === sectionId
    );
  });

  navItems.forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.section === sectionId
    );
  });

  const titles = {
    dashboard: "Dashboard",
    results: "Student Results",
    addResult: "Add Result"
  };

  document.getElementById("pageTitle").textContent =
    titles[sectionId] || "Dashboard";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


navItems.forEach((item) => {
  item.addEventListener("click", () => {
    showSection(item.dataset.section);
  });
});


document.getElementById("heroAddBtn").addEventListener("click", () => {
  resetForm();
  showSection("addResult");
});


document.getElementById("resultsAddBtn").addEventListener("click", () => {
  resetForm();
  showSection("addResult");
});


document.getElementById("viewAllBtn").addEventListener("click", () => {
  showSection("results");
});


document.getElementById("refreshBtn").addEventListener("click", loadResults);


document.getElementById("cancelBtn").addEventListener("click", () => {
  resetForm();
  showSection("dashboard");
});


/* LOAD RESULTS */

async function loadResults() {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error("Unable to load results");
    }

    allResults = await response.json();

    updateDashboard();
    renderResults(allResults);
    renderRecentResults();

  } catch (error) {
    showToast("Unable to connect to server", true);
  }
}


/* DASHBOARD */

function updateDashboard() {
  const total = allResults.length;

  const passed = allResults.filter(
    result => result.status === "PASS"
  ).length;

  const failed = total - passed;

  const average =
    total === 0
      ? 0
      : (
          allResults.reduce(
            (sum, result) => sum + result.percentage,
            0
          ) / total
        ).toFixed(1);

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("passedStudents").textContent = passed;
  document.getElementById("failedStudents").textContent = failed;
  document.getElementById("averagePercentage").textContent =
    `${average}%`;
}


/* RECENT RESULTS */

function renderRecentResults() {
  const container = document.getElementById("recentTable");

  const results = allResults.slice(0, 5);

  if (results.length === 0) {
    container.innerHTML = emptyRow(7);
    return;
  }

  container.innerHTML = results.map(result => `
    <tr>
      <td class="student-cell">
        <strong>${escapeHTML(result.name)}</strong>
        <span>${escapeHTML(result.studentId)}</span>
      </td>

      <td>${escapeHTML(shortDepartment(result.department))}</td>

      <td>Sem ${result.semester}</td>

      <td>${result.percentage}%</td>

      <td class="grade">${result.grade}</td>

      <td>
        <span class="badge ${result.status === "PASS" ? "pass" : "fail"}">
          ${result.status}
        </span>
      </td>

      <td>
        <button
          class="action-btn"
          onclick="viewResult('${result.studentId}')"
          title="View"
        >
          <i class="bi bi-eye"></i>
        </button>
      </td>
    </tr>
  `).join("");
}


/* RESULTS TABLE */

function renderResults(results) {
  const container = document.getElementById("resultsTable");

  if (results.length === 0) {
    container.innerHTML = emptyRow(9);
    return;
  }

  container.innerHTML = results.map(result => `
    <tr>

      <td class="student-cell">
        <strong>${escapeHTML(result.name)}</strong>
        <span>${escapeHTML(result.studentId)}</span>
      </td>

      <td>${escapeHTML(shortDepartment(result.department))}</td>

      <td>${result.year}</td>

      <td>${result.semester}</td>

      <td>${result.total}/${result.maximum}</td>

      <td>${result.percentage}%</td>

      <td class="grade">${result.grade}</td>

      <td>
        <span class="badge ${result.status === "PASS" ? "pass" : "fail"}">
          ${result.status}
        </span>
      </td>

      <td>
        <div class="action-group">

          <button
            class="action-btn"
            onclick="viewResult('${result.studentId}')"
            title="View"
          >
            <i class="bi bi-eye"></i>
          </button>

          <button
            class="action-btn"
            onclick="editResult('${result._id}')"
            title="Edit"
          >
            <i class="bi bi-pencil"></i>
          </button>

          <button
            class="action-btn delete"
            onclick="deleteResult('${result._id}')"
            title="Delete"
          >
            <i class="bi bi-trash"></i>
          </button>

        </div>
      </td>

    </tr>
  `).join("");
}


/* SEARCH */

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = allResults.filter(result =>
    result.studentId.toLowerCase().includes(query) ||
    result.name.toLowerCase().includes(query) ||
    result.department.toLowerCase().includes(query)
  );

  renderResults(filtered);
});


/* SUBJECT */

document.getElementById("addSubjectBtn").addEventListener(
  "click",
  addSubject
);


function addSubject(data = {}) {
  const row = document.createElement("div");

  row.className = "subject-row";

  row.innerHTML = `
    <div class="form-group">
      <label>Subject</label>

      <input
        class="subject-name"
        type="text"
        placeholder="Subject name"
        value="${escapeAttribute(data.name || "")}"
        required
      >
    </div>

    <div class="form-group">
      <label>Internal / 40</label>

      <input
        class="internal-mark"
        type="number"
        min="0"
        max="40"
        placeholder="0"
        value="${data.internal ?? ""}"
        required
      >
    </div>

    <div class="form-group">
      <label>External / 60</label>

      <input
        class="external-mark"
        type="number"
        min="0"
        max="60"
        placeholder="0"
        value="${data.external ?? ""}"
        required
      >
    </div>

    <button
      type="button"
      class="remove-subject"
      title="Remove subject"
    >
      <i class="bi bi-trash"></i>
    </button>
  `;

  row
    .querySelector(".remove-subject")
    .addEventListener("click", () => {
      if (subjectsContainer.children.length === 1) {
        showToast("At least one subject is required", true);
        return;
      }

      row.remove();
    });

  subjectsContainer.appendChild(row);
}


/* FORM SUBMIT */

resultForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const subjects = [];

  document.querySelectorAll(".subject-row").forEach(row => {
    subjects.push({
      name: row.querySelector(".subject-name").value.trim(),
      internal: Number(
        row.querySelector(".internal-mark").value
      ),
      external: Number(
        row.querySelector(".external-mark").value
      )
    });
  });

  if (subjects.length === 0) {
    showToast("Add at least one subject", true);
    return;
  }

  const invalid = subjects.some(subject =>
    !subject.name ||
    subject.internal < 0 ||
    subject.internal > 40 ||
    subject.external < 0 ||
    subject.external > 60
  );

  if (invalid) {
    showToast("Please enter valid subject marks", true);
    return;
  }

  const payload = {
    studentId: document.getElementById("studentId").value.trim(),
    name: document.getElementById("studentName").value.trim(),
    department: document.getElementById("department").value,
    year: Number(document.getElementById("year").value),
    semester: Number(document.getElementById("semester").value),
    subjects
  };

  try {
    const url = editingId
      ? `${API}/${editingId}`
      : API;

    const method = editingId
      ? "PUT"
      : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Operation failed");
    }

    showToast(
      editingId
        ? "Result updated successfully"
        : "Result added successfully"
    );

    resetForm();

    await loadResults();

    showSection("results");

  } catch (error) {
    showToast(error.message, true);
  }
});


/* EDIT */

function editResult(id) {
  const result = allResults.find(
    item => item._id === id
  );

  if (!result) return;

  editingId = id;

  document.getElementById("formTitle").textContent =
    "Edit Student Result";

  document.getElementById("studentId").value =
    result.studentId;

  document.getElementById("studentName").value =
    result.name;

  document.getElementById("department").value =
    result.department;

  document.getElementById("year").value =
    result.year;

  document.getElementById("semester").value =
    result.semester;

  subjectsContainer.innerHTML = "";

  result.subjects.forEach(subject => {
    addSubject(subject);
  });

  showSection("addResult");
}


/* DELETE */

async function deleteResult(id) {
  const result = allResults.find(
    item => item._id === id
  );

  if (!result) return;

  const confirmed = confirm(
    `Delete result of ${result.name} (${result.studentId})?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Delete failed");
    }

    showToast("Result deleted successfully");

    await loadResults();

  } catch (error) {
    showToast(error.message, true);
  }
}


/* VIEW RESULT */

function viewResult(studentId) {
  const result = allResults.find(
    item => item.studentId === studentId
  );

  if (!result) return;

  modalContent.innerHTML = `
    <div class="result-header">

      <h2>${escapeHTML(result.name)}</h2>

      <p>
        ${escapeHTML(result.studentId)}
        · ${escapeHTML(result.department)}
        · Year ${result.year}
        · Semester ${result.semester}
      </p>

    </div>


    <div class="result-summary">

      <div class="summary-item">
        <span>Total Marks</span>
        <strong>${result.total}/${result.maximum}</strong>
      </div>

      <div class="summary-item">
        <span>Percentage</span>
        <strong>${result.percentage}%</strong>
      </div>

      <div class="summary-item">
        <span>Grade</span>
        <strong>${result.grade}</strong>
      </div>

      <div class="summary-item">
        <span>Status</span>
        <strong>${result.status}</strong>
      </div>

    </div>


    <div class="table-wrapper">

      <table>

        <thead>
          <tr>
            <th>Subject</th>
            <th>Internal</th>
            <th>External</th>
            <th>Total</th>
            <th>Grade</th>
          </tr>
        </thead>

        <tbody>

          ${result.subjects.map(subject => `
            <tr>
              <td>${escapeHTML(subject.name)}</td>
              <td>${subject.internal}/40</td>
              <td>${subject.external}/60</td>
              <td>${subject.total}/100</td>
              <td class="grade">${subject.grade}</td>
            </tr>
          `).join("")}

        </tbody>

      </table>

    </div>
  `;

  modal.classList.add("show");
}


document.getElementById("modalClose").addEventListener(
  "click",
  closeModal
);


modal.addEventListener("click", event => {
  if (event.target === modal) {
    closeModal();
  }
});


function closeModal() {
  modal.classList.remove("show");
}


/* RESET FORM */

function resetForm() {
  editingId = null;

  resultForm.reset();

  document.getElementById("formTitle").textContent =
    "Add Student Result";

  subjectsContainer.innerHTML = "";

  addSubject();
}


/* TOAST */

function showToast(message, error = false) {
  toastMessage.textContent = message;

  toast.classList.toggle("error", error);

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


/* HELPERS */

function shortDepartment(department) {
  const map = {
    "Computer Science & Engineering": "CSE",
    "Information Technology": "IT",
    "Electronics & Communication Engineering": "ECE",
    "Electrical & Electronics Engineering": "EEE",
    "Mechanical Engineering": "Mechanical",
    "Civil Engineering": "Civil"
  };

  return map[department] || department;
}


function emptyRow(columns) {
  return `
    <tr>
      <td colspan="${columns}">
        <div class="empty">
          <i class="bi bi-journal-x"></i>
          No student results found.
        </div>
      </td>
    </tr>
  `;
}


function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {
  return escapeHTML(value);
}