function setup() {
  const allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
  setupDropdown(allEpisodes);
}

// ---------------------- DISPLAY ----------------------

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; // clear old content

  episodeList.forEach(episode => {
    const card = document.createElement("div");
    card.classList.add("episode-card");

    const code = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;

    const title = document.createElement("h2");
    title.textContent = `${episode.name} – ${code}`;

    const img = document.createElement("img");
    img.setAttribute("src", episode.image.medium);
    img.setAttribute("alt", episode.name);

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;

    const link = document.createElement("a");
    link.setAttribute("href", episode.url);
    link.setAttribute("target", "_blank");
    link.textContent = "Source: TVMaze.com";

    card.appendChild(title);
    card.appendChild(img);
    card.appendChild(summary);
    card.appendChild(link);

    rootElem.appendChild(card);
  });
}


window.onload = setup;
