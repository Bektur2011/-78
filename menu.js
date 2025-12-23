import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Firebase конфиг
const firebaseConfig = {
  apiKey: "AIzaSyB282pAV5W1BGfUHw_bUS4azdyrLnrtg8g",
  authDomain: "myproject-457eb.firebaseapp.com",
  projectId: "myproject-457eb",
  storageBucket: "myproject-457eb.firebasestorage.app",
  messagingSenderId: "356410285792",
  appId: "1:356410285792:web:c22e09bf8151042da87a85"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

  const lessonsContainer = document.getElementById("lessonsContainer");
  const lessonSelect = document.getElementById("lessonSelect");

  const newLessonInput = document.getElementById("newLessonInput");
  const newDZInput = document.getElementById("newDZInput");
  const newDZDate = document.getElementById("newDZDate");

  const addLessonBtn = document.getElementById("addLessonBtn");
  const addDZBtn = document.getElementById("addDZBtn");

  /* =====================
     Загрузка уроков и ДЗ
  ====================== */
  async function loadLessons() {
    lessonsContainer.innerHTML = "";
    lessonSelect.innerHTML = "";

    const snapshot = await getDocs(collection(db, "lessons"));

    snapshot.forEach(docSnap => {
      const lesson = docSnap.data();
      const lessonId = docSnap.id;

      // карточка урока
      const div = document.createElement("div");
      div.className = "card";
      div.style.border = "1px solid #ccc";
      div.style.borderRadius = "10px";
      div.style.padding = "10px";
      div.style.marginBottom = "10px";

      div.innerHTML = `
        <h3>${lesson.name}</h3>
        <ul>
          ${(lesson.dz || []).map(dz => `
            <li>
              ${dz.text.length > 20 ? dz.text.slice(0,20) + "..." : dz.text}
              <span title="${dz.date}" style="color:gray;font-size:12px;">📅</span>
            </li>`).join("")}
        </ul>
      `;

      lessonsContainer.appendChild(div);

      // option для select
      const option = document.createElement("option");
      option.value = lessonId;
      option.textContent = lesson.name;
      lessonSelect.appendChild(option);
    });
  }

  /* =====================
     Добавить урок
  ====================== */
  addLessonBtn.addEventListener("click", async () => {
    const name = newLessonInput.value.trim();
    if (!name) return alert("Введите название урока");

    await addDoc(collection(db, "lessons"), { name, dz: [] });
    newLessonInput.value = "";
    loadLessons();
  });

  /* =====================
     Добавить ДЗ
  ====================== */
  addDZBtn.addEventListener("click", async () => {
    const lessonId = lessonSelect.value;
    const text = newDZInput.value.trim();
    const date = newDZDate.value;

    if (!lessonId || !text || !date) return alert("Заполни все поля");

    // Получаем урок по ID
    const lessonRef = doc(db, "lessons", lessonId);
    const snapshot = await getDocs(collection(db, "lessons"));
    snapshot.forEach(async docSnap => {
      if (docSnap.id === lessonId) {
        const data = docSnap.data();
        const updatedDZ = data.dz || [];
        updatedDZ.push({ text, date });

        // Обновляем документ
        await setDoc(lessonRef, { ...data, dz: updatedDZ });
      }
    });

    newDZInput.value = "";
    newDZDate.value = "";
    loadLessons(); // обновляем список
  });

  /* Старт загрузки */
  loadLessons();
});
