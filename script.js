// =========================================
// EduCGPA - GPA & CGPA Calculator
// =========================================

// ---------- DATA STORAGE ----------
let subjects = [];
let semesters = [];

// =========================================
// GPA SECTION
// =========================================

function addSubject() {
    const name = document.getElementById("subjectName").value.trim();
    const gradeSelect = document.getElementById("subjectGrade");
    const gradePoint = parseFloat(gradeSelect.value);
    const gradeText = gradeSelect.options[gradeSelect.selectedIndex].text;
    const credit = parseFloat(document.getElementById("subjectCredit").value);

    if (!name || isNaN(credit) || credit <= 0) {
        alert("Please enter a valid subject name and credit points.");
        return;
    }

    // Add subject object
    subjects.push({
        name: name,
        gradeText: gradeText,
        gradePoint: gradePoint,
        credit: credit
    });

    renderSubjects();

    // Clear input fields
    document.getElementById("subjectName").value = "";
    document.getElementById("subjectCredit").value = "";
}

function renderSubjects() {
    const tbody = document.querySelector("#gpaTable tbody");
    tbody.innerHTML = "";

    subjects.forEach((sub, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${sub.name}</td>
                <td>${sub.gradeText}</td>
                <td>${sub.credit}</td>
                <td>
                    <button class="action-btn delete-btn"
                            onclick="deleteSubject(${index})">
                        ❌ Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    renderSubjects();
    calculateGPA();
}

function calculateGPA() {
    if (subjects.length === 0) {
        document.getElementById("gpaResult").textContent = "0.00";
        return;
    }

    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach(sub => {
        totalCredits += sub.credit;
        totalPoints += sub.credit * sub.gradePoint;
    });

    const gpa = totalPoints / totalCredits;

    document.getElementById("gpaResult").textContent = gpa.toFixed(2);
}

function resetGPA() {
    subjects = [];
    renderSubjects();

    document.getElementById("gpaResult").textContent = "0.00";
    document.getElementById("subjectName").value = "";
    document.getElementById("subjectCredit").value = "";
}

// =========================================
// CGPA SECTION
// =========================================

function addSemester() {
    const name = document.getElementById("semesterName").value.trim();
    const gpa = parseFloat(document.getElementById("semesterGPA").value);

    if (!name || isNaN(gpa) || gpa < 0 || gpa > 10) {
        alert("Please enter a valid semester name and GPA (0 - 10).");
        return;
    }

    semesters.push({
        name: name,
        gpa: gpa
    });

    renderSemesters();

    // Clear inputs
    document.getElementById("semesterName").value = "";
    document.getElementById("semesterGPA").value = "";
}

function renderSemesters() {
    const tbody = document.querySelector("#cgpaTable tbody");
    tbody.innerHTML = "";

    semesters.forEach((sem, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${sem.name}</td>
                <td>${sem.gpa.toFixed(2)}</td>
                <td>
                    <button class="action-btn delete-btn"
                            onclick="deleteSemester(${index})">
                        ❌ Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteSemester(index) {
    semesters.splice(index, 1);
    renderSemesters();
    calculateCGPA();
}

function calculateCGPA() {
    if (semesters.length === 0) {
        document.getElementById("cgpaResult").textContent = "0.00";
        return;
    }

    let totalGPA = 0;

    semesters.forEach(sem => {
        totalGPA += sem.gpa;
    });

    const cgpa = totalGPA / semesters.length;

    document.getElementById("cgpaResult").textContent = cgpa.toFixed(2);
}

function resetCGPA() {
    semesters = [];
    renderSemesters();

    document.getElementById("cgpaResult").textContent = "0.00";
    document.getElementById("semesterName").value = "";
    document.getElementById("semesterGPA").value = "";
}

// =========================================
// OPTIONAL: SAMPLE DATA FOR TESTING
// Remove this section if you don't want demo data
// =========================================

window.onload = function () {
    subjects = [
        { name: "Maths", gradeText: "A+ (9.00)", gradePoint: 9, credit: 4 },
        { name: "Science", gradeText: "A (8.00)", gradePoint: 8, credit: 3 }
    ];

    semesters = [
        { name: "Semester 1", gpa: 7.10 },
        { name: "Semester 2", gpa: 8.50 }
    ];

    renderSubjects();
    renderSemesters();

    calculateGPA();
    calculateCGPA();
};