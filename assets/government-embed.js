"use strict";
document.addEventListener("DOMContentLoaded",()=>{
 const frame=document.getElementById("government-console");
 const status=document.getElementById("government-status");
 const url=window.GOVERNMENT_APP_URL||"";
 if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)){
  status.textContent="Government console is not connected yet. Organisers must set the deployment URL in assets/government-config.js.";return;
 }
 frame.src=url;frame.hidden=false;
 status.textContent="Use your assigned government access code in the console below. It identifies your team for action logging.";
 const link=document.getElementById("console-direct");link.href=url;link.hidden=false;
});
