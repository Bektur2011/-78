function formatDate(dateStr) {
  const months = ["января","февраля","марта","апреля","мая","июня",
                  "июля","августа","сентября","октября","ноября","декабря"];
  const date = new Date(dateStr);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} года`;
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "menu.html";
});

let lessons = JSON.parse(localStorage.getItem("lessons")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
const now = new Date();

// Переносим ДЗ старше 14 дней в историю
lessons.forEach(lesson => {
  const remainingDZ = [];
  lesson.dz.forEach(dz => {
    const dzDate = new Date(dz.date);
    const diffDays = (now - dzDate)/(1000*60*60*24);
    if(diffDays > 14) {
      history.push({ lesson: lesson.name, text: dz.text, date: dz.date });
    } else {
      remainingDZ.push(dz);
    }
  });
  lesson.dz = remainingDZ;
});

localStorage.setItem("lessons", JSON.stringify(lessons));
localStorage.setItem("history", JSON.stringify(history));

const historyList = document.getElementById("historyList");
if(history.length === 0){
  historyList.innerHTML = "<li>Пока нет старых ДЗ</li>";
} else {
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.lesson}: ${item.text} — ${formatDate(item.date)}`;
    historyList.appendChild(li);
  });
}
