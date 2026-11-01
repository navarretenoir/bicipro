// ADO O260T · enlace con Clima y Metro (Kotone 2026-10-31).
// Clima: cada 10 min (5 con ruta en curso) trae el tiempo de tu posición →
//   · temperatura REAL en la barra de estado;
//   · el CIELO de fondo de la app, con los mismos degradados de Clima (condición + día/noche);
//   · con ruta en curso, cada alerta nueva (precaución/peligro) se avisa UNA vez por notificación y voz.
// Clima y Metro también EMPUJAN avisos (window.onEnlaceAlerta): con ruta, notificación + voz.
// Sin banners dentro de la app (decisión de Javiera, 31-oct).
"use strict";
(function () {
  const E = window.Enlace;
  const bridge = () => window.ADO || window.AdoBridge || window.BiciPRO;
  const enRuta = () => { try { return !!(state && state.recording); } catch (e) { return false; } };
  const avisadas = new Set();      // alertas ya avisadas en la ruta actual
  let ultimo = 0;                  // última consulta a Clima (ms); 0 = consultar en el próximo ciclo
  let rutaPrev = false;

  // ---- cielo: misma clasificación que el body de Clima (clear/cloud/rain/snow/fog/storm × día/noche)
  const CIELOS = ["clear-day", "clear-night", "cloud-day", "cloud-night", "rain", "snow", "fog", "storm"];
  function cielo(code, dia) {
    if (code >= 95) return "storm";
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    if (code === 45 || code === 48) return "fog";
    if (code >= 2) return dia ? "cloud-day" : "cloud-night";
    return dia ? "clear-day" : "clear-night";
  }
  function ponerCielo(c) {
    CIELOS.forEach(x => document.body.classList.remove("sky-" + x));
    document.body.classList.add("sky-" + c);
  }
  // sin datos todavía: cielo según la hora (como Clima mientras carga)
  const h = new Date().getHours();
  ponerCielo(h >= 7 && h < 20 ? "cloud-day" : "clear-night");
  if (!E) return;

  function avisarEnRuta(a) {
    const k = a.id || a.titulo;
    if (!enRuta() || avisadas.has(k)) return;
    avisadas.add(k);
    E.notificar(a.titulo, a.detalle || a.texto || "", a.nivel);
    const b = bridge(); if (b && b.speak) b.speak(a.titulo);
  }

  window.onClimaAlertas = function (d) {
    // sin posición GPS todavía (o Clima sin red): reintento en ~30 s, no en 10 min
    if (!d || !d.ok) { ultimo = 0; return; }
    const t = document.getElementById("val-weather");
    if (t && typeof d.temp === "number") t.textContent = d.temp + "°C";
    if (typeof d.codigo === "number") ponerCielo(cielo(d.codigo, !!d.es_dia));
    (d.alertas || []).filter(x => x.nivel === "danger" || x.nivel === "warn").forEach(avisarEnRuta);
  };
  window.onEnlaceAlerta = function (a) {   // empuje de Clima o Metro
    if (a) avisarEnRuta({ id: a.origen + ":" + a.titulo, nivel: a.nivel || "warn", titulo: a.titulo, texto: a.texto });
  };

  function ciclo() {
    const r = enRuta();
    if (r && !rutaPrev) avisadas.clear();          // ruta nueva: se vuelven a avisar
    rutaPrev = r;
    if (ultimo === 0 || Date.now() - ultimo >= (r ? 5 : 10) * 60000) { ultimo = Date.now(); E.consultarClima(); }
  }
  // ---- Now Bar de Samsung: ruta en curso o navegación (Java decide si el teléfono la soporta)
  let ultimoNow = "";
  function nowBar() {
    let p = { modo: "off" };
    const nav = window.navEstado && window.navEstado();
    const kmh = Math.round((state && state.currentSpeed) || 0);
    if (nav && nav.paso) {
      const d = document.getElementById("nav-hud-dist"), dist = d ? d.textContent : "";
      const prog = nav.total ? Math.round((1 - (nav.resto || 0) / nav.total) * 1000) : 0;
      p = { modo: "nav", titulo: `${dist ? "En " + dist + ", " : ""}${(nav.paso.instruction || "").replace(/^./, c => c.toLowerCase())}`.replace(/^./, c => c.toUpperCase()),
        texto: `${nav.destino || "Destino"} · ${String(nav.resto).replace(".", ",")} km · ${nav.eta} min`, chip: dist || kmh + " km/h", progreso: prog };
    } else if (enRuta()) {
      const km = ((state.distanceKm || 0)).toFixed(1).replace(".", ","), t = document.getElementById("val-time");
      p = { modo: "ruta", titulo: "Ruta en curso", texto: `${km} km · ${t ? t.textContent : ""} · ${kmh} km/h`, chip: kmh + " km/h" };
    }
    const k = JSON.stringify(p);
    if (k !== ultimoNow) { ultimoNow = k; try { E.nowBar(k); } catch (e) { } }
  }
  window.addEventListener("load", () => { setTimeout(ciclo, 1200); setInterval(ciclo, 30000); setInterval(nowBar, 2000); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { ultimo = 0; ciclo(); } });
})();
