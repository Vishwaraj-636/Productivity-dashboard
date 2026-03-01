//open cards
function openFeatures() {
  var allElem = document.querySelectorAll(".elem");
  var allFullElem = document.querySelectorAll(".fullElem");
  var allFullElemBackBTN = document.querySelectorAll(".fullElem .back");

  let activePage = localStorage.getItem("activePage");
  if (activePage !== null) {
    allFullElem[activePage].style.display = "block";
  }

  allElem.forEach(function (elem) {
    elem.addEventListener("click", function () {
      allFullElem[elem.id].style.display = "block";
      localStorage.setItem("activePage", elem.id);
    });
  });

  allFullElemBackBTN.forEach(function (back) {
    back.addEventListener("click", function () {
      allFullElem[back.id].style.display = "none";
      localStorage.removeItem("activePage");
    });
  });
}
openFeatures();

//todo list
function todoList() {
  var currentTask = [];

  if (localStorage.getItem("currentTask")) {
    currentTask = JSON.parse(localStorage.getItem("currentTask"));
  } else {
    console.log("Task list is empty");
  }

  function renderTask() {
    var allTask = document.querySelector(".allTask");
    let sum = "";

    currentTask.forEach(function (e, idx) {
      sum =
        sum +
        `<div class="task">
            <h5>${e.task}<span class=${e.imp}>IMP</span></h5>
            <button id =${idx} >Mark as Completed</button>
            </div>`;
    });
    allTask.innerHTML = sum;
    localStorage.setItem("currentTask", JSON.stringify(currentTask));
    document.querySelectorAll(".task button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentTask.splice(btn.id, 1);
        renderTask();
        Location.reload();
      });
    });
  }

  renderTask();

  let form = document.querySelector(".addTask form");
  let taskInput = document.querySelector(".addTask form input");
  let taskDetailsInput = document.querySelector(".addTask form textarea");
  let taskCheckBox = document.querySelector(".addTask form .mark-imp #check");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    currentTask.push({
      task: taskInput.value,
      details: taskDetailsInput.value,
      imp: taskCheckBox.checked,
    });
    renderTask();
    taskCheckBox.checked = false;
    taskInput.value = "";
    taskDetailsInput.value = "";
  });
}
todoList();

