const calendar = document.getElementById("calendar");
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const selectedDateText = document.getElementById("selectedDate");
const monthYear = document.getElementById("monthYear");

let selectedDate = "";
let currentYear, currentMonth;

const days = ['일', '월', '화', '수', '목', '금', '토'];

function generateCalendar(year, month) {
  calendar.innerHTML = "";

  // 요일 헤더
  days.forEach(day => {
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = day;
    calendar.appendChild(div);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 빈 칸
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
  }

  for (let date = 1; date <= lastDate; date++) {
    const div = document.createElement("div");
    div.className = "date";
    div.textContent = date;
    div.onclick = () => selectDate(year, month, date);
    calendar.appendChild(div);
  }

  monthYear.textContent = `${year}년 ${month + 1}월`;
}

function selectDate(year, month, date) {
  selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
  selectedDateText.textContent = `선택된 날짜: ${selectedDate}`;
  taskList.innerHTML = "";
}

function addTask() {
  if (!selectedDate) {
    alert("날짜를 먼저 선택하세요!");
    return;
  }
  const task = taskInput.value.trim();
  if (task) {
    const li = document.createElement("li");
    li.textContent = `[${selectedDate}] ${task}`;
    taskList.appendChild(li);
    taskInput.value = "";
  }
}

function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear -= 1;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear += 1;
  }
  generateCalendar(currentYear, currentMonth);
}

// 초기 세팅
const today = new Date();
currentYear = today.getFullYear();
currentMonth = today.getMonth();
generateCalendar(currentYear, currentMonth);
