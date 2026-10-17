/* Shared settings. Use game passwords, not personal passwords.
   This is a browser-only gate. All public source and resource URLs remain visible.
   Each challenge is configured in its own HTML file, not here. */
window.WARGAME = {
  storagePrefix: "wargame2026-v2:",
  roles: {
    "darsenia-government": { name: "Darsenia | Government", password: "darsenia-gov2026", page: "teams/darsenia-government.html", country: "Darsenia", cyber: false },
    "darsenia-cyber": { name: "Darsenia | Cyber team", password: "darsenia2026", page: "teams/darsenia-cyber.html", country: "Darsenia", cyber: true },
    "belvaria-government": { name: "Belvaria | Government", password: "belvaria-gov2026", page: "teams/belvaria-government.html", country: "Belvaria", cyber: false },
    "belvaria-cyber": { name: "Belvaria | Cyber team", password: "belvaria2026", page: "teams/belvaria-cyber.html", country: "Belvaria", cyber: true }
  }
};
