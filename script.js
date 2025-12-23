const users = [
  {
    login: "eb34_12",
    name: "Бектур",
    role: "admin"
  },
  {
    login: "eb34_34",
    name: "Даткайым",
    role: "user"
  },
  {
    login: "eb57_09",
    name: "Сабина",
    role: "user"
  },
  {
    login: "eb58_99",
    name: "Примбай",
    role: "user"
  },
  {
    login: "kd18_01",
    name: "Исхак",
    role: "user"
  },
  {
    login: "kd88_01",
    name: "Даян",
    role: "user"
  },
  {
    login: "lm45_22",
    name: "Аяна",
    role: "user"
  },
  {
    login: "rz12_77",
    name: "Алия",
    role: "user"
  },
  {
    login: "qt33_08",
    name: "Аяна",
    role: "user"
  },
  {
    login: "yn65_14",
    name: "Азема",
    role: "user"
  },
  {
    login: "vb09_56",
    name: "Асия",
    role: "user"
  },
  {
    login: "tg78_02",
    name: "Даткайым",
    role: "admin"
  },
  {
    login: "hw23_91",
    name: "Сумая",
    role: "user"
  },
  {
    login: "js11_44",
    name: "элина",
    role: "user"
  },
  {
    login: "mn67_05",
    name: "Мырзабек",
    role: "user"
  },
  {
    login: "pk49_88",
    name: "Аман",
    role: "user"
  },
  {
    login: "rx20_36",
    name: "Балбай",
    role: "user"
  },
  {
    login: "qc81_12",
    name: "Алинур",
    role: "user"
  },
  {
    login: "zl55_33",
    name: "Биймырза",
    role: "user"
  },
  {
    login: "bf42_07",
    name: "Алманбет",
    role: "user"
  },
  {
    login: "dv76_19",
    name: "Элхан",
    role: "user"
  },
  {
    login: "gw98_21",
    name: "Кубат",
    role: "user"
  },
  {
    login: "ht04_50",
    name: "Барсбек",
    role: "user"
  },
  {
    login: "jm62_38",
    name: "Канат",
    role: "user"
  },
  {
    login: "kr31_66",
    name: "Айша",
    role: "user"
  },
  {
    login: "ns17_09",
    name: "Нурбийке",
    role: "user"
  },
  {
    login: "pl90_03",
    name: "Диана",
    role: "user"
  },
  {
    login: "sz28_41",
    name: "Айданек",
    role: "user"
  },
  {
    login: "vx06_72",
    name: "Айбике",
    role: "user"
  },
  {
    login: "wy53_15",
    name: "Айзирек",
    role: "user"
  }
];

const loginInput = document.getElementById("loginInput");
const loginBtn = document.getElementById("loginBtn");
const errorText = document.getElementById("error");

loginBtn.addEventListener("click", () => {
  const value = loginInput.value.trim();

  const user = users.find(u => u.login === value);

  if (!user) {
    errorText.textContent = "Неверный логин";
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "menu.html";
});