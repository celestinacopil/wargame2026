"use strict";
(() => {
 const input=document.getElementById("url"),status=document.getElementById("status"),results=document.getElementById("results"),list=document.getElementById("capture-list");
 function normalize(raw){
  let value=raw.trim();if(!value)throw new Error("Enter a web page address.");
  if(!/^https?:\/\//i.test(value))value="https://"+value.replace(/^\/+/,"");
  let url;try{url=new URL(value)}catch{throw new Error("Enter a valid web page address.")}
  const host=url.hostname.toLowerCase();let path=url.pathname.replace(/\/+$/,"");
  if(host==="celestinacopil.github.io"){
    const prefix="/wargame2026/";if(!path.startsWith(prefix))return host+path;
    const local=path.slice(prefix.length);const slash=local.indexOf("/");if(slash<0)return host+path;
    return local.slice(0,slash).toLowerCase().replace(/^www\./,"")+local.slice(slash);
  }
  return host.replace(/^www\./,"")+path;
 }
 function search(event){
  if(event)event.preventDefault();results.hidden=true;list.replaceChildren();
  let key;try{key=normalize(input.value)}catch(error){status.textContent=error.message;return}
  const page=window.ARCHIVE_CATALOG.find(page=>normalize(page.originalUrl)===key);
  if(!page){status.textContent="No captures found for this address. Check the address or try another page.";return}
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
