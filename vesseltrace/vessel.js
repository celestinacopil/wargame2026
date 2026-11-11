"use strict";
(() => {
  const main = document.getElementById("record");
  const imo = new URLSearchParams(location.search).get("imo");
  const v = (window.VESSELS || []).find(x => x.imo === imo);

  // Every value comes from catalog.js, but escape anyway so a typo can't break the page.
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  if (!v) {
    main.innerHTML = '<div class="crumbs">HOME › SHIP DATABASE › RECORD</div>' +
      '<div class="box"><div class="boxbody"><div class="empty">No vessel found with this IMO number. ' +
      '<a href="index.html">Return to search</a>.</div></div></div>';
    return;
  }

  // 72.705 -> 72°42.30′N (the usual format on AIS sites)
  function dm(value, pos, neg, degWidth) {
    const hemi = value >= 0 ? pos : neg;
    const a = Math.abs(value);
    let deg = Math.floor(a);
    let min = (a - deg) * 60;
    if (min >= 59.995) { deg += 1; min = 0; }
    return String(deg).padStart(degWidth, "0") + "°" + min.toFixed(2).padStart(5, "0") + "′" + hemi;
  }

  const kv = rows => rows.map(([k, val]) => "<div>" + esc(k) + "</div><div>" + esc(val || "-") + "</div>").join("");

  const company = (role, c) =>
    '<div class="company"><div class="role">' + esc(role) + "</div><strong>" + esc(c.name) + "</strong>" +
    '<div class="meta">' + esc(c.address) + "</div>" +
    '<div class="meta">Since: ' + esc(c.since) + "</div></div>";

  const positionRows = [...v.positions].map(p => {
    if (p.gap) return '<tr class="gap"><td colspan="6">' + esc(p.gap) + "</td></tr>";
    return "<tr><td>" + esc(p.t) + " UTC</td>" +
      "<td>" + esc(dm(p.lat, "N", "S", 2)) + "<br><span class=\"meta\">" + esc(p.lat.toFixed(4)) + "</span></td>" +
      "<td>" + esc(dm(p.lon, "E", "W", 3)) + "<br><span class=\"meta\">" + esc(p.lon.toFixed(4)) + "</span></td>" +
      "<td>" + esc(p.sog.toFixed(1)) + " kn / " + esc(p.cog) + "°</td>" +
      "<td>" + esc(p.nav) + "</td><td>" + esc(p.area) + "</td></tr>";
  }).join("");

  const callRows = v.portCalls.map(c =>
    "<tr><td>" + esc(c.port) + "</td><td>" + esc(c.arrived ? c.arrived + " UTC" : "-") + "</td><td>" +
    esc(c.departed ? c.departed + " UTC" : "In port") + "</td></tr>").join("");

  document.title = v.name + " - IMO " + v.imo + " - Ship owner, manager, ISM data | VesselTrace";

  main.innerHTML =
    '<div class="crumbs">HOME › SHIP DATABASE › ' + esc(v.name) + "</div>" +

    '<section class="box"><div class="boxbody titlebar"><div>' +
      "<h1>" + esc(v.name) + "</h1>" +
      '<div class="flag">' + esc(v.type) + " · Flag: " + esc(v.flag) + " · IMO " + esc(v.imo) + " · MMSI " + esc(v.mmsi) + "</div>" +
    '</div><span class="pill">' + esc(v.status) + "</span></div></section>" +

    '<div class="grid2">' +
      '<section class="box"><div class="boxhead"><h2>Vessel particulars</h2></div><div class="boxbody"><div class="kv">' +
        kv([
          ["Vessel name", v.name], ["IMO number", v.imo], ["MMSI", v.mmsi], ["Call sign", v.callsign],
          ["Flag", v.flag], ["Home port", v.homeport], ["Vessel type", v.type],
          ["Gross tonnage", v.gt], ["Deadweight (t)", v.dwt], ["Length overall", v.loa],
          ["Breadth", v.beam], ["Max draught", v.draught], ["Year built", v.built], ["Builder", v.builder],
          ["Hull / livery", v.livery], ["Deck equipment", v.equipment], ["Former names", v.formerNames.join("; ") || "None recorded"]
        ]) +
      "</div></div></section>" +

      '<section class="box"><div class="boxhead"><h2>Ship owner, manager and ISM</h2></div><div class="boxbody">' +
        company("Registered owner", v.owner) +
        company("Ship manager / commercial manager", v.manager) +
        company("ISM manager (DOC company)", v.ism) +
        '<p class="notice">Ownership data is taken from the latest declarations to the flag registry. The registered owner may itself be owned by another company.</p>' +
      "</div></section>" +
    "</div>" +

    '<section class="box"><div class="boxhead"><h2>AIS position history</h2><span class="meta">Times in UTC · newest first</span></div>' +
      '<div class="boxbody scroll"><table><thead><tr><th>Time received</th><th>Latitude</th><th>Longitude</th><th>Speed / course</th><th>Navigation status</th><th>Area</th></tr></thead>' +
      "<tbody>" + positionRows + "</tbody></table>" +
      '<p class="notice">Positions are shown as reported by the ship\'s AIS transponder. Gaps mean that no signal was received.</p></div></section>' +

    '<section class="box"><div class="boxhead"><h2>Recent port calls</h2></div>' +
      '<div class="boxbody scroll"><table><thead><tr><th>Port</th><th>Arrival</th><th>Departure</th></tr></thead>' +
      "<tbody>" + callRows + "</tbody></table></div></section>";
})();
