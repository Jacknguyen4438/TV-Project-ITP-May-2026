function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
  setupDropdown(allEpisodes);
}

// ---------------------- DISPLAY ----------------------

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  const count = document.createElement("p");
  count.textContent = `Displaying ${episodeList.length} episode(s)`;
  rootElem.appendChild(count);

  episodeList.forEach(ep => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const code = `S${ep.season.toString().padStart(2, "0")}E${ep.number
      .toString()
      .padStart(2, "0")}`;

    card.innerHTML = `
      <h3>${ep.name} - ${code}</h3>
      <img src="${ep.image.medium}" />
      <div>${ep.summary}</div>
    `;

    rootElem.appendChild(card);
  });
}

// ---------------------- SEARCH ----------------------

function setupSearch(allEpisodes) {
  const searchInput = document.getElementById("episode-search");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = allEpisodes.filter(ep => {
      return (
        ep.name.toLowerCase().includes(searchTerm) ||
        ep.summary.toLowerCase().includes(searchTerm)
      );
    });

    makePageForEpisodes(filtered);
  });
}

// ---------------------- DROPDOWN ----------------------

function setupDropdown(allEpisodes) {
  const select = document.createElement("select");

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "Select an episode...";
  select.appendChild(defaultOption);

  allEpisodes.forEach(ep => {
    const option = document.createElement("option");

    const code = `S${ep.season.toString().padStart(2, "0")}E${ep.number
      .toString()
      .padStart(2, "0")}`;

    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    select.appendChild(option);
  });

  document.body.insertBefore(select, document.getElementById("root"));

  select.addEventListener("change", () => {
    const selected = allEpisodes.find(ep => ep.id == select.value);
    makePageForEpisodes([selected]);
  });
}

window.onload = setup;