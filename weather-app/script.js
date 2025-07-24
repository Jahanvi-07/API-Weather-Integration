const apiKey = '64edae56aacd9863630a5e0927b9e60c'; // 🔁 Replace with your actual OpenWeatherMap API key

// Get weather by city name
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

function getWeather(city) {
  const cityInput = city || document.getElementById("cityInput").value.trim();
  if (!cityInput) return;

  showLoader(true);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      displayWeather(data);
      saveSearch(cityInput);
    })
    .catch(err => alert(err.message))
    .finally(() => showLoader(false));
}

function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  showLoader(true);
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          displayWeather(data);
          saveSearch(data.name);
        })
        .catch(err => alert("Failed to fetch location weather"))
        .finally(() => showLoader(false));
    },
    () => {
      showLoader(false);
      alert("Location access denied");
    }
  );
}

function displayWeather(data) {
  document.getElementById("weatherCard").style.display = "block";
  document.getElementById("cityName").innerText = data.name;
  document.getElementById("description").innerText = data.weather[0].description;
  document.getElementById("temp").innerText = data.main.temp;
  document.getElementById("feels_like").innerText = data.main.feels_like;
  document.getElementById("humidity").innerText = data.main.humidity;
  document.getElementById("wind").innerText = data.wind.speed;
  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem("weatherSearches")) || [];
  if (!searches.includes(city)) {
    searches.push(city);
    localStorage.setItem("weatherSearches", JSON.stringify(searches));
    renderSearchHistory();
  }
}

function renderSearchHistory() {
  let searches = JSON.parse(localStorage.getItem("weatherSearches")) || [];
  const list = document.getElementById("searchHistory");
  list.innerHTML = "";
  searches.slice().reverse().forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => getWeather(city);
    list.appendChild(li);
  });
}

document.getElementById("themeSwitch").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
  document.getElementById("themeLabel").textContent = e.target.checked ? "☀️ Light Mode" : "🌙 Dark Mode";
});

window.onload = renderSearchHistory;
