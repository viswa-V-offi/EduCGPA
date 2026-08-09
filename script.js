// ---- state ----
let subjects = [];   // { id, name, grade, gradeLabel, credit }
let semesters = [];  // { id, name, gpa }
let editingSubjectId = null;
let editingSemesterId = null;
let nextId = 1;

const gradeLabels = { "10": "O", "9": "A+", "8": "A", "7": "B+", "6": "B", "5": "C", "0": "U" };

// ---- elements ----
const subjectForm = document.getElementById('subjectForm');
const subjectsBody = document.getElementById('subjectsBody');
const gpaResult = document.getElementById('gpaResult');
const subjectSubmitBtn = document.getElementById('subjectSubmitBtn');
const resetGpaBtn = document.getElementById('resetGpaBtn');

const semesterForm = document.getElementById('semesterForm');
const semestersBody = document.getElementById('semestersBody');
const cgpaResult = document.getElementById('cgpaResult');
const semesterSubmitBtn = document.getElementById('semesterSubmitBtn');
const resetCgpaBtn = document.getElementById('resetCgpaBtn');

const cgpaValue = document.getElementById('cgpaValue');
const gaugeSub = document.getElementById('gaugeSub');
const gaugeProgress = document.getElementById('gaugeProgress');
const needle = document.getElementById('needle');

// ---- gauge setup ----
const gaugeLength = gaugeProgress.getTotalLength();
gaugeProgress.style.strokeDasharray = gaugeLength;
gaugeProgress.style.strokeDashoffset = gaugeLength;

function updateGauge(value) {
  const clamped = Math.max(0, Math.min(10, value));
  const fraction = clamped / 10;
  gaugeProgress.style.strokeDashoffset = gaugeLength * (1 - fraction);
  const angle = fraction * 180 - 90; // -90deg (left) to +90deg (right)
  needle.style.transform = `rotate(${angle}deg)`;
  cgpaValue.textContent = clamped.toFixed(2);
}

// ---- subjects (GPA) ----
function renderSubjects() {
  if (subjects.length === 0) {
    subjectsBody.innerHTML = '<tr class="empty-row"><td colspan="4">No subjects added yet.</td></tr>';
  } else {
    subjectsBody.innerHTML = subjects.map(s => `
      <tr>
        <td>${escapeHtml(s.name)}</td>
        <td><span class="pill">${s.gradeLabel}</span></td>
        <td>${s.credit}</td>
        <td class="row-actions">
          <button class="icon-btn edit" data-id="${s.id}" data-type="subject" aria-label="Edit">✎</button>
          <button class="icon-btn delete" data-id="${s.id}" data-type="subject" aria-label="Delete">✕</button>
        </td>
      </tr>
    `).join('');
  }

  const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);
  const totalPoints = subjects.reduce((sum, s) => sum + (s.grade * s.credit), 0);
  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  gpaResult.textContent = gpa.toFixed(2);
}

subjectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('subjectName').value.trim();
  const grade = parseFloat(document.getElementById('subjectGrade').value);
  const credit = parseFloat(document.getElementById('subjectCredit').value);
  if (!name || isNaN(credit) || credit < 0) return;

  if (editingSubjectId !== null) {
    const s = subjects.find(x => x.id === editingSubjectId);
    s.name = name; s.grade = grade; s.gradeLabel = gradeLabels[grade]; s.credit = credit;
    editingSubjectId = null;
    subjectSubmitBtn.textContent = 'Add';
    subjectSubmitBtn.classList.remove('editing');
  } else {
    subjects.push({ id: nextId++, name, grade, gradeLabel: gradeLabels[grade], credit });
  }

  subjectForm.reset();
  renderSubjects();
});

subjectsBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.icon-btn');
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  if (btn.classList.contains('delete')) {
    subjects = subjects.filter(s => s.id !== id);
    if (editingSubjectId === id) {
      editingSubjectId = null;
      subjectForm.reset();
      subjectSubmitBtn.textContent = 'Add';
      subjectSubmitBtn.classList.remove('editing');
    }
    renderSubjects();
  } else if (btn.classList.contains('edit')) {
    const s = subjects.find(x => x.id === id);
    document.getElementById('subjectName').value = s.name;
    document.getElementById('subjectGrade').value = s.grade;
    document.getElementById('subjectCredit').value = s.credit;
    editingSubjectId = id;
    subjectSubmitBtn.textContent = 'Update';
    subjectSubmitBtn.classList.add('editing');
  }
});

resetGpaBtn.addEventListener('click', () => {
  subjects = [];
  editingSubjectId = null;
  subjectForm.reset();
  subjectSubmitBtn.textContent = 'Add';
  subjectSubmitBtn.classList.remove('editing');
  renderSubjects();
});

// ---- semesters (CGPA) ----
function renderSemesters() {
  if (semesters.length === 0) {
    semestersBody.innerHTML = '<tr class="empty-row"><td colspan="3">No semesters added yet.</td></tr>';
  } else {
    semestersBody.innerHTML = semesters.map(s => `
      <tr>
        <td>${escapeHtml(s.name)}</td>
        <td>${s.gpa.toFixed(2)}</td>
        <td class="row-actions">
          <button class="icon-btn edit" data-id="${s.id}" data-type="semester" aria-label="Edit">✎</button>
          <button class="icon-btn delete" data-id="${s.id}" data-type="semester" aria-label="Delete">✕</button>
        </td>
      </tr>
    `).join('');
  }

  const cgpa = semesters.length > 0
    ? semesters.reduce((sum, s) => sum + s.gpa, 0) / semesters.length
    : 0;
  cgpaResult.textContent = cgpa.toFixed(2);
  updateGauge(cgpa);
  gaugeSub.textContent = semesters.length > 0
    ? `Averaged across ${semesters.length} semester${semesters.length > 1 ? 's' : ''}`
    : 'Add semesters to see your CGPA';
}

semesterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('semesterName').value.trim();
  const gpa = parseFloat(document.getElementById('semesterGpa').value);
  if (!name || isNaN(gpa) || gpa < 0 || gpa > 10) return;

  if (editingSemesterId !== null) {
    const s = semesters.find(x => x.id === editingSemesterId);
    s.name = name; s.gpa = gpa;
    editingSemesterId = null;
    semesterSubmitBtn.textContent = 'Add';
    semesterSubmitBtn.classList.remove('editing');
  } else {
    semesters.push({ id: nextId++, name, gpa });
  }

  semesterForm.reset();
  renderSemesters();
});

semestersBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.icon-btn');
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  if (btn.classList.contains('delete')) {
    semesters = semesters.filter(s => s.id !== id);
    if (editingSemesterId === id) {
      editingSemesterId = null;
      semesterForm.reset();
      semesterSubmitBtn.textContent = 'Add';
      semesterSubmitBtn.classList.remove('editing');
    }
    renderSemesters();
  } else if (btn.classList.contains('edit')) {
    const s = semesters.find(x => x.id === id);
    document.getElementById('semesterName').value = s.name;
    document.getElementById('semesterGpa').value = s.gpa;
    editingSemesterId = id;
    semesterSubmitBtn.textContent = 'Update';
    semesterSubmitBtn.classList.add('editing');
  }
});

resetCgpaBtn.addEventListener('click', () => {
  semesters = [];
  editingSemesterId = null;
  semesterForm.reset();
  semesterSubmitBtn.textContent = 'Add';
  semesterSubmitBtn.classList.remove('editing');
  renderSemesters();
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- init ----
renderSubjects();
renderSemesters();