//daily planner
function dailyPlanner() {
  var dayPlanner = document.querySelector(".day-planner");
  var dayPlanData = JSON.parse(localStorage.getItem("dayPlanData")) || {};
  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`,
  );

  var wholeDaySum = "";
  hours.forEach(function (elem, idx) {
    var savedData = dayPlanData[idx] || "";
    wholeDaySum =
      wholeDaySum +
      `<div class="day-planner-time">
        <p>${elem}</p>
        <input id=${idx} type="text" placeholder="..."  value=${savedData}>
        </div>`;
  });

  dayPlanner.innerHTML = wholeDaySum;
  var dayPlannerInputs = document.querySelectorAll(".day-planner input");

  dayPlannerInputs.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dayPlanData[elem.id] = elem.value;
      localStorage.setItem("dayPlanData", JSON.stringify(dayPlanData));
    });
  });
}
dailyPlanner();

//motivational quotes
function motivationQuotes() {
  let motivationQuote = document.querySelector(".motivation-2 h1");
  let motivationAuthor = document.querySelector(".motivation-3 h2");

  async function fetchQuote() {
    let response = await fetch("https://api.quotable.io/random");
    let data = await response.json();
    motivationQuote.innerHTML = data.content;
    motivationAuthor.innerHTML = data.author;
  }
  fetchQuote();
}
motivationQuotes();

//pomodoro
function pomodoroTimer() {
  let timerInterval = null;
  let totalSecond = 25 * 60;
  let isWorkSession = true;

  const timer = document.querySelector(".pomo-timer h1");
  const start = document.querySelector(".pomo-timer .start-timer");
  const pause = document.querySelector(".pomo-timer .pause-timer");
  const reset = document.querySelector(".pomo-timer .reset-timer");
  const session = document.querySelector(".session");

  function updateTimer() {
    let min = Math.floor(totalSecond / 60);
    let sec = totalSecond % 60;
    timer.innerHTML = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
      if (totalSecond > 0) {
        totalSecond--;
        updateTimer();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        switchSession();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    isWorkSession = true;
    totalSecond = 25 * 60;

    session.innerHTML = "Work Session";
    session.style.backgroundColor = "var(--orange)";

    updateTimer();
  }

  function switchSession() {
    if (isWorkSession) {
      session.innerHTML = "Take a Break";
      session.style.backgroundColor = "var(--seagreen)";
      totalSecond = 5 * 60;
    } else {
      session.innerHTML = "Work Session";
      session.style.backgroundColor = "var(--orange)";
      totalSecond = 25 * 60;
    }

    isWorkSession = !isWorkSession;
    updateTimer();
    startTimer();
  }

  updateTimer();

  start.addEventListener("click", startTimer);
  pause.addEventListener("click", pauseTimer);
  reset.addEventListener("click", resetTimer);
}
pomodoroTimer();

//weather
async function weatherDashboard() {
  var apikey = "ebdaee08d4be40d090b165131262702";
  var query = "ajmer"; // fallback

  var header1time = document.querySelector(".header1 h1");
  var header1date = document.querySelector(".header1 h2");
  var header1loc = document.querySelector(".header1 h4");
  var header2temp = document.querySelector(".header2 h2");
  var header2condition = document.querySelector(".header2 h4");
  var precip = document.querySelector(".header2 .precipitation");
  var humid = document.querySelector(".header2 .humidity");
  var wind = document.querySelector(".header2 .winds");
  var header = document.querySelector(".allElems header");

  var locationTime = null;

  // STEP 1 — Get user location
  function getUserCoords() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => reject(),
      );
    });
  }

  // STEP 2 — Try getting live location
  try {
    query = await getUserCoords();
  } catch {
    console.log("Location denied — using fallback city");
  }

  // STEP 3 — Fetch weather
  async function weatherApiCall() {
    var response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${query}`,
    );
    var data = await response.json();

    locationTime = data.location.localtime;

    header2temp.innerHTML = `${data.current.temp_c}°C`;
    header2condition.innerHTML = `${data.current.condition.text}`;
    precip.innerHTML = `Precipitation: ${data.current.precip_mm} mm`;
    humid.innerHTML = `Humidity: ${data.current.humidity}%`;
    wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;
    header1loc.innerHTML = `${data.location.name}, ${data.location.region}`;
  }

  // STEP 4 — Time + Theme
  function timeDate() {
    if (!locationTime) return;

    const Weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthsOfYear = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var date = new Date(locationTime);

    var dayOfWeek = Weekdays[date.getDay()];
    var hours = date.getHours();
    var mins = date.getMinutes();
    var seconds = date.getSeconds();
    var month = monthsOfYear[date.getMonth()];
    var tarik = date.getDate();
    var year = date.getFullYear();

    header1date.innerHTML = `${tarik} ${month}, ${year}`;

    let displayHour = hours % 12 || 12;
    let ampm = hours >= 12 ? "pm" : "am";

    header1time.innerHTML = `${dayOfWeek}, ${String(displayHour).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${ampm}`;

    if (hours >= 5 && hours < 12) {
      header.style.backgroundImage =
        'url("https://images.unsplash.com/photo-1514519273132-6a1abd48302c?q=80&w=1170&auto=format&fit=crop")';
    } else if (hours >= 12 && hours < 17) {
      header.style.backgroundImage =
        'url("https://images.unsplash.com/photo-1609129465734-dd1ea8b46e11?q=80&w=1170&auto=format&fit=crop")';
    } else if (hours >= 17 && hours < 21) {
      header.style.backgroundImage =
        'url("https://images.unsplash.com/photo-1687183277718-52cc79e4102a?q=80&w=1170&auto=format&fit=crop")';
    } else {
      header.style.backgroundImage =
        'url("https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1170&auto=format&fit=crop")';
    }
  }

  await weatherApiCall();
  setInterval(timeDate, 1000);
}
weatherDashboard();

function themeChange() {
  var theme = document.querySelector(".theme");
  var rootElem = document.documentElement;
  var flag = 0;

  theme.addEventListener("click", function () {
    if (flag === 0) {
      rootElem.style.setProperty("--pri", "#F3F4F4");
      rootElem.style.setProperty("--sec", "#5F9598");
      rootElem.style.setProperty("--ter1", "#1D546D");
      rootElem.style.setProperty("--ter2", "#061E29");
      flag = 1;
    } else if (flag === 1) {
      rootElem.style.setProperty("--pri", "#f5d6b8");
      rootElem.style.setProperty("--sec", "#c26d17");
      rootElem.style.setProperty("--ter1", "#9c5824");
      rootElem.style.setProperty("--ter2", "#54321b");
      flag = 2;
    } else {
      rootElem.style.setProperty("--pri", "#EDEDCE");
      rootElem.style.setProperty("--sec", "#629FAD");
      rootElem.style.setProperty("--ter1", "#296374");
      rootElem.style.setProperty("--ter2", "#0C2C55");
      flag = 0;
    }
  });
}
themeChange();
