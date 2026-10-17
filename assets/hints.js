"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hint-button").forEach((button) => {
    const hintId = button.dataset.hintId;
    const source = button.dataset.source || window.location.pathname;

    // Find the passages associated with this button.
    const passages = Array.from(
      document.querySelectorAll("[data-hint]")
    ).filter((element) => element.dataset.hint === hintId);

    const status = document.createElement("p");
    status.className = "hint-status";
    status.setAttribute("role", "status");
    button.after(status);

    const storageKey =
      "wargame2026:hint:" + source + ":" + hintId;

    function revealHint() {
      passages.forEach((element) => {
        element.classList.add("hint-highlight");
      });

      button.textContent = "Hint revealed";
      button.disabled = true;
    }

    if (!hintId || passages.length === 0) {
      button.disabled = true;
      status.textContent =
        "This hint is not configured. Contact an organiser.";
      return;
    }

    // Restore a previously revealed hint.
    try {
      if (localStorage.getItem(storageKey) === "revealed") {
        revealHint();
        status.textContent =
          "Previously unlocked in this browser.";
      }
    } catch {
      // The button still works if browser storage is unavailable.
    }

    button.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Reveal this hint? Organiser notifications are not connected yet."
      );

      if (!confirmed) return;

      revealHint();

      let saved = false;

      try {
        localStorage.setItem(storageKey, "revealed");
        saved = true;
      } catch {
        // Highlighting still works without browser storage.
      }

      status.textContent = saved
        ? "Hint revealed. This request has not been sent to the organisers."
        : "Hint revealed for this visit only. Organisers have not been notified.";

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        passages[0].scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  });
});
