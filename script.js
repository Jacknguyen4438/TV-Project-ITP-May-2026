let allShows = [];
let allEpisodes = [];
let episodeCache = {};

function setup() {
  fetchShows();
}

// ---------- FETCH SHOWS ----------
function fetchShows() {
  fetch("https://api.tvmaze.com/shows")
    .then(res => res.json())
    .then(data => {
      allShows = data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      populateShowDropdown();
    })
    .catch(() => {
      document.getElementById("error").textContent = "Error loading shows";
    });
}

// ---------- SHOW DROPDOWN ----------
function populateShowDropdown() {
  const select = document.getElementById("showSelect");

  allShows.forEach(show => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    fetchEpisodes(select.value);
  });
}

// ---------- FETCH EPISODES ----------
function fetchEpisodes(showId) {
  document.getElementById("loading").style.display = "block";

  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    document.getElementById("loading").style.display = "none";
    render();
    return;
  }

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then(res => res.json())
    .then(data => {
      episodeCache[showId] = data;
      allEpisodes = data;
      document.getElementById("loading").style.display = "none";
      render();
    })
    .catch(() => {
      document.getElementById("loading").style.display = "none";
      document.getElementById("error").textContent = "Error loading episodes";
    });
}

// ---------- RENDER ----------
function render() {
  makePageForEpisodes(allEpisodes);
  setupSearch();
  setupEpisodeSelector();
  updateCount(allEpisodes);
}

function makePageForEpisodes(list) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  list.forEach(ep => {
    const card = document.createElement("div");

    const code = formatEpisodeCode(ep.season, ep.number);

    card.innerHTML = `
      <h2>${ep.name} - ${code}</h2>
      <img src="${ep.image?.medium || ""}">
      <p>${ep.summary || ""}</p>
    `;

    root.appendChild(card);
  });
}

// ---------- SEARCH ----------
function setupSearch() {
  const input = document.getElementById("searchInput");

  input.oninput = () => {
    const term = input.value.toLowerCase();

    const filtered = allEpisodes.filter(ep =>
      ep.name.toLowerCase().includes(term) ||
      (ep.summary || "").toLowerCase().includes(term)
    );

    makePageForEpisodes(filtered);
    updateCount(filtered);
  };
}

// ---------- EPISODE SELECT ----------
function setupEpisodeSelector() {
  const select = document.getElementById("episodeSelect");
  select.innerHTML = `<option value="">All Episodes</option>`;

  allEpisodes.forEach(ep => {
    const option = document.createElement("option");

    const code = formatEpisodeCode(ep.season, ep.number);
    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    select.appendChild(option);
  });

  select.onchange = () => {
    if (!select.value) {
      makePageForEpisodes(allEpisodes);
      updateCount(allEpisodes);
      return;
    }

    const selected = allEpisodes.filter(ep => ep.id == select.value);

    makePageForEpisodes(selected);
    updateCount(selected);
  };
}

// ---------- COUNT ----------
function updateCount(list) {
  document.getElementById("episodeCount").textContent =
    `Displaying ${list.length} / ${allEpisodes.length}`;
}

// ---------- FORMAT ----------
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

window.onload = setup;