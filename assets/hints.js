"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const ENDPOINT =
    "https://script.google.com/macros/s/AKfycbz8QSXWB9BYDkzIy3YRxAcgyArsc5Dy32RIl-YjmpOSLS7kQhGpSX-DEuhSvIXtuL9aow/exec";

  const VALID_TEAMS = [
    "darsenia-government",
    "darsenia-cyber",
    "belvaria-government",
    "belvaria-cyber"
  ];

 function getTeam(button) {
  const team = button.dataset.team;
  return VALID_TEAMS.includes(team) ? team : null;
}

  function readSaved(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The request can still be recorded without local storage.
    }
  }

  async function recordHint(request) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        body: new URLSearchParams(request),
        signal: controller.signal,
        credentials: "omit",
        redirect: "follow"
      });

      if (!response.ok) {
        throw new Error("The logging service returned an error.");
      }

      const result = await response.json();

      if (
        result.ok !== true ||
        result.requestId !== request.requestId
      ) {
        throw new Error("The logging service did not confirm the request.");
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  document.querySelectorAll(".hint-button").forEach((button) => {
    const hintId = button.dataset.hintId;
    const source = button.dataset.source || window.location.pathname;

    const passages = Array.from(
      document.querySelectorAll("[data-hint]")
    ).filter((element) => element.dataset.hint === hintId);

    // Reuse the status element if one is already present.
    let status = button.nextElementSibling;

    if (!status || !status.classList.contains("hint-status")) {
      status = document.createElement("p");
      status.className = "hint-status";
      button.after(status);
    }

    status.setAttribute("role", "status");

    if (!hintId || passages.length === 0) {
      button.disabled = true;
      status.textContent =
        "This hint is not configured. Contact an organiser.";
      return;
    }

    let busy = false;
    const pendingRequests = new Map();

    function reveal() {
      passages.forEach((element) => {
        element.classList.add("hint-highlight");
      });

      button.textContent = "Hint revealed";
      button.disabled = true;
      status.textContent =
        "Hint revealed. The request is recorded in the organisers’ log.";
    }

    button.addEventListener("click", async () => {
      if (busy) return;

      const team = getTeam(button);

      if (!team) {
        status.textContent =
          "Open this source from the correct team dashboard. Your team session is missing or does not match this challenge.";
        return;
      }

      // Separate records for each team, source and hint.
      // This uses a new key so old, unlogged unlocks are not restored.
      const key =
        "wargame2026:logged-hint:" +
        team + ":" + source + ":" + hintId;

      const saved = readSaved(key);

      if (saved && saved.confirmed === true) {
        reveal();
        return;
      }

      const confirmed = window.confirm(
        "Request this hint for " + team + "?\n\n" +
        "The organisers will receive a record of your team, " +
        "this source and the hint requested."
      );

      if (!confirmed) return;

      // Keep the same request ID when retrying an uncertain request.
      let request =
        pendingRequests.get(team) ||
        (saved && saved.request);

      if (
        !request ||
        request.team !== team ||
        request.source !== source ||
        request.hint !== hintId ||
        !request.requestId
      ) {
        request = {
          team,
          source,
          hint: hintId,
          requestId: crypto.randomUUID()
        };
      }

      pendingRequests.set(team, request);
      save(key, { confirmed: false, request });

      busy = true;
      button.disabled = true;
      button.textContent = "Recording request…";
      status.textContent = "Please wait for confirmation.";

      try {
        await recordHint(request);

        save(key, { confirmed: true, request });
        reveal();

        passages[0].scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "center"
        });
      } catch (error) {
        console.error("Hint logging failed:", error);

        button.disabled = false;
        button.textContent = "Retry hint request";
        status.textContent =
          "Recording could not be confirmed. The hint remains hidden. " +
          "Retry or contact an organiser.";
      } finally {
        busy = false;
      }
    });
  });
});
