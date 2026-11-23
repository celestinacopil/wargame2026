"use strict";
(() => {
  try {
    const role = sessionStorage.getItem(window.WARGAME.storagePrefix + "session");
    const team = window.WARGAME.roles[role];
    if (team) document.getElementById("team-link").href = "../" + team.page;
  } catch { /* The tools remain accessible without browser storage. */ }
})();
