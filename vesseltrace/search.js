"use strict";
(() => {
  const vessels = window.VESSELS || [];
  const form = document.getElementById("search-form");
  const input = document.getElementById("query");
  const results = document.getElementById("results");
  const count = document.getElementById("count");

  const norm = s => String(s || "").toLowerCase().trim();
  // "SEA" should match "SEA STAR" and "SEASTAR" alike.
  const squash = s => norm(s).replace(/[\s.-]/g, "");

  function haystack(v) {
    // Type and flag are left out on purpose: "Research" contains "sea".
    return [v.name, v.imo, v.mmsi, v.callsign,
      v.owner.name, v.manager.name, v.ism.name, ...v.formerNames].join(" ");
  }

  function cell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
  }

  function render() {
    const raw = input.value;
    const term = squash(raw);
    results.innerHTML = "";

    if (term.length < 2) {
      count.textContent = "Enter a search term";
      results.innerHTML = '<div class="empty">Enter at least 2 characters to search the database.</div>';
      return;
    }

    const found = vessels.filter(v => squash(haystack(v)).includes(term));
    count.textContent = found.length + " vessel" + (found.length === 1 ? "" : "s") + " found";

    if (!found.length) {
      results.innerHTML = '<div class="empty">No vessels match this search. Check the spelling or try an IMO number.</div>';
      return;
    }

    const table = document.createElement("table");
    table.className = "results";
    table.innerHTML = "<thead><tr><th>Vessel name</th><th>IMO</th><th>MMSI</th><th>Type</th><th>Flag</th><th>Built</th></tr></thead>";
    const body = document.createElement("tbody");

    found.forEach(v => {
      const tr = document.createElement("tr");
      const nameCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = "vessel.html?imo=" + encodeURIComponent(v.imo);
      link.textContent = v.name;
      nameCell.appendChild(link);
      tr.append(nameCell, cell(v.imo), cell(v.mmsi), cell(v.type), cell(v.flag), cell(v.built));
      body.appendChild(tr);
    });

    table.appendChild(body);
    results.appendChild(table);
  }

  form.addEventListener("submit", e => { e.preventDefault(); render(); });
  input.addEventListener("input", render);

  const q = new URLSearchParams(location.search).get("q");
  if (q) { input.value = q; render(); }
})();
