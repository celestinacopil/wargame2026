"use strict";
(() => {
  const form = document.getElementById("distance-form");
  const result = document.getElementById("result");

  // Turns "72°41.00′N", "72 41.0 N", "72.6833" or "-33.5" into decimal degrees.
  // Returns NaN if the text can't be read or is out of range.
  function parse(text, isLat) {
    // A copied table cell holds two lines ("72°42.30′N" and "72.7050"); use the first.
    let s = (String(text).split(/\r?\n/).map(x => x.trim()).find(Boolean) || "").toUpperCase();
    if (!s) return NaN;

    let sign = 1;
    const hemi = s.match(/[NSEW]/);
    if (hemi) {
      if ((isLat && "EW".includes(hemi[0])) || (!isLat && "NS".includes(hemi[0]))) return NaN;
      if (hemi[0] === "S" || hemi[0] === "W") sign = -1;
      s = s.replace(/[NSEW]/g, " ");
    }
    if (s.trim().startsWith("-")) { sign *= -1; s = s.replace("-", " "); }

    // Keep only the numbers: degrees, then optional minutes, then optional seconds.
    const nums = s.replace(/[°º'′"″,]/g, " ").trim().split(/\s+/).filter(Boolean).map(Number);
    if (!nums.length || nums.length > 3 || nums.some(n => !isFinite(n) || n < 0)) return NaN;
    const [deg, min = 0, sec = 0] = nums;
    if (min >= 60 || sec >= 60) return NaN;

    const value = sign * (deg + min / 60 + sec / 3600);
    const limit = isLat ? 90 : 180;
    return Math.abs(value) <= limit ? value : NaN;
  }

  // Great-circle distance (haversine), in kilometres.
  function distanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371.0088;
    const rad = d => d * Math.PI / 180;
    const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function show(text, isError) {
    result.hidden = false;
    result.className = "result" + (isError ? " error" : "");
    result.innerHTML = text;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const fields = [["lat1", true], ["lon1", false], ["lat2", true], ["lon2", false]];
    const values = fields.map(([id, isLat]) => parse(document.getElementById(id).value, isLat));
    const bad = fields.filter((_, i) => isNaN(values[i])).map(([id]) => id.startsWith("lat") ? "latitude" : "longitude");

    if (bad.length) {
      show("Could not read one or more values. Check each " + [...new Set(bad)].join(" and ") +
        " (for example 72°41.00′N or 72.6833).", true);
      return;
    }

    const km = distanceKm(...values);
    const nm = km / 1.852;
    show("Distance: <strong>" + nm.toFixed(1) + " nm</strong> (" + km.toFixed(1) + " km)");
  });
})();
