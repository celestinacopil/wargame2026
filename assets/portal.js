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

if (required && document.body.dataset.page === "team") {
  const done = progress(required);
  let count = 0;

  document.querySelectorAll("[data-challenge]").forEach(card => {
    const id = card.dataset.challenge;
    const result = done[id];

    let completed = false;

    // The multi-flag corruption challenge (Darsenia 04) counts its 3 objectives.
    if (id === "challenge-04" &&
        required === "darsenia-cyber") {

      const objectives =
        result &&
        typeof result === "object"
          ? result.objectives || {}
          : {};

      const found = Object.keys(objectives).length;

      completed = found >= 3;

      if (found > 0 && !completed) {
        card.querySelector(".badge").textContent =
          found + " / 3 flags found";
      }

    } else {
      completed = Boolean(result);
    }

    if (completed) {
      card.querySelector(".badge").textContent =
        "Completed";
      count++;
    }
  });

  const counter = document.getElementById("progress");

  if (counter) {
    counter.textContent =
      count + " / 6 challenges completed in this browser";
  }
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
    // A challenge can list SHA-256 hashes ("acceptedHashes") instead of
    // plain flags, so the answer is not readable in the page source.
    // Hash of the lowercase, trimmed flag, e.g. printf '%s' 'flag{123}' | shasum -a 256
    async function sha256(text) {
      const bytes = new TextEncoder().encode(text);
      // The browser's built-in hashing only works on https:// or localhost.
      if (window.crypto && crypto.subtle) {
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
      }
      return sha256Fallback(bytes);
    }

    // Plain-JavaScript SHA-256, used when the page is opened from a file:// address.
    function sha256Fallback(bytes) {
      const K = [];
      const isPrime = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
      for (let n = 2; K.length < 64; n++) if (isPrime(n)) K.push((Math.cbrt(n) % 1) * 2 ** 32 | 0);
      const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

      const length = bytes.length;
      const padded = new Uint8Array(Math.ceil((length + 9) / 64) * 64);
      padded.set(bytes);
      padded[length] = 0x80;
      new DataView(padded.buffer).setUint32(padded.length - 4, length * 8);

      const rotr = (x, n) => (x >>> n) | (x << (32 - n));
      const w = new Array(64);
      for (let i = 0; i < padded.length; i += 64) {
        for (let t = 0; t < 16; t++) w[t] = new DataView(padded.buffer).getUint32(i + t * 4);
        for (let t = 16; t < 64; t++) {
          const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
          const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
          w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
        }
        let [a, b, c, d, e, f, g, h] = H;
        for (let t = 0; t < 64; t++) {
          const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) | 0;
          const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
          h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
        }
        [a, b, c, d, e, f, g, h].forEach((v, j) => { H[j] = (H[j] + v) | 0; });
      }
      return H.map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
    }

    async function isCorrect(value) {
      const answer = normalize(value);
      if ((challenge.acceptedFlags || []).some(flag => normalize(flag) === answer)) return true;
      if (!(challenge.acceptedHashes || []).length) return false;
      return challenge.acceptedHashes.includes(await sha256(answer));
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();

      let correct;
      try {
        correct = await isCorrect(input.value);
      } catch (error) {
        console.error("Flag check failed:", error);
        message(status, "The flag could not be checked in this browser. Please tell an organiser.", "error");
        return;
      }

      if (!correct) {
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
  // Used for Darsenia challenge 04 (corruption).

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
    // remoteId lets a challenge move to a new slot while the server keeps its original ID.
    url.searchParams.set("challenge", challenge.remoteId || challenge.id);
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
