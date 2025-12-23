const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "index.html";

const welcome = document.getElementById("welcome");
welcome.textContent = user.role === "admin"
  ? `Добро пожаловать, админ ${user.name}`
  : `Добро пожаловать, ${user.name}`;

document.getElementById("historyBtn").addEventListener("click", () => {
  window.location.href = "history.html";
});

const API_BASE = 'http://localhost:3001'; // Изменить на production URL, например 'https://your-backend.herokuapp.com'
let lessons = [];
const lessonsContainer = document.getElementById("lessonsContainer");

async function loadLessons() {
  try {
    const response = await fetch(`${API_BASE}/lessons`);
    lessons = await response.json();
    renderLessons();
    updateLessonSelect();
  } catch (error) {
    console.error('Error loading lessons:', error);
    // Fallback to localStorage if backend unavailable
    lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    renderLessons();
    updateLessonSelect();
  }
}

function formatDate(dateStr) {
  const months = ["января","февраля","марта","апреля","мая","июня",
                  "июля","августа","сентября","октября","ноября","декабря"];
  const date = new Date(dateStr);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
}

function renderLessons() {
  lessonsContainer.innerHTML = "";
  lessons.forEach((lesson, index) => {
    const card = document.createElement("div");
    card.className = "lesson-card";

    const dzList = lesson.dz.map(d => {
      const shortText = d.text.length > 20 ? d.text.slice(0, 20) + "…" : d.text;
      return `<li title="${formatDate(d.date)}">${shortText}</li>`;
    }).join("");

    card.innerHTML = `
      <h3>${lesson.name}</h3>
      <ul>${dzList}</ul>
      ${user.role === "admin" ? `<button class="deleteBtn">❌</button>` : ""}
      <button class="settingsBtn">⚙️</button>
    `;

    if (user.role === "admin") {
      card.querySelector(".deleteBtn").onclick = async () => {
        try {
          const response = await fetch(`${API_BASE}/lessons/${index}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user })
          });
          if (response.ok) {
            lessons.splice(index, 1);
            renderLessons();
            updateLessonSelect();
          } else {
            alert('Ошибка удаления');
          }
        } catch (error) {
          console.error('Error deleting lesson:', error);
        }
      };
    }

    card.querySelector(".settingsBtn").onclick = () => openSettingsModal(index);
    lessonsContainer.appendChild(card);
  });
}

function updateLessonSelect() {
  const select = document.getElementById("lessonSelect");
  select.innerHTML = "";
  lessons.forEach((lesson, index) => {
    const option = document.createElement("option");
    option.value = index; option.textContent = lesson.name;
    select.appendChild(option);
  });
}

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalDZList = document.getElementById("modalDZList");
const closeModalBtn = document.getElementById("closeModalBtn");

function openSettingsModal(lessonIndex) {
  const lesson = lessons[lessonIndex];
  modalTitle.textContent = lesson.name;
  modalDZList.innerHTML = lesson.dz.map(d => {
    return `<li><strong>${d.text}</strong> — ${formatDate(d.date)}</li>`;
  }).join("");
  modalOverlay.classList.remove("hidden");
}

closeModalBtn.onclick = () => modalOverlay.classList.add("hidden");

const adminControls = document.getElementById("adminControls");
adminControls.style.display = user.role === "admin" ? "flex" : "none";

updateLessonSelect();

if (user.role === "admin") {

  document.getElementById("addLessonBtn").addEventListener("click", async () => {
    const name = document.getElementById("newLessonInput").value.trim();
    if (name) {
      try {
        const response = await fetch(`${API_BASE}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, user })
        });
        if (response.ok) {
          const newLesson = await response.json();
          lessons.push(newLesson);
          document.getElementById("newLessonInput").value = "";
          renderLessons();
          updateLessonSelect();
        } else {
          alert('Ошибка добавления урока');
        }
      } catch (error) {
        console.error('Error adding lesson:', error);
      }
    }
  });

  document.getElementById("addDZBtn").addEventListener("click", async () => {
    const lessonIndex = document.getElementById("lessonSelect").value;
    if (lessonIndex === "") {
      alert("Выберите урок");
      return;
    }
    const dzText = document.getElementById("newDZInput").value.trim();
    const dzDate = document.getElementById("newDZDate").value;

    if (!dzText || !dzDate) {
      alert("Введите текст ДЗ и дату!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/lessons/${lessonIndex}/dz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dzText, date: dzDate, user })
      });
      if (response.ok) {
        lessons[lessonIndex].dz.push({ text: dzText, date: dzDate });
        renderLessons();
        document.getElementById("newDZInput").value = "";
        document.getElementById("newDZDate").value = "";
      } else {
        alert('Ошибка добавления ДЗ');
      }
    } catch (error) {
      console.error('Error adding DZ:', error);
    }
  });
}

loadLessons();
