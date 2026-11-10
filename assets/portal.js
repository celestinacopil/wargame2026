"use strict";
(() => {
 const settings=window.WARGAME;
 const base=new URL("../",document.currentScript.src);
 const key=settings.storagePrefix+"session";
 const memory={};
 function session(){try{return sessionStorage.getItem(key)}catch{return null}}
 function progressKey(role){return settings.storagePrefix+"progress:"+role}
 function progress(role){if(memory[role])return memory[role];try{const value=JSON.parse(localStorage.getItem(progressKey(role))||"{}");return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}catch{return {}}}
 function save(role,value){memory[role]=value;try{localStorage.setItem(progressKey(role),JSON.stringify(value));return true}catch{return false}}
 function message(el,text,kind=""){el.textContent=text;el.className="message "+kind}
 function normalize(value){return value.trim().toLowerCase()}
document.querySelectorAll("[data-logout]").forEach(button => {
  button.hidden = false;

  button.addEventListener("click", () => {
    // Reset locally saved hints.
    try {
      Object.keys(localStorage)
        .filter(storageKey =>
          storageKey.startsWith("wargame2026:hint:") ||
          storageKey.startsWith("wargame2026:logged-hint:")
        )
        .forEach(storageKey => {
          localStorage.removeItem(storageKey);
        });
    } catch {}

    // Log out.
    try {
      sessionStorage.removeItem(key);
    } catch {}

    location.href = new URL("index.html", base).href;
  });
});
 const required=document.body.dataset.role;
 if(required&&session()!==required){const target=new URL("index.html",base);target.searchParams.set("role",required);location.replace(target.href);return}
 if(document.body.dataset.page==="login"){
  const form=document.getElementById("login-form"),screen=document.getElementById("login-panel"),choices=document.getElementById("role-grid"),password=document.getElementById("password"),status=document.getElementById("login-message");let chosen=null;
  function select(role){if(!settings.roles[role])return;chosen=role;document.getElementById("login-title").textContent=settings.roles[role].name;choices.hidden=true;screen.hidden=false;password.value="";message(status,"");password.focus()}
  document.querySelectorAll("[data-choice]").forEach(button=>button.addEventListener("click",()=>select(button.dataset.choice)));
  document.getElementById("change-role").addEventListener("click",()=>{chosen=null;screen.hidden=true;choices.hidden=false;password.value="";document.querySelector("[data-choice]").focus()});
  form.addEventListener("submit",event=>{event.preventDefault();if(!chosen)return;if(password.value!==settings.roles[chosen].password){message(status,"Incorrect password. Please try again.","error");password.value="";password.focus();return}try{sessionStorage.setItem(key,chosen)}catch{message(status,"Allow session storage in this browser to enter the team space.","error");return}location.href=new URL(settings.roles[chosen].page,base).href});
  const requested=new URLSearchParams(location.search).get("role");if(requested)select(requested);
 }
 if(required&&document.body.dataset.page==="team"){
  const done=progress(required);let count=0;
  document.querySelectorAll("[data-challenge]").forEach(card=>{if(done[card.dataset.challenge]){card.querySelector(".badge").textContent="Completed";count++}});
  const counter=document.getElementById("progress");if(counter)counter.textContent=count+" / 6 challenges completed in this browser";
 }
 
if (required && document.body.dataset.page === "challenge") {
  const challenge = JSON.parse(
    document.getElementById("challenge-data").textContent
  );

  const form = document.getElementById("flag-form");
  const status = document.getElementById("flag-message");
  const accepted = document.getElementById("accepted-status");
  const input = document.getElementById("flag");

  const isRemote = challenge.validation === "remote";

  function render() {
    const done = progress(required)[challenge.id];

    if (isRemote) {
      const completed = done && typeof done === "object"
        ? done.objectives || {}
        : {};

      const total = challenge.requiredFlags || 1;
      const count = Object.keys(completed).length;

      accepted.textContent =
        count + " / " + total + " flags accepted in this browser.";

      if (count >= total) {
        accepted.textContent += " Challenge completed!";
      }

    } else {
      accepted.textContent = done
        ? "Accepted in this browser: " +
          new Date(done).toLocaleString()
        : "No accepted flag yet.";
    }
  }

  render();

  if (!challenge.enabled) {
    form.hidden = true;
    return;
  }

  form.hidden = false;

  // EXISTING LOCAL VALIDATION
  // All other challenges continue to work as before.
  if (!isRemote) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      if (!challenge.acceptedFlags.some(
        flag => normalize(flag) === normalize(input.value)
      )) {
        message(
          status,
          "Incorrect flag. Check the evidence and try again.",
          "error"
        );
        return;
      }

      const done = progress(required);

      if (done[challenge.id]) {
        message(
          status,
          "Already completed. " + challenge.feedback,
          "success"
        );
        return;
      }

      done[challenge.id] = new Date().toISOString();

      const stored = save(required, done);

      message(
        status,
        challenge.feedback +
          (stored
            ? ""
            : " Browser storage is unavailable."),
        "success"
      );

      input.value = "";
      render();
    });

    return;
  }

  // REMOTE VALIDATION
  // Used for Challenge 03.

  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbz8QSXWB9BYDkzIy3YRxAcgyArsc5Dy32RIl-YjmpOSLS7kQhGpSX-DEuhSvIXtuL9aow/exec";

  const objectiveSelect =
    document.getElementById("objective");

  const submitButton =
    form.querySelector('button[type="submit"]');

  if (!objectiveSelect) {
    message(
      status,
      "Objective selector is missing.",
      "error"
    );
    return;
  }

  function refreshObjectives() {
    const done = progress(required)[challenge.id];
    const completed = done && typeof done === "object"
      ? done.objectives || {}
      : {};

    Array.from(objectiveSelect.options).forEach(option => {
      if (!option.value) return;

      const isDone = Boolean(completed[option.value]);
      option.disabled = isDone;
    });

    if (
      objectiveSelect.value &&
      completed[objectiveSelect.value]
    ) {
      objectiveSelect.value = "";
    }

    const total = challenge.requiredFlags || 1;

    if (Object.keys(completed).length >= total) {
      form.hidden = true;
    }
  }

  refreshObjectives();

  form.addEventListener("submit", event => {
    event.preventDefault();

    const objective = objectiveSelect.value;
    const flag = input.value.trim();

    if (!objective || !flag) {
      message(
        status,
        "Select an objective and enter a flag.",
        "error"
      );
      return;
    }

    if (APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
      message(
        status,
        "The submission system is not configured.",
        "error"
      );
      return;
    }

    submitButton.disabled = true;
    message(status, "Checking your flag...");

    const requestId =
      "req_" + crypto.randomUUID().replace(/-/g, "");

    const callbackName =
      "wgFlagCallback_" +
      requestId.replace(/[^A-Za-z0-9_]/g, "");

    const script = document.createElement("script");

    let finished = false;

    function cleanup() {
      script.remove();
      delete window[callbackName];
      submitButton.disabled = false;
    }

    const timeout = setTimeout(() => {
      if (finished) return;
      finished = true;

      cleanup();

      message(
        status,
        "The server did not respond. Please try again.",
        "error"
      );
    }, 15000);

    window[callbackName] = response => {
      if (finished) return;
      finished = true;

      clearTimeout(timeout);
      cleanup();

      if (!response || !response.ok) {
        message(
          status,
          response?.message || "Submission failed.",
          "error"
        );
        return;
      }

      if (!response.correct) {
        message(
          status,
          "Incorrect flag. Try again.",
          "error"
        );
        return;
      }

      const done = progress(required);

      if (
        !done[challenge.id] ||
        typeof done[challenge.id] !== "object"
      ) {
        done[challenge.id] = {
          objectives: {}
        };
      }

      if (!done[challenge.id].objectives) {
        done[challenge.id].objectives = {};
      }

      done[challenge.id].objectives[objective] =
        new Date().toISOString();

      const stored = save(required, done);

      input.value = "";

      render();
      refreshObjectives();

      const completedCount = Object.keys(
        done[challenge.id].objectives
      ).length;

      if (
        completedCount >= (challenge.requiredFlags || 1)
      ) {
        message(
          status,
          "Correct! All three flags found. Challenge completed!" +
            (stored ? "" : " Progress could not be saved."),
          "success"
        );
      } else {
        message(
          status,
          "Correct flag! Objective " + objective +
            " completed." +
            (stored ? "" : " Progress could not be saved."),
          "success"
        );
      }
    };

    const url = new URL(APPS_SCRIPT_URL);

    url.searchParams.set("team", required);
    url.searchParams.set("challenge", challenge.id);
    url.searchParams.set("objective", objective);
    url.searchParams.set("flag", flag);
    url.searchParams.set("requestId", requestId);
    url.searchParams.set("callback", callbackName);

    script.onerror = () => {
      if (finished) return;
      finished = true;

      clearTimeout(timeout);
      cleanup();

      message(
        status,
        "Could not contact the server. Please try again.",
        "error"
      );
    };

    script.src = url.toString();
    document.head.appendChild(script);
  });
}

})();
