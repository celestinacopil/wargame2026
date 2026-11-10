
"use strict";

(() => {
  const form = document.getElementById("konekt-form");
  const input = document.getElementById("konekt-search");
  const results = document.getElementById("searchResults");
  const feed = document.getElementById("konekt-feed");

  const catalog = window.KONEKT_CATALOG || [];

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function search(event) {
    if (event) event.preventDefault();

    const query = normalize(input.value);

    if (!query) {
      results.hidden = true;
      if (feed) feed.hidden = false;
      return;
    }

    const matches = catalog.filter(person => {
      const terms = [
        person.name,
        person.username,
        ...(person.aliases || [])
      ];

      return terms.some(term =>
        normalize(term).includes(query)
      );
    });

    results.replaceChildren();
    results.hidden = false;

    if (feed) feed.hidden = true;

    const heading = document.createElement("h1");
    heading.textContent = "People";
    results.appendChild(heading);

    const count = document.createElement("p");
    count.className = "muted";
    count.textContent =
      matches.length + " matching profile(s)";
    results.appendChild(count);

    if (matches.length === 0) {
      const message = document.createElement("div");
      message.className = "noresult";
      message.textContent =
        "No profiles found. Try another name.";
      results.appendChild(message);
      return;
    }

    matches.forEach(person => {
      const row = document.createElement("div");
      row.className = "result";

      const avatar = document.createElement("div");
      avatar.className = "avatar";
      avatar.textContent = person.initials;

      const details = document.createElement("div");

      const link = document.createElement("a");
      link.href = person.file;
      link.textContent = person.name;

      const description = document.createElement("div");
      description.className = "muted";
      description.textContent = person.description;

      details.append(link, description);
      row.append(avatar, details);
      results.appendChild(row);
    });

    history.replaceState(
      null,
      "",
      location.pathname + "?q=" +
        encodeURIComponent(input.value.trim())
    );
  }

  form.addEventListener("submit", search);

  const supplied =
    new URLSearchParams(location.search).get("q");

  if (supplied) {
    input.value = supplied;
    search();
  }
})();
