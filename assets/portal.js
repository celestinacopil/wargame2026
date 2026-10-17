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
 if(required&&document.body.dataset.page==="challenge"){
  const challenge=JSON.parse(document.getElementById("challenge-data").textContent);
  const form=document.getElementById("flag-form"),status=document.getElementById("flag-message"),accepted=document.getElementById("accepted-status");
  function render(){const done=progress(required)[challenge.id];accepted.textContent=done?"Accepted in this browser: "+new Date(done).toLocaleString():"No accepted flag yet."}
  render();
  if(!challenge.enabled){form.hidden=true;return}
  form.hidden=false;
  form.addEventListener("submit",event=>{event.preventDefault();const input=document.getElementById("flag");if(!challenge.acceptedFlags.some(flag=>normalize(flag)===normalize(input.value))){message(status,"Incorrect flag. Check the evidence and try again.","error");return}const done=progress(required);if(done[challenge.id]){message(status,"Already completed. "+challenge.feedback,"success");return}done[challenge.id]=new Date().toISOString();const stored=save(required,done);message(status,challenge.feedback+(stored?"":" Browser storage is unavailable. This result will be lost on reload."),"success");input.value="";render()});
 }
})();
