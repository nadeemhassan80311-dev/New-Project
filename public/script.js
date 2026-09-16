const teacherForm = document.getElementById("teacherForm");

const teacherId = document.getElementById("teacherId");

const nameInput = document.getElementById("name");

const ageInput = document.getElementById("age");

const salaryInput = document.getElementById("salary");

const educationInput = document.getElementById("education");

const teacherTable = document.getElementById("teacherTable");

const submitButton = document.getElementById("submitButton");

const cancelButton = document.getElementById("cancelButton");

const formTitle = document.getElementById("formTitle");


// ======================================
// READ - Load all teachers
// ======================================

async function loadTeachers() {

    try {

        const response = await fetch("/api/teachers");

        const teachers = await response.json();

        teacherTable.innerHTML = "";

        if (teachers.length === 0) {

            teacherTable.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-message">
                        No teachers found
                    </td>
                </tr>
            `;

            return;
        }


        teachers.forEach(function (teacher) {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${teacher.id}</td>

                <td>${teacher.name}</td>

                <td>${teacher.age}</td>

                <td>${teacher.salary}</td>

                <td>${teacher.education}</td>

                <td>

                    <button
                        class="edit-button"
                        onclick="editTeacher(${teacher.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteTeacher(${teacher.id})"
                    >
                        Delete
                    </button>

                </td>

            `;

            teacherTable.appendChild(row);

        });

    } catch (error) {

        console.log(error);

        alert("Unable to load teachers");

    }

}


// ======================================
// CREATE + UPDATE
// ======================================

teacherForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const id = teacherId.value;

    const teacherData = {

        name: nameInput.value,

        age: Number(ageInput.value),

        salary: Number(salaryInput.value),

        education: educationInput.value

    };


    try {

        let response;


        // UPDATE

        if (id) {

            response = await fetch(`/api/teachers/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(teacherData)

            });

        }

        // CREATE

        else {

            response = await fetch("/api/teachers", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(teacherData)

            });

        }


        const result = await response.json();


        if (!response.ok) {

            alert(result.error || "Something went wrong");

            return;

        }


        if (id) {

            alert("Teacher updated successfully");

        } else {

            alert("Teacher added successfully");

        }


        cancelEdit();

        loadTeachers();


    } catch (error) {

        console.log(error);

        alert("Server error");

    }

});


// ======================================
// EDIT
// ======================================

async function editTeacher(id) {

    try {

        const response = await fetch("/api/teachers");

        const teachers = await response.json();

        const teacher = teachers.find(function (item) {

            return item.id === id;

        });


        if (!teacher) {

            alert("Teacher not found");

            return;

        }


        teacherId.value = teacher.id;

        nameInput.value = teacher.name;

        ageInput.value = teacher.age;

        salaryInput.value = teacher.salary;

        educationInput.value = teacher.education;


        formTitle.innerText = "Edit Teacher";

        submitButton.innerText = "Update Teacher";

        cancelButton.style.display = "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.log(error);

        alert("Unable to edit teacher");

    }

}


// ======================================
// DELETE
// ======================================

async function deleteTeacher(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this teacher?"
    );


    if (!confirmDelete) {

        return;

    }


    try {

        const response = await fetch(`/api/teachers/${id}`, {

            method: "DELETE"

        });


        const result = await response.json();


        if (!response.ok) {

            alert(result.error || "Delete failed");

            return;

        }


        alert("Teacher deleted successfully");

        loadTeachers();


    } catch (error) {

        console.log(error);

        alert("Server error");

    }

}


// ======================================
// CANCEL EDIT
// ======================================

function cancelEdit() {

    teacherId.value = "";

    nameInput.value = "";

    ageInput.value = "";

    salaryInput.value = "";

    educationInput.value = "";


    formTitle.innerText = "Add Teacher";

    submitButton.innerText = "Add Teacher";

    cancelButton.style.display = "none";

}


// ======================================
// Load teachers when page opens
// ======================================

loadTeachers();