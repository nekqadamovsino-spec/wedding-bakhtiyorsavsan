const config = window.WEDDING_CONFIG;
const weddingDate = new Date(config.date);

function formatDate(date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => { element.textContent = value; });
}

setText("[data-groom]", config.groom);
setText("[data-bride]", config.bride);
setText("[data-wedding-date]", formatDate(weddingDate));
setText("[data-venue]", config.venue);
setText("[data-region]", config.region);
setText("[data-address]", config.address);
setText("[data-event-time]", config.time);
document.title = `${config.groom} и ${config.bride} — ${formatDate(weddingDate)}`;
document.querySelector("[data-map-link]").href = config.mapLink;

function renderCalendar() {
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const selectedDay = weddingDate.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const grid = document.querySelector("[data-calendar-grid]");

  setText("[data-calendar-month]", monthNames[month]);
  setText("[data-calendar-year]", year);
  grid.replaceChildren();

  for (let index = 0; index < mondayOffset; index += 1) {
    const empty = document.createElement("span");
    empty.className = "calendar-card__empty";
    grid.append(empty);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement("span");
    cell.textContent = day;
    if (day === selectedDay) cell.className = "calendar-card__date calendar-card__date--accent";
    grid.append(cell);
  }
}

renderCalendar();

const counters = {
  days: document.querySelector('[data-unit="days"]'),
  hours: document.querySelector('[data-unit="hours"]'),
  minutes: document.querySelector('[data-unit="minutes"]'),
  seconds: document.querySelector('[data-unit="seconds"]')
};

function updateCountdown() {
  const delta = Math.max(0, weddingDate.getTime() - Date.now());
  const values = {
    days: Math.floor(delta / 86400000),
    hours: Math.floor(delta / 3600000) % 24,
    minutes: Math.floor(delta / 60000) % 60,
    seconds: Math.floor(delta / 1000) % 60
  };
  Object.entries(values).forEach(([unit, value]) => {
    counters[unit].textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

document.documentElement.classList.add("js", "motion-ready");
const revealItems = document.querySelectorAll(".section__inner > *, .marquee-strip");
revealItems.forEach((item) => item.classList.add("reveal-item"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
