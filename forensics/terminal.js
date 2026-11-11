"use strict";
/* A fake Linux terminal that imitates exiftool, for Darsenia challenge 05.
   Files and metadata come from files.js. Nothing here touches real files. */
(() => {
  const FILES = window.EVIDENCE.files;
  const HOME = "~", EVIDENCE = "~/evidence";
  const screen = document.getElementById("screen");
  const input = document.getElementById("command");
  const promptEl = document.getElementById("prompt");
  const term = document.getElementById("terminal");

  let cwd = EVIDENCE;
  const history = [];
  let historyPos = 0;

  const COMMANDS = ["help", "exiftool", "ls", "cd", "pwd", "cat", "file", "clear", "whoami", "hostname", "history", "echo", "man"];

  // ---------- output ----------
  function print(text = "", cls = "") {
    const line = document.createElement("div");
    line.className = "line " + cls;
    line.textContent = text;
    screen.appendChild(line);
  }
  const printLines = (lines, cls) => lines.forEach(l => print(l, cls));
  const promptText = () => "analyst@dic-forensics:" + cwd + "$ ";
  function updatePrompt() { promptEl.textContent = promptText(); }

  // ---------- parsing ----------
  // Splits a command line into words, keeping quoted parts together.
  function words(line) {
    const out = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m;
    while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3]);
    return out;
  }

  // "*.jpg" -> /^.*\.jpg$/i
  const globToRegex = g => new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");

  // Works out which file or folder a path points to, relative to the current folder.
  function resolve(path) {
    let p = path.replace(/\/+$/, "");
    if (p === "" || p === "~") return { dir: HOME };
    if (p === "." ) return { dir: cwd };
    if (p === "..") return { dir: HOME };
    p = p.replace(/^\.\//, "");
    if (p === "~/evidence" || (cwd === HOME && p === "evidence") || p === "../evidence") return { dir: EVIDENCE };
    let name = null;
    if (p.startsWith("~/evidence/")) name = p.slice(11);
    else if (p.startsWith("../evidence/")) name = p.slice(12);
    else if (cwd === HOME && p.startsWith("evidence/")) name = p.slice(9);
    else if (cwd === EVIDENCE && !p.includes("/")) name = p;
    if (name === null) return null;
    return { name, prefix: path.slice(0, path.length - name.length) };
  }

  // Expands one argument into matching files (supports * and ?).
  function expand(arg) {
    const r = resolve(arg);
    if (!r) return { missing: arg };
    if (r.dir) return { dir: r.dir, path: arg };
    const re = globToRegex(r.name);
    const found = FILES.filter(f => re.test(f.name));
    if (!found.length) return { missing: arg };
    return { files: found.map(f => ({ file: f, path: r.prefix + f.name })) };
  }

  // ---------- simple commands ----------
  function help() {
    printLines([
      "Available commands",
      "",
      "  ls                  list the files",
      "  cat <file>          read a text file",
      "  exiftool <file>     read a photo's metadata",
      "  man exiftool        more exiftool options",
      "  clear               clear the screen",
      "",
      "Examples:",
      "  exiftool IMG_20261202_210947.jpg",
      "  exiftool -gps:all IMG_20261202_210947.jpg",
      "",
      "Tips: press Tab to complete a file name, and the Up arrow to repeat a command."
    ]);
  }

  function man(args) {
    if (args[0] !== "exiftool") { print(args.length ? "No manual entry for " + args[0] : "What manual page do you want? Try: man exiftool"); return; }
    printLines([
      "EXIFTOOL(1)  -  Read meta information in files (training version)",
      "",
      "SYNOPSIS",
      "  exiftool [OPTIONS] [-TAG...] FILE...",
      "",
      "OPTIONS",
      "  -TAG          print only this tag, e.g. -Model, -DateTimeOriginal, -GPSPosition",
      "                wildcards are allowed: -GPS*   -*Date*",
      "  -GROUP:all    print all tags of a group, e.g. -gps:all  -exif:all  -file:all",
      "  -n            print numbers instead of converted values (GPS in decimal degrees)",
      "  -c FMT        coordinate format, e.g. -c \"%.6f\"  or  -c \"%d deg %.4f min\"",
      "  -s            print tag names instead of descriptions (use these names with -TAG)",
      "  -G            print the group name of each tag",
      "  -a            allow duplicate tags (same tag stored in several groups)",
      "  -ver          print the exiftool version",
      "",
      "FILE can be a file name, a pattern (*.jpg) or a folder (.)",
      "",
      "NOTES",
      "  GPS Latitude/Longitude are given in degrees, minutes and seconds by default.",
      "  Decimal degrees = degrees + minutes/60 + seconds/3600 (negative for S and W)."
    ]);
  }

  function ls(args) {
    const long = args.some(a => /^-[a-z]*l/.test(a));
    const target = args.find(a => !a.startsWith("-"));
    let dir = cwd, only = null;
    if (target) {
      const r = resolve(target);
      if (!r) { print("ls: cannot access '" + target + "': No such file or directory"); return; }
      if (r.dir) dir = r.dir;
      else {
        only = FILES.filter(f => globToRegex(r.name).test(f.name));
        if (!only.length) { print("ls: cannot access '" + target + "': No such file or directory"); return; }
      }
    }
    if (!only && dir === HOME) {
      print(long ? "total 4\ndrwxr-xr-x 2 analyst analyst 4096 Dec  4 19:20 evidence" : "evidence", "dir");
      return;
    }
    const list = only || FILES;
    if (!long) { print(list.map(f => f.name).join("   ")); return; }
    print("total " + Math.ceil(list.reduce((s, f) => s + f.bytes, 0) / 1024));
    list.forEach(f => print("-rw-r--r-- 1 analyst analyst " + String(f.bytes).padStart(8) + " " + f.date + " " + f.name));
  }

  function cd(args) {
    const r = resolve(args[0] || "~");
    if (!r || !r.dir) { print("bash: cd: " + args[0] + ": Not a directory or no such folder"); return; }
    cwd = r.dir;
  }

  function cat(args) {
    if (!args.length) { print("cat: missing file name"); return; }
    args.forEach(a => {
      const e = expand(a);
      if (e.dir) { print("cat: " + a + ": Is a directory"); return; }
      if (e.missing) { print("cat: " + a + ": No such file or directory"); return; }
      e.files.forEach(({ file }) => {
        if (file.text) printLines(file.text.split("\n"));
        else print("cat: " + file.name + ": binary image file. Use exiftool to read its metadata.");
      });
    });
  }

  function fileCmd(args) {
    if (!args.length) { print("Usage: file <file>"); return; }
    args.forEach(a => {
      const e = expand(a);
      if (e.dir) { print(a + ": directory"); return; }
      if (e.missing) { print(a + ": cannot open (No such file or directory)"); return; }
      e.files.forEach(({ file, path }) => {
        if (file.type === "text") print(path + ": ASCII text");
        else if (file.name.startsWith("received")) print(path + ": JPEG image data, JFIF standard 1.01, baseline, precision 8, 1600x1200, components 3");
        else print(path + ": JPEG image data, Exif standard: [TIFF image data, little-endian, direntries=11, manufacturer=Lumen, model=Lumen X12 Pro], baseline, precision 8, 4000x3000, components 3");
      });
    });
  }

  // ---------- exiftool ----------
  // Minimal printf for coordinate formats: %d, %f, %.Nf
  function printf(fmt, values) {
    let i = 0;
    return fmt.replace(/%(\.(\d+))?([df])/g, (_, __, prec, kind) => {
      const v = values[i++] ?? 0;
      if (kind === "d") return String(Math.trunc(v));
      return v.toFixed(prec === undefined ? 6 : +prec);
    });
  }

  function formatCoord(value, fmt, refs) {
    const a = Math.abs(value);
    const n = (fmt.match(/%(\.\d+)?[df]/g) || []).length;
    let parts;
    if (n >= 3) { const d = Math.trunc(a), m = Math.trunc((a - d) * 60); parts = [d, m, ((a - d) * 60 - m) * 60]; }
    else if (n === 2) { const d = Math.trunc(a); parts = [d, (a - d) * 60]; }
    else parts = [a];
    return printf(fmt, parts) + (refs ? " " + (value >= 0 ? refs[0] : refs[1]) : "");
  }

  function tagValue(t, opts, file, dirLabel) {
    let v = opts.numeric ? t.n : t.v;
    if (v === "{dir}") return dirLabel;
    if (opts.coordFmt && !opts.numeric && t.num !== undefined) {
      const refs = t.g === "Composite" ? (t.k === "GPSLatitude" ? "NS" : "EW") : null;
      return formatCoord(t.num, opts.coordFmt, refs);
    }
    if (opts.coordFmt && !opts.numeric && t.k === "GPSPosition") {
      const lat = file.tags.find(x => x.g === "Composite" && x.k === "GPSLatitude").num;
      const lon = file.tags.find(x => x.g === "Composite" && x.k === "GPSLongitude").num;
      return formatCoord(lat, opts.coordFmt, "NS") + ", " + formatCoord(lon, opts.coordFmt, "EW");
    }
    return v;
  }

  // Does tag t match one of the requested -TAG / -GROUP:TAG filters?
  function matches(t, filters) {
    if (!filters.length) return true;
    return filters.some(f => {
      let group = null, name = f;
      if (f.includes(":")) [group, name] = f.split(":");
      if (group) {
        const g = group.toLowerCase();
        const groupOk = g === "all" || g === "*" || t.g.toLowerCase() === g ||
          (g === "file" && ["system", "file"].includes(t.g.toLowerCase())) ||
          (g === "gps" && t.g === "GPS");
        if (!groupOk) return false;
      }
      if (name.toLowerCase() === "all") return true;
      return globToRegex(name).test(t.k);
    });
  }

  function exiftool(args) {
    const opts = { numeric: false, short: false, veryShort: false, groups: false, all: false, coordFmt: null };
    const filters = [], targets = [];

    for (let i = 0; i < args.length; i++) {
      const a = args[i], low = a.toLowerCase();
      if (low === "-ver") { print("12.76"); return; }
      if (low === "-h" || low === "--help" || low === "-help") { man(["exiftool"]); return; }
      if (a === "-n" || a === "-#") opts.numeric = true;
      else if (a === "-s" || a === "-s1" || a === "-s2") opts.short = true;
      else if (a === "-S") { opts.short = true; opts.veryShort = true; }
      else if (/^-G\d?$/.test(a)) opts.groups = true;
      else if (a === "-a") opts.all = true;
      else if (a === "-c") { opts.coordFmt = args[++i]; if (!opts.coordFmt) { print("Error: Expecting argument for option -c"); return; } }
      else if (/^-(j|json|csv|X|b|o|tagsfromfile|overwrite_original|r|ee|u|U|v\d?|k)$/i.test(a)) {
        print("Note: option " + a + " is not available in this training terminal. Type 'man exiftool' for the supported options.");
        return;
      }
      else if (a.startsWith("--")) print("Note: excluding tags (" + a + ") is not supported here; ignoring.");
      else if (a.startsWith("-") && a.length > 1) filters.push(a.slice(1));
      else targets.push(a);
    }

    if (!targets.length) {
      printLines([
        "Syntax:  exiftool [OPTIONS] FILE",
        "",
        "Example: exiftool IMG_20261202_210947.jpg",
        "Type 'man exiftool' for the options supported in this terminal, or 'ls' to list the files."
      ]);
      return;
    }

    // Collect files to read.
    const jobs = [];
    let missing = 0, dirs = 0;
    targets.forEach(t => {
      const e = expand(t);
      if (e.missing) { print("Error: File not found - " + t, "err"); missing++; return; }
      if (e.dir) {
        dirs++;
        if (e.dir === HOME) return; // no files directly in the home folder
        const prefix = t.replace(/\/+$/, "") + "/";
        FILES.forEach(f => jobs.push({ file: f, path: prefix + f.name, dirLabel: t.replace(/\/+$/, "") }));
        return;
      }
      e.files.forEach(j => {
        const slash = j.path.lastIndexOf("/");
        jobs.push({ ...j, dirLabel: slash < 0 ? "." : j.path.slice(0, slash) });
      });
    });

    const multi = jobs.length > 1 || dirs > 0;
    let anyPrinted = false;

    jobs.forEach(({ file, path, dirLabel }) => {
      let tags = file.tags.filter(t => matches(t, filters));
      if (!opts.all) {
        // Like exiftool: when a tag exists in several groups, show it once (the last one wins).
        const lastIndex = new Map();
        tags.forEach((t, i) => lastIndex.set(t.k, i));
        tags = tags.filter((t, i) => lastIndex.get(t.k) === i);
      }
      if (multi) print("======== " + path, "head");
      tags.forEach(t => {
        anyPrinted = true;
        const name = opts.short ? t.k : t.d;
        const value = tagValue(t, opts, file, dirLabel);
        const group = opts.groups ? ("[" + t.g + "]").padEnd(16) : "";
        print(opts.veryShort ? group + name + ": " + value : group + name.padEnd(32) + ": " + value);
      });
    });

    if (!anyPrinted && jobs.length && filters.length) {
      print("(No matching tags found. Tag names have no spaces, e.g. -DateTimeOriginal; use exiftool -s FILE to list them.)", "muted");
    }
    if (multi || missing) {
      if (dirs) print(String(dirs).padStart(5) + " director" + (dirs === 1 ? "y" : "ies") + " scanned");
      print(String(jobs.length).padStart(5) + " image files read");
      if (missing) print(String(missing).padStart(5) + " files could not be read");
    }
  }

  // ---------- run ----------
  function run(line) {
    print(promptText() + line, "cmd");
    const parts = words(line.trim());
    if (!parts.length) return;
    history.push(line);
    historyPos = history.length;
    const [cmd, ...args] = parts;

    switch (cmd) {
      case "help": help(); break;
      case "exiftool": exiftool(args); break;
      case "ls": case "ll": case "dir": ls(cmd === "ll" ? ["-l", ...args] : args); break;
      case "cd": cd(args); break;
      case "pwd": print(cwd === HOME ? "/home/analyst" : "/home/analyst/evidence"); break;
      case "cat": cat(args); break;
      case "file": fileCmd(args); break;
      case "clear": screen.innerHTML = ""; break;
      case "whoami": print("analyst"); break;
      case "hostname": print("dic-forensics"); break;
      case "history": history.forEach((h, i) => print(String(i + 1).padStart(4) + "  " + h)); break;
      case "echo": print(args.join(" ")); break;
      case "man": man(args); break;
      case "sudo": print("analyst is not in the sudoers file. This incident will be reported."); break;
      case "exit": case "logout": print("Session is locked to this workstation. Close the browser tab to leave."); break;
      default: print(cmd + ": command not found. Type 'help' for the list of commands.", "err");
    }
    updatePrompt();
  }

  // Tab completion for commands and file names.
  function complete() {
    const value = input.value;
    const parts = value.split(" ");
    const last = parts[parts.length - 1];
    let options;
    if (parts.length === 1) options = COMMANDS;
    else {
      const prefix = last.slice(0, last.lastIndexOf("/") + 1);
      const r = resolve(prefix + "x");
      const names = cwd === HOME && !prefix ? ["evidence/"] : (r && !r.dir ? FILES.map(f => f.name) : []);
      options = names.map(n => prefix + n);
    }
    const hits = options.filter(o => o.startsWith(last));
    if (hits.length === 1) {
      parts[parts.length - 1] = hits[0];
      input.value = parts.join(" ") + (hits[0].endsWith("/") ? "" : " ");
    } else if (hits.length > 1) {
      print(promptText() + value, "cmd");
      print(hits.join("   "));
      let common = hits[0];
      hits.forEach(h => { while (!h.startsWith(common)) common = common.slice(0, -1); });
      parts[parts.length - 1] = common;
      input.value = parts.join(" ");
    }
  }

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input.value);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyPos > 0) input.value = history[--historyPos];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      historyPos = Math.min(history.length, historyPos + 1);
      input.value = history[historyPos] || "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      screen.innerHTML = "";
    } else {
      return;
    }
    term.scrollTop = term.scrollHeight;
  });

  // Example buttons above the terminal paste their command, ready to run with Enter.
  document.querySelectorAll("[data-cmd]").forEach(button => {
    button.addEventListener("click", () => {
      input.value = button.dataset.cmd;
      input.focus();
    });
  });

  // Clicking anywhere in the terminal focuses the input, unless the user is selecting text.
  term.addEventListener("click", () => { if (!window.getSelection().toString()) input.focus(); });

  printLines([
    "Darsenia Intelligence Command - Forensic Workstation DIC-FW-03",
    "Authorised use only. All activity is logged.",
    "",
    "Evidence for report 7731-HUM-2026-114 has been loaded into ~/evidence.",
    "",
    "Start by typing  ls  and pressing Enter to see the files.",
    "Type  help  at any time to see what you can do.",
    ""
  ], "muted");
  updatePrompt();
  input.focus();
})();
