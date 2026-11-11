/* =========================================================
   Invitation Editor
   Friendly names for every field are listed in LABELS below.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- friendly names ---------- */
  var SECTION_NAMES = {
    envelope: ["Opening envelope", "The sealed envelope guests tap to open"],
    blessing: ["Ganesh Ji & R.S.V.P. names", "Ganesh picture, shloka and family names"],
    family: ["Family & loving note", "Best compliments, Nanihal Paksh, hosts and the kids' note"],
    couple: ["Couple invitation card", "Parents invite you to the wedding of their son"],
    ribbon: ["Scrolling ribbon", "Moving line of text across the screen"],
    day: ["Event day", "A date with its list of functions"],
    venues: ["Venues & map buttons", "Addresses with Google Maps buttons"],
    rsvp: ["Guest response form", "Guests confirm attendance and send blessings"],
    closing: ["Closing", "Final names, quote, lotus and peacocks"]
  };

  var LABELS = {
    // settings
    pageTitle: ["Page title", "Shown on the browser tab and when the link is shared"],
    shareDescription: ["Short description", "A one-line summary of the invitation"],
    goldColor: ["Gold colour"], maroonColor: ["Names colour (maroon)"], backgroundColor: ["Background colour"],
    musicFile: ["Background music", "Upload an MP3 (max 5 MB). It starts when the guest opens the envelope."],
    musicCredit: ["Music credit line", "Small text at the very bottom (leave empty to hide)"],
    fallingPetals: ["Falling petals animation"], sideBorders: ["Decorative side borders (computer screens)"],
    countdownTo: ["Countdown to (India time)", "The date and time the countdown counts down to"],
    // common
    show: ["Show this section"],
    topLine: ["Top blessing line"], invitedLine: ["Small heading"], subLine: ["Line under heading"],
    names: ["Names"], dates: ["Dates"], sealText: ["Text on the wax seal", "Short, e.g. S&S"],
    buttonText: ["Button text"], hint: ["Small hint under the button"],
    showToran: ["Show hanging bells garland (toran)"], ganeshaImage: ["Ganesh Ji picture", "Leave empty to use the built-in golden Ganesh Ji"],
    shloka: ["Shloka lines (Hindi)", "One line per box"], title: ["Heading"], heading: ["Small heading"],
    groups: ["Family groups"], noteHeading: ["Note – small heading"], noteFrom: ["Note – from (names)"], noteText: ["Note – message"],
    showGanesha: ["Show small Ganesh Ji"], hosts: ["Parents' names"], inviteLine: ["Invitation line"],
    groom: ["Groom's name"], groomDetail: ["Groom detail line"], showRings: ["Show rings picture"],
    joinWord: ["Word between names", "e.g. with / weds"], bride: ["Bride's name"], brideDetail: ["Bride detail line"],
    items: ["Ribbon texts", "Each box is one piece of text in the moving ribbon"],
    layout: ["Design of the functions list"], intro: ["Intro line"], weekday: ["Day name"], date: ["Date"],
    showCountdown: ["Show countdown timer"], countdownLabel: ["Countdown heading"], dayLabel: ["Day label (in arch)", "e.g. The Wedding Day — leave empty to hide"],
    events: ["Functions / ceremonies"], icon: ["Picture"], iconImage: ["Or upload your own picture", "Optional – replaces the picture chosen above"],
    name: ["Name"], details: ["Time / details", "Use new lines for more lines"], venue: ["Venue name"], address: ["Address"],
    mapLink: ["Google Maps link", "Open the place in Google Maps → Share → Copy link, and paste here"],
    venues: ["Venues"], subtitle: ["Line under heading"], thankYou: ["Thank-you message after sending"],
    whatsappNumber: ["WhatsApp number (optional)", "With country code, e.g. 919812345678. Leave empty to hide the WhatsApp link."],
    whatsappText: ["WhatsApp link text"], fromHeading: ["'Invitation from' heading"], from: ["Invitation from (names)"],
    quote: ["Quote"], showLotus: ["Show lotus decoration"], showPeacocks: ["Show peacocks"], peacockImage: ["Peacock picture", "Leave empty to use the built-in peacock"]
  };
  var IMAGE_KEYS = { ganeshaImage: 1, iconImage: 1, peacockImage: 1 };
  var LONG_KEYS = { noteText: 1, inviteLine: 1, intro: 1, details: 1, address: 1, quote: 1, subtitle: 1, thankYou: 1, groomDetail: 1, brideDetail: 1, shareDescription: 1, hosts: 1, from: 1 };
  var SELECTS = {
    icon: [["rings", "Rings"], ["mehendi", "Mehendi hand & dholak"], ["haldi", "Haldi"], ["chak-bhat", "Chak & Bhat thali"], ["ghudchadi", "Ghudchadi horse"], ["baraat", "Baraat chhatri"], ["none", "No picture"]],
    layout: [["cards", "Arch cards (side by side)"], ["timeline", "Timeline (one below the other)"]]
  };
  var ITEM_NAMES = { groups: "Group", events: "Function", venues: "Venue" };
  var ITEM_TEMPLATES = {
    groups: { heading: "", names: [""] },
    events: { icon: "none", iconImage: "", name: "", details: "", venue: "", address: "", mapLink: "" },
    venues: { heading: "", name: "", address: "", buttonText: "View Location", mapLink: "" }
  };
  function label(k) { return (LABELS[k] && LABELS[k][0]) || k.replace(/([A-Z])/g, " $1").replace(/^./, function (c) { return c.toUpperCase(); }); }
  function help(k) { return LABELS[k] && LABELS[k][1]; }

  /* ---------- state ---------- */
  var data = null, original = null, password = "", offline = false, dirty = false, openSet = {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function toast(msg, err) {
    var t = $("#toast"); t.textContent = msg; t.className = "toast show" + (err ? " err" : "");
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.className = "toast"; }, 3200);
  }
  function markDirty() {
    dirty = true;
    var s = $("#status"); s.textContent = "● Unsaved changes"; s.className = "status dirty";
  }
  function markSaved() {
    dirty = false;
    var s = $("#status"); s.textContent = "✓ All changes saved"; s.className = "status saved";
  }
  window.addEventListener("beforeunload", function (e) { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ "x-admin-password": password }, opts.headers || {});
    return fetch(path, opts).then(function (r) {
      return r.text().then(function (t) {
        var j = {}; try { j = t ? JSON.parse(t) : {}; } catch (e) { }
        if (!r.ok) { var err = new Error(j.error || ("Error " + r.status)); err.status = r.status; throw err; }
        return j;
      });
    });
  }

  /* ---------- login ---------- */
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    password = $("#pw").value;
    var m = $("#loginMsg"); m.className = "msg info"; m.textContent = "Checking…";
    api("/api/rsvp").then(function () {
      try { sessionStorage.setItem("invite-pw", password); } catch (x) { }
      start(false);
    }).catch(function (err) {
      if (err.status === 401) { m.className = "msg"; m.textContent = "That password is not correct."; }
      else if (err.status === 500 && /ADMIN_PASSWORD/.test(err.message)) { m.className = "msg"; m.textContent = err.message; }
      else if (err.status === 404 || err.status === 405 || err.status === 501 || !err.status) {
        m.className = "msg info"; m.textContent = "Online saving is not available here – opening in download mode.";
        setTimeout(function () { start(true); }, 900);
      } else { m.className = "msg"; m.textContent = err.message; }
    });
  });
  try { var saved = sessionStorage.getItem("invite-pw"); if (saved) { $("#pw").value = saved; } } catch (x) { }

  function start(isOffline) {
    offline = isOffline;
    var src = offline ? fetch("/content.json", { cache: "no-store" }).then(function (r) { return r.json(); })
      : fetch("/api/content", { cache: "no-store" }).then(function (r) { return r.json(); });
    Promise.all([src, fetch("/content.json", { cache: "no-store" }).then(function (r) { return r.json(); })]).then(function (res) {
      data = res[0]; original = res[1];
      data.settings = data.settings || {}; data.sections = data.sections || [];
      $("#login").hidden = true; $("#app").hidden = false;
      $("#offlineNote").hidden = !offline;
      renderAll();
      markSavedQuiet();
      if (!offline) loadGuests();
    }).catch(function () { toast("Could not load the invitation content.", true); });
  }
  function markSavedQuiet() { dirty = false; $("#status").textContent = ""; }

  /* ---------- tabs ---------- */
  document.querySelectorAll(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (x) { x.classList.toggle("active", x === t); });
      document.querySelectorAll(".pane").forEach(function (p) { p.hidden = p.id !== "tab-" + t.dataset.tab; });
      if (t.dataset.tab === "guests" && !offline) loadGuests();
    });
  });

  /* ---------- field builders ---------- */
  function fieldFor(obj, key, onStructure) {
    var v = obj[key];
    if (key === "type") return null;
    if (typeof v === "boolean") return toggleField(obj, key);
    if (Array.isArray(v)) {
      if (v.length && typeof v[0] === "object" || ITEM_TEMPLATES[key]) return groupField(obj, key, onStructure);
      return linesField(obj, key);
    }
    if (v !== null && typeof v === "object") return null;
    if (IMAGE_KEYS[key]) return mediaField(obj, key, "image");
    if (key === "musicFile") return mediaField(obj, key, "audio");
    if (SELECTS[key]) return selectField(obj, key);
    if (/Color$/.test(key)) return colorField(obj, key);
    if (key === "countdownTo") return inputField(obj, key, "datetime-local");
    if (LONG_KEYS[key] || /\n/.test(v || "") || String(v || "").length > 70) return textareaField(obj, key);
    return inputField(obj, key, key === "mapLink" ? "url" : "text");
  }
  function wrap(key, control, extraClass) {
    var h = help(key);
    return el("div", { class: "f " + (extraClass || "") }, [
      el("label", { class: "lbl", text: label(key) }),
      h && extraClass !== "toggle" ? el("p", { class: "help", text: h }) : null,
      control
    ]);
  }
  function inputField(obj, key, type) {
    var i = el("input", { type: type });
    i.value = obj[key] == null ? "" : obj[key];
    i.addEventListener("input", function () { obj[key] = i.value; markDirty(); updateTitles(); });
    return wrap(key, i);
  }
  function textareaField(obj, key) {
    var t = el("textarea", { rows: 3 });
    t.value = obj[key] == null ? "" : obj[key];
    t.addEventListener("input", function () { obj[key] = t.value; markDirty(); });
    return wrap(key, t);
  }
  function selectField(obj, key) {
    var s = el("select");
    SELECTS[key].forEach(function (o) { var op = el("option", { value: o[0], text: o[1] }); if (obj[key] === o[0]) op.selected = true; s.appendChild(op); });
    s.addEventListener("change", function () { obj[key] = s.value; markDirty(); });
    return wrap(key, s);
  }
  function colorField(obj, key) {
    var c = el("input", { type: "color" }), t = el("input", { type: "text" });
    c.value = /^#[0-9a-f]{6}$/i.test(obj[key]) ? obj[key] : "#a9813f"; t.value = obj[key] || "";
    c.addEventListener("input", function () { t.value = c.value; obj[key] = c.value; markDirty(); });
    t.addEventListener("input", function () { obj[key] = t.value; if (/^#[0-9a-f]{6}$/i.test(t.value)) c.value = t.value; markDirty(); });
    return wrap(key, el("div", { class: "color-row" }, [c, t]));
  }
  function toggleField(obj, key) {
    var i = el("input", { type: "checkbox" }); i.checked = !!obj[key];
    i.addEventListener("change", function () { obj[key] = i.checked; markDirty(); });
    var f = el("div", { class: "f toggle" }, [el("label", { class: "lbl", text: label(key) }), el("label", { class: "switch" }, [i, el("span", { class: "track" })])]);
    return f;
  }
  function linesField(obj, key) {
    var box = el("div", { class: "lines" });
    function draw() {
      box.innerHTML = "";
      obj[key].forEach(function (val, idx) {
        var i = el("input", { type: "text" }); i.value = val;
        i.addEventListener("input", function () { obj[key][idx] = i.value; markDirty(); });
        box.appendChild(el("div", { class: "line" }, [i,
          el("button", { class: "icon-btn", type: "button", title: "Move up", text: "↑", onclick: function () { if (idx > 0) { var a = obj[key]; a.splice(idx - 1, 0, a.splice(idx, 1)[0]); markDirty(); draw(); } } }),
          el("button", { class: "icon-btn del", type: "button", title: "Remove", text: "✕", onclick: function () { obj[key].splice(idx, 1); markDirty(); draw(); } })
        ]));
      });
      box.appendChild(el("button", { class: "add-link", type: "button", text: "+ Add line", onclick: function () { obj[key].push(""); markDirty(); draw(); var ins = box.querySelectorAll("input"); ins[ins.length - 1].focus(); } }));
    }
    draw();
    return wrap(key, box);
  }
  function groupField(obj, key) {
    var box = el("div", { class: "group-list" });
    var nm = ITEM_NAMES[key] || "Item";
    function draw() {
      box.innerHTML = "";
      obj[key].forEach(function (item, idx) {
        var inner = el("div", { class: "item" });
        inner.appendChild(el("div", { class: "item-head" }, [
          el("b", { text: nm + " " + (idx + 1) + (item.name ? " – " + item.name : (item.heading ? " – " + item.heading : "")) }),
          el("span", {}, [
            el("button", { class: "icon-btn", type: "button", title: "Move up", text: "↑", onclick: function () { if (idx > 0) { var a = obj[key]; a.splice(idx - 1, 0, a.splice(idx, 1)[0]); markDirty(); draw(); } } }), " ",
            el("button", { class: "icon-btn", type: "button", title: "Move down", text: "↓", onclick: function () { var a = obj[key]; if (idx < a.length - 1) { a.splice(idx + 1, 0, a.splice(idx, 1)[0]); markDirty(); draw(); } } }), " ",
            el("button", { class: "icon-btn del", type: "button", title: "Remove", text: "✕", onclick: function () { if (confirm("Remove this " + nm.toLowerCase() + "?")) { obj[key].splice(idx, 1); markDirty(); draw(); } } })
          ])
        ]));
        Object.keys(item).forEach(function (k) { var f = fieldFor(item, k); if (f) inner.appendChild(f); });
        box.appendChild(inner);
      });
      box.appendChild(el("button", { class: "add-link", type: "button", text: "+ Add " + nm.toLowerCase(), onclick: function () {
        var t = ITEM_TEMPLATES[key] ? clone(ITEM_TEMPLATES[key]) : blankLike(obj[key][0] || {});
        obj[key].push(t); markDirty(); draw();
      } }));
    }
    draw();
    return wrap(key, box);
  }
  function blankLike(o) {
    var n = {};
    Object.keys(o).forEach(function (k) { var v = o[k]; n[k] = typeof v === "boolean" ? v : Array.isArray(v) ? [""] : (typeof v === "object" && v) ? {} : ""; });
    return n;
  }

  /* ---------- picture & music upload ---------- */
  function mediaField(obj, key, kind) {
    var box = el("div", { class: "media" });
    function draw() {
      box.innerHTML = "";
      var val = obj[key] || "";
      if (kind === "image") {
        var th = el("div", { class: "thumb" });
        th.style.backgroundImage = val ? "url('" + val.replace(/'/g, "%27") + "')" : "none";
        if (!val) th.innerHTML = '<div style="display:grid;place-items:center;height:100%;font-size:11px;color:#9b8f7f;text-align:center">Built-in<br>picture</div>';
        box.appendChild(th);
      } else if (val) {
        box.appendChild(el("audio", { controls: true, src: val, preload: "none" }));
      }
      var file = el("input", { type: "file", accept: kind === "image" ? "image/*" : "audio/*", hidden: true });
      file.addEventListener("change", function () { if (file.files[0]) upload(file.files[0]); });
      var up = el("label", { class: "btn small" }, [val ? "Change" : "Upload", file]);
      var btns = el("div", { class: "btns" }, [up,
        val ? el("button", { class: "btn small danger", type: "button", text: kind === "image" ? "Use built-in" : "Remove", onclick: function () { obj[key] = ""; markDirty(); draw(); } }) : null]);
      box.appendChild(el("div", {}, [btns, el("small", { text: kind === "image" ? "JPG, PNG or WEBP. Big photos are made smaller automatically." : "MP3 or M4A, up to 5 MB." })]));
    }
    function upload(f) {
      if (offline) { toast("Uploading pictures or music needs the online version on Netlify.", true); return; }
      toast("Uploading…");
      var p = kind === "image" ? shrink(f) : Promise.resolve(f);
      p.then(function (blob) {
        if (blob.size > 5.5 * 1024 * 1024) throw new Error("File is too large (max 5 MB)");
        return api("/api/media", { method: "POST", headers: { "Content-Type": blob.type || f.type }, body: blob });
      }).then(function (j) { obj[key] = j.url; markDirty(); draw(); toast("Uploaded. Press “Save changes” to publish."); })
        .catch(function (e) { toast(e.message || "Upload failed", true); });
    }
    draw();
    return wrap(key, box);
  }
  function shrink(file) {
    return new Promise(function (resolve) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return resolve(file);
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var max = 1400, w = img.naturalWidth, h = img.naturalHeight, s = Math.min(1, max / Math.max(w, h));
        if (s === 1 && file.size < 900 * 1024) { URL.revokeObjectURL(url); return resolve(file); }
        var c = document.createElement("canvas"); c.width = Math.round(w * s); c.height = Math.round(h * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { resolve(b || file); }, "image/webp", 0.88);
      };
      img.onerror = function () { resolve(file); };
      img.src = url;
    });
  }

  /* ---------- sections list ---------- */
  function sectionTitle(s) {
    var n = SECTION_NAMES[s.type] || [s.type, ""];
    var t = n[0];
    if (s.type === "day") t += " – " + [s.weekday, s.date].filter(Boolean).join(", ");
    return t;
  }
  function sectionSub(s) {
    var n = SECTION_NAMES[s.type] || ["", ""];
    if (s.type === "day") return (s.events || []).map(function (e) { return e.name; }).filter(Boolean).join(" · ") || n[1];
    return n[1];
  }
  function updateTitles() {
    document.querySelectorAll(".sec-card").forEach(function (card, i) {
      var s = data.sections[i]; if (!s) return;
      $(".sec-title b", card).textContent = sectionTitle(s);
      $(".sec-title small", card).textContent = sectionSub(s);
    });
  }
  function renderSections() {
    var box = $("#sections"); box.innerHTML = "";
    data.sections.forEach(function (s, idx) {
      if (typeof s.show !== "boolean") s.show = true;
      var showInput = el("input", { type: "checkbox" }); showInput.checked = s.show;
      var card = el("div", { class: "sec-card" + (openSet[idx] ? " open" : "") + (s.show ? "" : " off") });
      showInput.addEventListener("change", function () { s.show = showInput.checked; card.classList.toggle("off", !s.show); markDirty(); });
      var stop = function (e) { e.stopPropagation(); };
      var tools = el("div", { class: "sec-tools", onclick: stop }, [
        el("label", { class: "switch", title: "Show / hide" }, [showInput, el("span", { class: "track" }), el("span", { class: "txt", text: "Show" })]),
        el("button", { class: "icon-btn", type: "button", title: "Move up", text: "↑", onclick: function () { move(idx, -1); } }),
        el("button", { class: "icon-btn", type: "button", title: "Move down", text: "↓", onclick: function () { move(idx, 1); } }),
        el("button", { class: "icon-btn", type: "button", title: "Duplicate", text: "⧉", onclick: function () { data.sections.splice(idx + 1, 0, clone(s)); shiftOpen(idx + 1, 1); markDirty(); renderSections(); } }),
        el("button", { class: "icon-btn del", type: "button", title: "Delete section", text: "✕", onclick: function () {
          if (confirm("Delete the section “" + sectionTitle(s) + "”? (Tip: you can also just hide it with the switch.)")) { data.sections.splice(idx, 1); shiftOpen(idx, -1); markDirty(); renderSections(); }
        } })
      ]);
      var head = el("div", { class: "sec-head", onclick: function () { card.classList.toggle("open"); openSet[idx] = card.classList.contains("open"); } }, [
        el("span", { class: "sec-num", text: String(idx + 1) }),
        el("div", { class: "sec-title" }, [el("b", { text: sectionTitle(s) }), el("small", { text: sectionSub(s) })]),
        tools, el("span", { class: "chev", text: "▾" })
      ]);
      var body = el("div", { class: "sec-body" });
      Object.keys(s).forEach(function (k) { if (k === "show") return; var f = fieldFor(s, k); if (f) body.appendChild(f); });
      body.addEventListener("input", updateTitles);
      card.appendChild(head); card.appendChild(body); box.appendChild(card);
    });
  }
  function shiftOpen(from, by) {
    var n = {}; Object.keys(openSet).forEach(function (k) { k = +k; if (!openSet[k]) return; if (k < from) n[k] = true; else if (by > 0) n[k + by] = true; else if (k > from) n[k - 1] = true; }); openSet = n;
  }
  function move(idx, dir) {
    var to = idx + dir; if (to < 0 || to >= data.sections.length) return;
    var a = data.sections; a.splice(to, 0, a.splice(idx, 1)[0]);
    var o1 = openSet[idx], o2 = openSet[to]; openSet[to] = o1; openSet[idx] = o2;
    markDirty(); renderSections();
  }
  function renderSettings() {
    var box = $("#settings"); box.innerHTML = "";
    var defaults = original && original.settings || {};
    Object.keys(defaults).forEach(function (k) { if (!(k in data.settings)) data.settings[k] = defaults[k]; });
    Object.keys(data.settings).forEach(function (k) { var f = fieldFor(data.settings, k); if (f) box.appendChild(f); });
  }
  function renderAll() { renderSections(); renderSettings(); }

  /* ---------- add section ---------- */
  $("#addSectionBtn").addEventListener("click", function () {
    var box = $("#addChoices"); box.innerHTML = "";
    Object.keys(SECTION_NAMES).forEach(function (type) {
      box.appendChild(el("button", { class: "choice", type: "button", onclick: function () {
        var tpl = (original.sections || []).filter(function (s) { return s.type === type; })[0];
        var s = tpl ? clone(tpl) : { type: type, show: true };
        s.show = true;
        data.sections.push(s); openSet[data.sections.length - 1] = true;
        markDirty(); renderSections(); $("#addDialog").close();
        setTimeout(function () { var cards = document.querySelectorAll(".sec-card"); cards[cards.length - 1].scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
      } }, [el("b", { text: SECTION_NAMES[type][0] }), el("small", { text: SECTION_NAMES[type][1] })]));
    });
    $("#addDialog").showModal();
  });
  document.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { b.closest("dialog").close(); }); });

  /* ---------- save / preview ---------- */
  function download(name, text, type) {
    var a = el("a", { href: URL.createObjectURL(new Blob([text], { type: type || "application/json" })), download: name });
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  $("#saveBtn").addEventListener("click", function () {
    if (offline) { download("content.json", JSON.stringify(data, null, 2)); markSaved(); toast("Downloaded content.json – replace the old file in the public folder."); return; }
    var b = $("#saveBtn"); b.disabled = true; b.textContent = "Saving…";
    api("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function () { markSaved(); toast("Saved! Your invitation is updated."); })
      .catch(function (e) { toast("Could not save: " + e.message, true); })
      .then(function () { b.disabled = false; b.textContent = "Save changes"; });
  });
  $("#previewBtn").addEventListener("click", function () {
    try { localStorage.setItem("invite-preview", JSON.stringify(data)); window.open("/?preview=1", "_blank"); }
    catch (e) { toast("Preview is not available in this browser. Save, then view the live site.", true); }
  });

  /* ---------- backup ---------- */
  $("#dlBackup").addEventListener("click", function () { download("invitation-backup-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(data, null, 2)); });
  $("#ulBackup").addEventListener("change", function (e) {
    var f = e.target.files[0]; if (!f) return;
    f.text().then(function (t) {
      var d = JSON.parse(t);
      if (!d || !Array.isArray(d.sections)) throw new Error();
      data = d; data.settings = data.settings || {}; openSet = {}; renderAll(); markDirty();
      toast("Copy loaded. Press “Save changes” to publish it.");
    }).catch(function () { toast("That file is not a valid invitation backup.", true); });
    e.target.value = "";
  });
  $("#resetBtn").addEventListener("click", function () {
    if (!confirm("Go back to the original invitation? All saved changes will be removed.")) return;
    var done = function () { data = clone(original); openSet = {}; renderAll(); markSaved(); toast("Reset to the original invitation."); };
    if (offline) { done(); return; }
    api("/api/content", { method: "DELETE" }).then(done).catch(function (e) { toast(e.message, true); });
  });

  /* ---------- guests ---------- */
  var guests = [];
  function loadGuests() {
    if (offline) { $("#guests").innerHTML = '<p class="empty">Guest responses are available on the online site.</p>'; return; }
    api("/api/rsvp").then(function (j) { guests = j.items || []; renderGuests(); }).catch(function (e) { $("#guests").innerHTML = '<p class="empty">' + e.message + "</p>"; });
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function renderGuests() {
    var yes = guests.filter(function (g) { return g.attending === "yes"; });
    var people = yes.reduce(function (n, g) { return n + (parseInt(g.guests, 10) || 1); }, 0);
    $("#guestStats").innerHTML =
      '<div class="stat"><b>' + guests.length + "</b><span>Responses</span></div>" +
      '<div class="stat"><b>' + yes.length + "</b><span>Coming</span></div>" +
      '<div class="stat"><b>' + people + "</b><span>Total guests coming</span></div>" +
      '<div class="stat"><b>' + (guests.length - yes.length) + "</b><span>Can't come</span></div>";
    if (!guests.length) { $("#guests").innerHTML = '<p class="empty">No responses yet. They will appear here when guests fill the form.</p>'; return; }
    var rows = guests.map(function (g) {
      return "<tr><td><b>" + esc(g.name) + "</b><br><small>" + esc(g.phone) + "</small></td>" +
        '<td><span class="pill ' + (g.attending === "yes" ? "yes" : "no") + '">' + (g.attending === "yes" ? "Coming" : "Not coming") + "</span></td>" +
        "<td>" + esc(g.guests) + '</td><td class="msgcell">' + esc(g.message) + "</td>" +
        "<td><small>" + esc(new Date(g.time).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })) + "</small></td>" +
        '<td><button class="icon-btn del" data-del="' + esc(g.id) + '" title="Delete">✕</button></td></tr>';
    }).join("");
    $("#guests").innerHTML = '<div class="table-wrap"><table class="g-table"><thead><tr><th>Name</th><th>Reply</th><th>Guests</th><th>Message</th><th>Received</th><th></th></tr></thead><tbody>' + rows + "</tbody></table></div>";
    document.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!confirm("Delete this response?")) return;
        api("/api/rsvp?id=" + encodeURIComponent(b.dataset.del), { method: "DELETE" }).then(loadGuests).catch(function (e) { toast(e.message, true); });
      });
    });
  }
  $("#refreshGuests").addEventListener("click", loadGuests);
  $("#csvGuests").addEventListener("click", function () {
    var q = function (s) { return '"' + String(s == null ? "" : s).replace(/"/g, '""') + '"'; };
    var lines = [["Name", "Phone", "Reply", "Guests", "Message", "Received"].map(q).join(",")].concat(guests.map(function (g) {
      return [g.name, g.phone, g.attending === "yes" ? "Coming" : "Not coming", g.guests, g.message, new Date(g.time).toLocaleString("en-IN")].map(q).join(",");
    }));
    download("guest-responses.csv", "﻿" + lines.join("\r\n"), "text/csv");
  });
})();
