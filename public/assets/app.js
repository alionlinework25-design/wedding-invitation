/* =========================================================
   Wedding Invitation – builds the page from your content.
   You normally never need to edit this file:
   change words and pictures from the Admin page ( /admin ).
   ========================================================= */
(function () {
  "use strict";

  var IMG = "/assets/img/";
  var ICONS = {
    "rings": "icon-rings.webp",
    "mehendi": "icon-mehendi.webp",
    "haldi": "icon-haldi.webp",
    "chak-bhat": "icon-chak-bhat.webp",
    "ghudchadi": "icon-ghudchadi.webp",
    "baraat": "icon-baraat.webp"
  };
  var ROUND_ICONS = { "haldi": 1, "chak-bhat": 1, "ghudchadi": 1, "baraat": 1 };

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function nl(s) { return esc(s).replace(/\n/g, "<br>"); }
  function has(s) { return s != null && String(s).trim() !== ""; }
  function list(a) { return (Array.isArray(a) ? a : []).filter(has); }
  function safeUrl(u) {
    u = String(u || "").trim();
    return /^(https?:\/\/|\/|tel:|mailto:)/i.test(u) ? u : "";
  }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  var DIVIDER = '<div class="divider"><i></i><b></b><i></i></div>';

  /* ---------- artwork (drawn in code) ---------- */
  function toranSVG() {
    var leaves = "", stars = "";
    for (var i = 0; i < 9; i++) {
      var x = 40 + i * 65, y = 22 + Math.sin((i / 8) * Math.PI) * 16;
      stars += '<path transform="translate(' + x + ' ' + y + ')" d="M0-6 1.6-1.6 6 0 1.6 1.6 0 6-1.6 1.6-6 0-1.6-1.6Z" fill="currentColor"/>';
      var lx = x + 32, ly = 22 + Math.sin(((i + 0.5) / 8) * Math.PI) * 16;
      if (i < 8) leaves += '<line x1="' + lx + '" y1="' + ly + '" x2="' + lx + '" y2="' + (ly + 8) + '" stroke="currentColor" stroke-width=".8"/><ellipse cx="' + lx + '" cy="' + (ly + 14) + '" rx="2.6" ry="6.5" fill="#6f7d4a" opacity=".85"/>';
    }
    function bell(x, cls) {
      return '<g class="bell ' + cls + '" style="transform-box:fill-box"><line x1="' + x + '" y1="0" x2="' + x + '" y2="42" stroke="currentColor" stroke-width="1"/>' +
        '<path d="M' + (x - 11) + ' 70 Q' + (x - 11) + ' 47 ' + x + ' 44 Q' + (x + 11) + ' 47 ' + (x + 11) + ' 70 Z" fill="#fbf4e6" stroke="currentColor" stroke-width="1.3"/>' +
        '<line x1="' + (x - 13) + '" y1="70" x2="' + (x + 13) + '" y2="70" stroke="currentColor" stroke-width="1.5"/><circle cx="' + x + '" cy="75" r="2.6" fill="currentColor"/></g>';
    }
    return '<svg class="toran" viewBox="0 0 600 95" aria-hidden="true"><path d="M0 14 Q300 60 600 14" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      leaves + stars + bell(150, "b1") + bell(450, "b2") + "</svg>";
  }
  function archSVG() {
    var ticks = "";
    for (var y = 150; y < 290; y += 16) ticks += '<line x1="14" y1="' + y + '" x2="20" y2="' + y + '"/><line x1="240" y1="' + y + '" x2="246" y2="' + y + '"/>';
    return '<svg viewBox="0 0 260 300" fill="none" stroke="currentColor" aria-hidden="true">' +
      '<path stroke-width="1.4" d="M20 300V150c0-10 8-18 18-22-2-16 8-28 22-30 2-18 18-30 36-28 8-18 22-26 34-40 12 14 26 22 34 40 18-2 34 10 36 28 14 2 24 14 22 30 10 4 18 12 18 22v150"/>' +
      '<path stroke-width=".6" opacity=".6" d="M28 296V154c0-8 7-15 16-18-1-14 8-24 20-26 2-16 16-26 32-24 7-16 20-23 34-36 14 13 27 20 34 36 16-2 30 8 32 24 12 2 21 12 20 26 9 3 16 10 16 18v142"/>' +
      '<g stroke-width=".8" opacity=".7">' + ticks + '</g><path stroke-width="1.4" d="M10 298h22M228 298h22"/></svg>';
  }
  function cornerSVG(cls) {
    return '<svg class="corner ' + cls + '" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M2 30C2 14 14 2 30 2"/><path d="M8 26c3-6 9-11 16-12" opacity=".7"/><circle cx="30" cy="2" r="1.6" fill="currentColor"/><circle cx="2" cy="30" r="1.6" fill="currentColor"/></svg>';
  }
  function sprigSVG(cls) {
    return '<svg class="sprig ' + cls + '" viewBox="0 0 40 30" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 26C14 22 24 14 34 6"/><path d="M14 21c-2-4-1-7 2-9M22 16c-1-4 0-7 3-8M14 21c4 1 7 0 9-2M22 16c4 0 6-1 8-4" /><path d="M36 2l1.2 3 3 1.2-3 1.2L36 10.4l-1.2-3-3-1.2 3-1.2Z" fill="currentColor" stroke="none"/></svg>';
  }
  var PIN = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>';
  var SPARKLE = '<svg class="sparkle" viewBox="0 0 40 40" fill="currentColor"><path d="M20 2l3 13 13 5-13 5-3 13-3-13-13-5 13-5Z" opacity=".85"/><circle cx="33" cy="8" r="1.5"/><circle cx="8" cy="33" r="1.2"/></svg>';

  function ganeshaSrc(c) { return has(c.ganeshaImage) ? c.ganeshaImage : IMG + "ganesha.webp"; }
  function archBlock(src, small) {
    return '<div class="arch glow ' + (small ? "small" : "") + ' reveal">' + archSVG() + '<img src="' + esc(src) + '" alt="Shri Ganesh" loading="lazy"></div>';
  }
  function shloka(lines) {
    lines = list(lines);
    if (!lines.length) return "";
    return '<div class="shloka-wrap reveal">' + lines.map(function (l) { return '<p class="deva">' + esc(l) + "</p>"; }).join("") + "</div>";
  }
  function iconFor(ev) {
    if (has(ev.iconImage)) return { src: ev.iconImage, round: false };
    if (ICONS[ev.icon]) return { src: IMG + ICONS[ev.icon], round: !!ROUND_ICONS[ev.icon] };
    return null;
  }

  /* ---------- sections ---------- */
  var R = {};
  var STATE = { ganesha: IMG + "ganesha.webp" };

  R.envelope = function () { return ""; }; // envelope is drawn separately (intro)

  R.blessing = function (c) {
    STATE.ganesha = ganeshaSrc(c);
    var names = list(c.names).map(function (n) { return "<p>" + nl(n) + "</p>"; }).join("");
    return '<section class="sec blessing">' +
      (c.showToran !== false ? toranSVG() : "") +
      archBlock(STATE.ganesha) + shloka(c.shloka) +
      (has(c.title) ? '<h2 class="caps-title reveal">' + esc(c.title) + "</h2>" : "") +
      (names ? '<div class="names-list reveal">' + names + "</div>" : "") +
      DIVIDER + "</section>";
  };

  R.family = function (c) {
    var groups = (c.groups || []).filter(function (g) { return has(g.heading) || list(g.names).length; });
    var html = groups.map(function (g, i) {
      return '<div class="group reveal ' + (i === 0 ? "first" : "") + '">' +
        (has(g.heading) ? '<p class="eyebrow">' + esc(g.heading) + "</p>" : "") +
        list(g.names).map(function (n) { return "<p>" + nl(n) + "</p>"; }).join("") + "</div>";
    }).join(DIVIDER);
    var note = "";
    if (has(c.noteFrom) || has(c.noteText)) {
      note = (html ? DIVIDER : "") + '<div class="note reveal">' +
        (has(c.noteHeading) ? '<p class="eyebrow">' + esc(c.noteHeading) + "</p>" : "") +
        (has(c.noteFrom) ? '<div class="script">' + esc(c.noteFrom) + "</div>" : "") +
        (has(c.noteText) ? '<p class="quote">' + nl(c.noteText) + "</p>" : "") + "</div>";
    }
    return '<section class="sec family">' + html + note + "</section>";
  };

  R.couple = function (c) {
    return '<section class="sec couple"><div class="card couple-card reveal">' +
      cornerSVG("tl") + cornerSVG("tr") + cornerSVG("bl") + cornerSVG("br") +
      (c.showGanesha !== false ? '<img class="mini-ganesha" src="' + esc(STATE.ganesha) + '" alt="">' : "") +
      (has(c.hosts) ? '<p class="hosts">' + nl(c.hosts) + "</p>" : "") +
      (has(c.inviteLine) ? '<p class="invite-line">' + nl(c.inviteLine) + "</p>" : "") +
      '<div class="name-row">' + sprigSVG("l") + '<span class="script">' + esc(c.groom) + "</span>" + sprigSVG("r") + "</div>" +
      (has(c.groomDetail) ? '<p class="detail">' + nl(c.groomDetail) + "</p>" : "") +
      (c.showRings !== false ? '<img class="rings" src="' + IMG + 'icon-rings.webp" alt="">' : '<div style="height:26px"></div>') +
      (has(c.joinWord) ? '<p class="join-word">' + esc(c.joinWord) + "</p>" : "") +
      '<div class="name-row">' + sprigSVG("l") + '<span class="script">' + esc(c.bride) + "</span>" + sprigSVG("r") + "</div>" +
      (has(c.brideDetail) ? '<p class="detail">' + nl(c.brideDetail) + "</p>" : "") +
      DIVIDER + "</div></section>";
  };

  R.ribbon = function (c) {
    var items = list(c.items);
    if (!items.length) return "";
    var one = items.map(function (t) {
      var cls = /[ऀ-ॿ]/.test(t) ? "deva-item" : (/\bweds\b/i.test(t) ? "script-item" : "");
      return '<span class="ribbon-item ' + cls + '">' + esc(t) + "</span>";
    }).join("");
    var set = one + one + one;
    return '<div class="ribbon" aria-hidden="true"><div class="ribbon-track">' + set + set + "</div></div>";
  };

  R.day = function (c) {
    var events = (c.events || []).filter(function (e) { return has(e.name); });
    var body = "";
    if (c.layout === "timeline") {
      body = '<div class="timeline">' + events.map(function (e, i) {
        var ic = iconFor(e);
        var map = safeUrl(e.mapLink);
        return '<div class="t-item reveal"><div class="t-badge">' +
          (ic ? '<img src="' + esc(ic.src) + '" alt="" class="' + (ic.round ? "" : "contain") + '">' : "") + "</div>" +
          '<div class="t-text"><p class="eyebrow">Event ' + two(i + 1) + "</p>" +
          '<h3 class="ev-name">' + esc(e.name) + "</h3>" +
          (has(e.details) ? '<p class="ev-time">' + nl(e.details) + "</p>" : "") +
          (has(e.venue) ? '<p class="ev-venue">' + nl(e.venue) + "</p>" : "") +
          (has(e.address) ? '<p class="ev-venue small">' + nl(e.address) + "</p>" : "") +
          (map ? '<a class="ev-map" href="' + esc(map) + '" target="_blank" rel="noopener">Get directions</a>' : "") +
          "</div></div>";
      }).join("") + "</div>";
    } else {
      body = '<div class="arch-cards">' + events.map(function (e, i) {
        var ic = iconFor(e);
        var map = safeUrl(e.mapLink);
        return '<div class="card arch-card reveal"><p class="eyebrow">Event ' + two(i + 1) + "</p>" +
          (ic ? '<img class="ev-icon" src="' + esc(ic.src) + '" alt="">' : "") +
          '<h3 class="ev-name">' + esc(e.name) + "</h3>" +
          (has(e.details) ? '<p class="ev-time">' + nl(e.details) + "</p>" : "") +
          ((has(e.venue) || has(e.address)) ? '<div class="divider"><i></i><b></b><i></i></div>' : "") +
          (has(e.venue) ? '<p class="ev-venue">' + nl(e.venue) + "</p>" : "") +
          (has(e.address) ? '<p class="ev-venue">' + nl(e.address) + "</p>" : "") +
          (map ? '<a class="ev-map" href="' + esc(map) + '" target="_blank" rel="noopener">Get directions</a>' : "") +
          "</div>";
      }).join("") + "</div>";
    }
    var cd = c.showCountdown ? '<p class="eyebrow reveal">' + esc(c.countdownLabel || "") + '</p><div class="countdown reveal" data-countdown></div>' : "";
    return '<section class="sec day ' + (c.layout === "timeline" ? "timeline-day" : "cards-day") + '">' +
      shloka(c.shloka) +
      (has(c.intro) ? '<p class="intro-line reveal">' + nl(c.intro) + "</p>" : "") +
      (has(c.weekday) ? '<p class="weekday reveal">' + esc(c.weekday) + "</p>" : "") +
      (has(c.date) ? '<p class="date-big reveal">' + esc(c.date) + "</p>" : "") +
      cd +
      (has(c.dayLabel) ? '<div class="reveal"><span class="day-label">' + esc(c.dayLabel) + "</span></div>" : "") +
      body + DIVIDER + "</section>";
  };

  R.venues = function (c) {
    var v = (c.venues || []).filter(function (x) { return has(x.name); });
    return '<section class="sec venues"><div class="reveal">' + SPARKLE + "</div>" +
      (has(c.title) ? '<h2 class="caps-title reveal">' + esc(c.title) + "</h2>" : "") +
      '<div class="venue-grid">' + v.map(function (x) {
        var map = safeUrl(x.mapLink);
        return '<div class="card venue-card reveal"><div class="pin">' + PIN + "</div>" +
          (has(x.heading) ? '<p class="eyebrow">' + esc(x.heading) + "</p>" : "") +
          '<h3 class="serif-name">' + esc(x.name) + "</h3>" +
          (has(x.address) ? "<p>" + nl(x.address) + "</p>" : "") +
          (map ? '<a class="pill-btn" href="' + esc(map) + '" target="_blank" rel="noopener">' + esc(x.buttonText || "View location") + "</a>" : "") +
          "</div>";
      }).join("") + "</div>" + DIVIDER + "</section>";
  };

  R.rsvp = function (c) {
    var num = String(c.whatsappNumber || "").replace(/[^\d]/g, "");
    var wa = num ? '<a class="wa-link" target="_blank" rel="noopener" href="https://wa.me/' + num + "?text=" +
      encodeURIComponent("Namaste! Sending our blessings for the wedding.") + '">' + esc(c.whatsappText || "Reply on WhatsApp") + "</a>" : "";
    var opts = "";
    for (var i = 1; i <= 10; i++) opts += "<option>" + i + "</option>";
    return '<section class="sec rsvp-sec" id="rsvp"><div class="card rsvp-card reveal">' +
      '<div class="head">' + (has(c.heading) ? '<p class="eyebrow">' + esc(c.heading) + "</p>" : "") +
      '<div class="script">' + esc(c.title || "") + "</div>" +
      (has(c.subtitle) ? '<p class="italic">' + nl(c.subtitle) + "</p>" : "") + "</div>" +
      '<form id="rsvpForm" novalidate>' +
      '<div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" required maxlength="80" autocomplete="name"></div>' +
      '<div class="row2"><div class="field"><label for="f-phone">Phone (optional)</label><input id="f-phone" name="phone" maxlength="20" inputmode="tel" autocomplete="tel"></div>' +
      '<div class="field"><label for="f-guests">Number of guests</label><select id="f-guests" name="guests">' + opts + "</select></div></div>" +
      '<div class="field"><label>Will you attend?</label><div class="choice">' +
      '<label><input type="radio" name="attending" value="yes" checked> Joyfully accept</label>' +
      '<label><input type="radio" name="attending" value="no"> Regretfully decline</label></div></div>' +
      '<div class="field"><label for="f-msg">Your blessings / message</label><textarea id="f-msg" name="message" maxlength="600"></textarea></div>' +
      '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<button class="submit" type="submit">' + esc(c.buttonText || "Send") + "</button>" +
      '<p class="form-msg" id="formMsg" role="status"></p></form>' + wa +
      '<div class="thanks" id="thanks" hidden><div class="script">Dhanyavaad</div><p class="italic">' + nl(c.thankYou || "Thank you!") + "</p></div>" +
      "</div></section>";
  };

  R.closing = function (c, settings) {
    var peacock = has(c.peacockImage) ? c.peacockImage : IMG + "peacock.webp";
    return '<section class="sec closing">' +
      (c.showToran !== false ? toranSVG() : "") +
      (c.showGanesha !== false ? archBlock(STATE.ganesha, true) : "") +
      '<div class="reveal" style="margin-top:34px">' +
      (has(c.heading) ? '<p class="eyebrow">' + esc(c.heading) + "</p>" : "") +
      (has(c.date) ? '<p class="date">' + esc(c.date) + "</p>" : "") + "</div>" +
      '<h2 class="script big-name reveal">' + esc(c.groom) + "</h2>" +
      (has(c.joinWord) ? '<p class="weds reveal">' + esc(c.joinWord) + "</p>" : "") +
      '<h2 class="script big-name reveal">' + esc(c.bride) + "</h2>" + DIVIDER +
      '<div class="reveal">' + (has(c.fromHeading) ? '<p class="eyebrow">' + esc(c.fromHeading) + "</p>" : "") +
      (has(c.from) ? '<p class="from">' + nl(c.from) + "</p>" : "") +
      (has(c.quote) ? '<p class="quote">' + nl(c.quote) + "</p>" : "") + "</div>" +
      (c.showLotus !== false ? '<img class="lotus reveal" src="' + IMG + 'lotus.webp" alt="" loading="lazy">' : "") +
      '<div class="dots3"><span></span><span></span><span></span></div>' +
      (c.showPeacocks !== false ? '<img class="peacock l" src="' + esc(peacock) + '" alt=""><img class="peacock r" src="' + esc(peacock) + '" alt="">' : "") +
      (has(settings.musicCredit) ? '<p class="credit">' + esc(settings.musicCredit) + "</p>" : "") +
      "</section>";
  };

  /* ---------- envelope intro ---------- */
  function buildIntro(env) {
    var el = document.getElementById("intro");
    el.innerHTML =
      '<div class="env">' +
      '<div class="env-letter"><img src="' + esc(STATE.ganesha) + '" alt=""><p class="deva">' + esc(env.topLine || "") + "</p></div>" +
      '<div class="env-body">' + cornerSVG("tl") + cornerSVG("tr") + cornerSVG("bl") + cornerSVG("br") +
      '<div class="env-text">' +
      (has(env.topLine) ? '<p class="deva">' + esc(env.topLine) + "</p>" : "") +
      (has(env.invitedLine) ? '<p class="eyebrow">' + esc(env.invitedLine) + "</p>" : "") +
      (has(env.subLine) ? '<div class="sub">' + esc(env.subLine) + "</div>" : "") + "</div>" +
      '<div class="script">' + esc(env.names || "") + "</div>" +
      '<div class="divider" style="margin:2px auto"><b></b></div>' +
      (has(env.dates) ? '<div class="dates">' + esc(env.dates) + "</div>" : "") + "</div>" +
      '<svg class="env-flap" viewBox="0 0 100 69" preserveAspectRatio="none"><line x1="0" y1="0" x2="50" y2="37" vector-effect="non-scaling-stroke"/><line x1="100" y1="0" x2="50" y2="37" vector-effect="non-scaling-stroke"/></svg>' +
      '<button class="seal" type="button" aria-label="Open invitation">' + esc(env.sealText || "") + "</button>" +
      "</div>" +
      '<button class="open-btn" type="button">' + esc(env.buttonText || "Open Invitation") + "</button>" +
      (has(env.hint) ? '<p class="hint">' + esc(env.hint) + "</p>" : "");
    el.hidden = false;
    document.body.classList.add("locked");
    var done = false;
    function open() {
      if (done) return; done = true;
      el.classList.add("opening");
      playMusic();
      setTimeout(function () {
        window.scrollTo(0, 0);
        document.body.classList.add("opened");
        document.body.classList.remove("locked");
        revealNow();
      }, 1900);
      setTimeout(function () { el.hidden = true; }, 3100);
    }
    el.querySelector(".seal").addEventListener("click", open);
    el.querySelector(".open-btn").addEventListener("click", open);
  }

  /* ---------- music ---------- */
  var audio, btn;
  function setupMusic(settings) {
    audio = document.getElementById("bgMusic");
    btn = document.getElementById("musicBtn");
    if (!has(settings.musicFile)) return;
    audio.src = settings.musicFile;
    btn.hidden = false;
    btn.classList.add("muted");
    btn.addEventListener("click", function () {
      if (audio.paused) playMusic(); else { audio.pause(); btn.classList.remove("playing"); btn.classList.add("muted"); }
    });
  }
  function playMusic() {
    if (!audio || !audio.src) return;
    audio.volume = 0.6;
    var p = audio.play();
    if (p && p.then) p.then(function () { btn.classList.add("playing"); btn.classList.remove("muted"); }).catch(function () {});
  }

  /* ---------- countdown ---------- */
  function startCountdown(target) {
    var boxes = document.querySelectorAll("[data-countdown]");
    if (!boxes.length || !has(target)) return;
    var t = String(target).trim();
    if (t.length <= 16) t += ":00";
    if (!/[zZ]|[+-]\d\d:?\d\d$/.test(t)) t += "+05:30"; // India time
    var end = new Date(t).getTime();
    if (isNaN(end)) return;
    function tick() {
      var diff = end - Date.now();
      var html;
      if (diff <= 0) html = '<span class="cd-done">The celebrations have begun!</span>';
      else {
        var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
        var parts = [[d, "Days"], [h, "Hours"], [m, "Minutes"], [s, "Seconds"]];
        html = parts.map(function (p) { return '<div class="cd-box"><strong>' + two(p[0]) + "</strong><small>" + p[1] + "</small></div>"; }).join('<span class="cd-sep">◆</span>');
      }
      boxes.forEach(function (b) { b.innerHTML = html; });
      if (diff > 0) setTimeout(tick, 1000);
    }
    tick();
  }

  /* ---------- petals ---------- */
  function petals() {
    var box = document.getElementById("petals");
    var n = window.innerWidth < 600 ? 9 : 16;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      var size = 8 + Math.random() * 8;
      p.style.left = Math.random() * 100 + "%";
      p.style.width = size + "px";
      p.style.height = size * 0.75 + "px";
      p.style.animationDuration = 11 + Math.random() * 12 + "s";
      p.style.animationDelay = -Math.random() * 20 + "s";
      p.style.opacity = 0.25 + Math.random() * 0.35;
      box.appendChild(p);
    }
  }

  /* ---------- reveal on scroll ---------- */
  var io;
  function setupReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  function revealNow() {
    document.querySelectorAll(".reveal").forEach(function (e) {
      var r = e.getBoundingClientRect();
      if (r.top < window.innerHeight) e.classList.add("in");
    });
  }

  /* ---------- RSVP form ---------- */
  function setupForm() {
    var form = document.getElementById("rsvpForm");
    if (!form) return;
    var msg = document.getElementById("formMsg");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { data[k] = String(v).trim(); });
      if (!data.name) { msg.className = "form-msg err"; msg.textContent = "Please write your name."; return; }
      var b = form.querySelector(".submit");
      b.disabled = true; msg.className = "form-msg"; msg.textContent = "Sending…";
      fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function () { form.hidden = true; document.getElementById("thanks").hidden = false; })
        .catch(function () { b.disabled = false; msg.className = "form-msg err"; msg.textContent = "Sorry, it could not be sent right now. Please try again in a moment."; });
    });
  }

  /* ---------- settings ---------- */
  function applySettings(s) {
    var root = document.documentElement.style;
    if (has(s.goldColor)) root.setProperty("--gold", s.goldColor);
    if (has(s.maroonColor)) root.setProperty("--maroon", s.maroonColor);
    if (has(s.backgroundColor)) { root.setProperty("--bg", s.backgroundColor); document.body.style.backgroundColor = s.backgroundColor; }
    if (has(s.pageTitle)) document.title = s.pageTitle;
    if (s.sideBorders !== false) document.body.classList.add("with-borders");
    if (s.fallingPetals !== false && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) petals();
  }

  /* ---------- load content ---------- */
  function load() {
    // Preview from the admin page (unsaved changes)
    if (/[?&]preview=1/.test(location.search)) {
      try { var d = JSON.parse(localStorage.getItem("invite-preview") || "null"); if (d && d.sections) return Promise.resolve(d); } catch (e) {}
    }
    return fetch("/api/content", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function (d) { if (!d || !d.sections) throw new Error(); return d; })
      .catch(function () { return fetch("/content.json", { cache: "no-store" }).then(function (r) { return r.json(); }); });
  }

  load().then(function (data) {
    var settings = data.settings || {};
    var sections = (data.sections || []).filter(function (s) { return s && s.show !== false; });
    applySettings(settings);

    // find Ganesha picture first so every section can use it
    sections.forEach(function (s) { if (s.type === "blessing") STATE.ganesha = ganeshaSrc(s); });

    var html = sections.map(function (s) { return R[s.type] ? R[s.type](s, settings) : ""; }).join("");
    document.getElementById("invite").innerHTML = html;

    setupMusic(settings);
    startCountdown(settings.countdownTo);
    setupForm();
    setupReveal();

    var env = sections.filter(function (s) { return s.type === "envelope"; })[0];
    if (env) buildIntro(env);
    else { document.body.classList.add("no-envelope"); setTimeout(revealNow, 50); }
    document.body.classList.remove("is-loading");
  }).catch(function () {
    document.getElementById("invite").innerHTML = '<p class="sec">Could not load the invitation. Please refresh the page.</p>';
    document.body.classList.add("no-envelope");
    document.body.classList.remove("is-loading");
  });
})();
