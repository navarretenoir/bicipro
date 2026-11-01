// ADO O260T · mapas y ruteo 100 % offline de Chile (Kotone 2026-10-31).
//  · Capa base: PMTiles de Chile servido por la app (https://ado.local/mapas/chile.pmtiles, protomaps-leaflet,
//    estilo claro, rótulos en español). Si el archivo aún no está instalado → OpenStreetMap en línea de respaldo.
//  · Ruteo: BRouter embebido (window.Ruteo) con los segmentos de Chile; el resultado se traduce a los pasos
//    que ya entiende el motor de navegación (navigation.js), con la redacción de Google Maps
//    (ver mapas-offline/APRENDIZAJES-GOOGLE-MAPS.md) y el % de la ruta por ciclovía.
//  · Integración: otras apps abren ubicaciones aquí (geo:, google.navigation:, enlaces compartidos) → navegarA().
"use strict";
(function () {
  const R = window.Ruteo;
  const URL_MAPA = "https://ado.local/mapas/chile.pmtiles";

  function estado() { try { return R ? JSON.parse(R.estado()) : {}; } catch (e) { return {}; } }

  // ---------------------------------------------------------------- capa base
  window.capaMapaBase = function () {
    const st = estado();
    if (st.mapa > 0 && window.protomapsL) {
      // PMTiles con una fuente propia: cada trozo se pide como URL (?o=&l=) en vez de con cabecera Range, porque el
      // WebView rechaza respuestas interceptadas a rangos que no parten en 0. Se arma un PMTiles normal y se le
      // cambia la fuente (protomaps-leaflet acepta un objeto PMTiles en «url»).
      const ps = new protomapsL.PmtilesSource(URL_MAPA, true);
      ps.p.source = {
        getKey: () => URL_MAPA,
        getBytes: async (offset, length, signal) => {
          const r = await fetch(`${URL_MAPA}?o=${offset}&l=${length}`, { signal });
          if (!r.ok) throw new Error("mapa offline: " + r.status);
          return { data: await r.arrayBuffer() };
        },
      };
      return protomapsL.leafletLayer({ url: ps.p, flavor: "light", lang: "es", maxDataZoom: 15,
        attribution: "© OpenStreetMap · Protomaps (offline)" });
    }
    return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap (en línea: mapa offline no instalado)" });
  };
  window.mapaOfflineInstalado = () => estado().mapa > 0;

  // ---------------------------------------------------------------- ruteo
  let seq = 0; const espera = {};
  window.__ruta = (id, geo, err) => { const f = espera[id]; delete espera[id]; if (f) f(geo ? JSON.parse(geo) : null, err); };

  // comando BRouter → giro (dirCode = protocolo de la pantalla ADO: 01 recto, 02 izq, 03 der, 04 leve izq, 05 leve der, 07 llegada, 08 vuelta)
  const CMD = {
    1: ["straight", 0x01, "Continúa recto"], 2: ["turn-left", 0x02, "Gira a la izquierda"], 3: ["slight-left", 0x04, "Gira levemente a la izquierda"],
    4: ["turn-left", 0x02, "Gira bruscamente a la izquierda"], 5: ["turn-right", 0x03, "Gira a la derecha"], 6: ["slight-right", 0x05, "Gira levemente a la derecha"],
    7: ["turn-right", 0x03, "Gira bruscamente a la derecha"], 8: ["slight-left", 0x04, "Mantente a la izquierda"], 9: ["slight-right", 0x05, "Mantente a la derecha"],
    10: ["u-turn", 0x08, "Da la vuelta"], 11: ["u-turn", 0x08, "Da la vuelta"], 12: ["u-turn", 0x08, "Da la vuelta"],
    13: ["straight", 0x01, "Sal de la ruta"], 14: ["straight", 0x01, "En la rotonda, toma la salida"], 15: ["straight", 0x01, "En la rotonda, toma la salida"],
  };
  function dist(a, b) {   // metros, equirectangular (tramos cortos)
    const k = Math.PI / 180, x = (b[1] - a[1]) * k * Math.cos((a[0] + b[0]) / 2 * k), y = (b[0] - a[0]) * k;
    return Math.sqrt(x * x + y * y) * 6371000;
  }
  const fmt = m => m >= 1000 ? (m / 1000).toFixed(1).replace(".", ",") + " km" : Math.round(m / 10) * 10 + " m";

  function aRuta(geo, nombre) {
    const f = geo && geo.features && geo.features[0]; if (!f) return null;
    const pts = f.geometry.coordinates.map(c => [c[1], c[0]]);
    const acum = [0]; for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1] + dist(pts[i - 1], pts[i]));
    const total = acum[acum.length - 1];
    // % por ciclovía (BRouter informa las etiquetas OSM de cada tramo)
    let ciclo = 0, medida = 0;
    const msg = f.properties.messages || [], hdr = msg[0] || [], iT = hdr.indexOf("WayTags"), iD = hdr.indexOf("Distance");
    for (let i = 1; i < msg.length; i++) {
      const d = +msg[i][iD] || 0, t = msg[i][iT] || ""; medida += d;
      if (/highway=cycleway|cycleway(:\w+)?=(track|lane|separate|opposite_lane|opposite_track)|bicycle=designated/.test(t)) ciclo += d;
    }
    const pctCiclo = medida ? Math.round(ciclo / medida * 100) : 0;
    const steps = [{ stepNumber: 1, street: nombre, distanceM: 0, turnType: "straight", dirCode: 0x01,
      lat: pts[0][0], lng: pts[0][1], instruction: "Sigue la ruta marcada" }];
    let prevIdx = 0;
    (f.properties.voicehints || []).forEach(v => {
      const idx = Math.min(v[0], pts.length - 1), cmd = v[1], salida = v[2];
      if (cmd === 1 || !CMD[cmd]) return;                     // «continúa» no es maniobra
      const [tt, dc, txt] = CMD[cmd];
      steps.push({ stepNumber: steps.length + 1, street: txt + (cmd >= 14 && salida ? " " + salida : ""),
        distanceM: Math.round(acum[idx] - acum[prevIdx]), turnType: tt, dirCode: dc,
        lat: pts[idx][0], lng: pts[idx][1], instruction: txt + (cmd >= 14 && salida ? " " + salida : ""), _idx: idx });
      prevIdx = idx;
    });
    const fin = pts[pts.length - 1];
    steps.push({ stepNumber: steps.length + 1, street: nombre, distanceM: Math.round(total - acum[prevIdx]), turnType: "arrive",
      dirCode: 0x07, lat: fin[0], lng: fin[1], instruction: `Llegaste a ${nombre}` });
    // el primer paso dice cuánto falta para la primera maniobra (como Maps: «Continúa durante 400 m»)
    if (steps.length > 2) steps[0].instruction = `Continúa durante ${fmt(steps[1].distanceM)}`;
    steps[0].distanceM = steps[1] ? steps[1].distanceM : Math.round(total);
    const seg = +f.properties["total-time"] || total / 5.5;  // BRouter estima el tiempo en bici
    steps._pts = pts; steps._acum = acum;
    return { coordinates: pts, steps, totalDistKm: +(total / 1000).toFixed(2), etaMinutes: Math.max(1, Math.round(seg / 60)),
      destinationName: nombre, pctCiclovia: pctCiclo, offline: true };
  }

  // calle a la que se entra en cada maniobra: se mira ~25 m DESPUÉS del giro (la calle nueva, no la que se deja)
  async function nombrarCalles(r) {
    if (!window.Direcciones) return;
    const pts = r.steps._pts, acum = r.steps._acum;
    const despues = idx => { let j = idx; while (j < pts.length - 1 && acum[j] - acum[idx] < 25) j++; return pts[j]; };
    await Promise.all(r.steps.map(async (st, i) => {
      try {
        if (st._idx !== undefined) {
          const p = despues(st._idx), calle = await window.Direcciones.calleEn(p[0], p[1]);
          if (calle) { st.instruction += " en " + calle; st.street = st.instruction; st.calle = calle; }
        } else if (i === 0) {
          const calle = await window.Direcciones.calleEn(pts[Math.min(2, pts.length - 1)][0], pts[Math.min(2, pts.length - 1)][1]);
          if (calle) { st.instruction = st.instruction.replace(/^Continúa/, "Continúa por " + calle); st.calle = calle; }
        }
      } catch (e) { }
    }));
  }

  window.RuteoOffline = {
    disponible: () => !!R && estado().segmentos > 0,
    ruta(latA, lonA, latB, lonB, nombre) {
      return new Promise(res => {
        const id = ++seq;
        espera[id] = (geo, err) => {
          if (!geo) console.warn("BRouter: " + err);
          const r = geo ? aRuta(geo, nombre) : null;
          if (!r) return res(null);
          // nombres de calle (mapa offline) en cada giro; si tarda más de 2,5 s se navega igual sin ellos
          Promise.race([nombrarCalles(r), new Promise(ok => setTimeout(ok, 2500))]).then(() => res(r));
        };
        R.calcular(id, latA, lonA, latB, lonB, "trekking");
      });
    },
    distanciaARuta(lat, lng, pts) {     // m al tramo más cercano (para detectar desvío)
      let best = 1e9; const p = [lat, lng];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], k = Math.cos(lat * Math.PI / 180);
        const ax = (a[1] - lng) * k, ay = a[0] - lat, bx = (b[1] - lng) * k, by = b[0] - lat;
        const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
        let t = L2 ? -(ax * dx + ay * dy) / L2 : 0; t = Math.max(0, Math.min(1, t));
        const x = ax + t * dx, y = ay + t * dy, d = Math.sqrt(x * x + y * y) * 111195;
        if (d < best) best = d;
      }
      return best;
    },
  };

  // ---------------------------------------------------------------- abrir ubicaciones desde otras apps
  window.navegarA = function (lat, lng, nombre) {
    if (!isFinite(lat) || !isFinite(lng)) return;
    try { switchTab("tab-map"); } catch (e) { }
    setTimeout(() => window.startNavigationToNode({ lat: +lat, lng: +lng, name: nombre || "Destino compartido" }), 600);
  };
})();

// texto sin coordenadas (p. ej. «geo:0,0?q=Plaza de Armas, Santiago»): primer resultado del directorio offline
window.navegarATexto = function (q) {
  try {
    const r = (window.searchSantiagoLocations && window.searchSantiagoLocations(q)) || [];
    if (r.length && r[0].lat !== undefined && !/\d/.test(q)) return window.navegarA(r[0].lat, r[0].lng, r[0].name || q);
    // calle y número (o nada en el directorio): geocodificar
    const u = (window.getUserLocation && window.getUserLocation()) || {};
    (window.Direcciones ? window.Direcciones.buscar(q, u.lat, u.lng) : Promise.resolve([])).then(d => {
      const x = d[0] || r[0];
      if (x && x.lat !== undefined) window.navegarA(x.lat, x.lng, x.name || q);
      else if (window.showStravaNotice) showStravaNotice("No encontré «" + q + "»");
    });
  } catch (e) { }
};
