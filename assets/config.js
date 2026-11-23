/* Shared settings. Use game passwords, not personal passwords.
   This is a browser-only gate. All public source and resource URLs remain visible.
   Each challenge is configured in its own HTML file, not here. */
window.WARGAME = {
  storagePrefix: "wargame2026-v2:",
  roles: {
    "aldeia-government": { name: "Aldeia | Government", password: "aldeia2026", page: "teams/aldeia-government.html", country: "Aldeia", cyber: false },
    "aldeia-cyber": { name: "Aldeia | Cyber team", password: "aldeia2026", page: "teams/aldeia-cyber.html", country: "Aldeia", cyber: true },
    "bessarovia-government": { name: "Bessarovia | Government", password: "bessarovia2026", page: "teams/bessarovia-government.html", country: "Bessarovia", cyber: false },
    "bessarovia-cyber": { name: "Bessarovia | Cyber team", password: "bessarovia2026", page: "teams/bessarovia-cyber.html", country: "Bessarovia", cyber: true }
  }
};
