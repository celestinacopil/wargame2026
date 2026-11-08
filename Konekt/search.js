"use strict";
(() => {
 const input=document.getElementById("url"),status=document.getElementById("status"),results=document.getElementById("results"),list=document.getElementById("capture-list");
 function normalize(raw){
  let value=raw.trim();if(!value)throw new Error("Enter a person's name.");
 }
 function search(event){
  if(event)event.preventDefault();results.hidden=true;list.replaceChildren();
  let key;try{key=normalize(input.value)}catch(error){status.textContent=error.message;return}
  const page=window.KONEKT_CATALOG.find(page=>normalize(page.originalUrl)===key);
  if(!page){status.textContent="No person with this name was found. Try another";return}
  status.textContent=page.captures.length+" archived capture"+(page.captures.length===1?"":"s")+" found.";
  document.getElementById("result-url").textContent=page.originalUrl;
  [...page.captures].sort((a,b)=>a.datetime.localeCompare(b.datetime)).forEach(capture=>{
   const link=document.createElement("a");link.className="capture";link.href=capture.file;
   const date=document.createElement("strong");date.textContent=capture.label;
   const detail=document.createElement("span");detail.textContent="Open saved page →";
   link.append(date,detail);list.append(link);
  });results.hidden=false;
 }
 document.getElementById("archive-form").addEventListener("submit",search);
 const supplied=new URLSearchParams(location.search).get("url");if(supplied){input.value=supplied;search()}
})();
