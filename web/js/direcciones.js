// ADO O260T · direcciones: calles y numeración (Kotone 2026-10-31).
//  El directorio offline (chile-database.js) sólo conoce lugares con nombre (metro, plazas, hitos). Esto agrega:
//   · Búsqueda de CALLE + NÚMERO («Gran Avenida 5420, San Miguel», «pje los aromos #123»):
//       – en línea: Photon (OSM, komoot) con sesgo a tu posición; respaldo Nominatim (OSM). Sólo viaja el texto
//         buscado y una posición aproximada (2 decimales ≈ 1 km), nunca tu ubicación exacta.
//       – sin conexión: nombres de calles leídos del mapa offline (PMTiles, capa «roads») alrededor tuyo; sin datos
//         de numeración offline se lleva al punto de esa calle más cercano y se avisa.
//   · Nombre de la calle en cada giro de la navegación («Gira a la derecha en Avenida Matta»), leído del mapa
//     offline (sin red) — BRouter da la maniobra pero no el nombre.
"use strict";
(function () {
  const URL_MAPA = "https://ado.local/mapas/chile.pmtiles";
  const CHILE = "-76,-56.5,-66,-17.4";                     // bbox para Photon (lon,lat,lon,lat)
  let fuente = null;

  function mapaListo() { try { return window.mapaOfflineInstalado && window.mapaOfflineInstalado() && window.protomapsL; } catch (e) { return false; } }
  function src() {
    if (fuente || !mapaListo()) return fuente;
    const ps = new protomapsL.PmtilesSource(URL_MAPA, false);
    ps.p.source = {
      getKey: () => URL_MAPA,
      getBytes: async (offset, length, signal) => {
        const r = await fetch(`${URL_MAPA}?o=${offset}&l=${length}`, { signal });
        if (!r.ok) throw new Error("mapa offline: " + r.status);
        return { data: await r.arrayBuffer() };
      },
    };
    return (fuente = ps);
  }

  // ------------------------------------------------------------------ utilidades
  const norm = s => (s || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,;#°º]/g, " ").replace(/\s+/g, " ").trim();
  const ABREV = { av: "avenida", avda: "avenida", "av.": "avenida", pje: "pasaje", psje: "pasaje", gral: "general",
    pdte: "presidente", sta: "santa", sto: "santo", cmdte: "comandante", cap: "capitan", tte: "teniente", calle: "" };
  const expandir = s => norm(s).split(" ").map(w => ABREV[w] !== undefined ? ABREV[w] : w).filter(Boolean).join(" ");

  /** «Gran Avenida 5420, San Miguel» → {calle:"Gran Avenida", numero:"5420", comuna:"San Miguel"} */
  function partir(q) {
    const [antes, ...resto] = q.split(",");
    const comuna = resto.join(",").trim();
    const m = antes.match(/^(.*?)\s*(?:#|n[°º]?\.?|nro\.?|numero)?\s*(\d{1,5}[a-z]?)\s*$/i);
    if (m && m[1].trim()) return { calle: m[1].trim(), numero: m[2], comuna };
    return { calle: antes.trim(), numero: "", comuna };
  }
  function km(a, b, c, d) {
    const k = Math.PI / 180, x = (d - b) * k * Math.cos((a + c) / 2 * k), y = (c - a) * k;
    return Math.sqrt(x * x + y * y) * 6371;
  }
  const tileDe = (lat, lng, z) => {
    const n = 2 ** z, x = Math.floor((lng + 180) / 360 * n);
    const r = lat * Math.PI / 180, y = Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n);
    return { x, y, z };
  };
  // píxel (0–256) dentro del tile → lat/lng
  const aLatLng = (t, px, py) => {
    const n = 2 ** t.z, lng = (t.x + px / 256) / n * 360 - 180;
    const yy = Math.PI * (1 - 2 * (t.y + py / 256) / n);
    return [Math.atan(Math.sinh(yy)) * 180 / Math.PI, lng];
  };
  const aPx = (t, lat, lng) => {
    const n = 2 ** t.z, r = lat * Math.PI / 180;
    return [((lng + 180) / 360 * n - t.x) * 256, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n - t.y) * 256];
  };
  const cacheTiles = new Map();
  async function calles(t) {
    const k = t.z + "/" + t.x + "/" + t.y;
    if (cacheTiles.has(k)) return cacheTiles.get(k);
    const p = (async () => {
      try { const m = await src().get(t, 256); return (m && (m.get("roads") || m.get("transportation"))) || []; }
      catch (e) { return []; }
    })();
    cacheTiles.set(k, p);
    if (cacheTiles.size > 120) cacheTiles.delete(cacheTiles.keys().next().value);
    return p;
  }
  const nombreDe = f => (f.props && (f.props["name:es"] || f.props.name || f.props["pmap:name"])) || "";
  function distSeg(px, py, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy;
    let t = L2 ? ((px - a.x) * dx + (py - a.y) * dy) / L2 : 0; t = Math.max(0, Math.min(1, t));
    const x = a.x + t * dx - px, y = a.y + t * dy - py; return { d: Math.sqrt(x * x + y * y), x: a.x + t * dx, y: a.y + t * dy };
  }

  // ------------------------------------------------------------------ offline: nombre de la calle en un punto
  /** Nombre de la calle más cercana (≤ ~25 m) a lat/lng según el mapa offline; null si no hay mapa o calle. */
  async function calleEn(lat, lng) {
    if (!src()) return null;
    const t = tileDe(lat, lng, 15), [px, py] = aPx(t, lat, lng);
    let mejor = null, dm = 1e9;
    for (const f of await calles(t)) {
      const nom = nombreDe(f); if (!nom) continue;
      for (const linea of f.geom) for (let i = 1; i < linea.length; i++) {
        const r = distSeg(px, py, linea[i - 1], linea[i]);
        if (r.d < dm) { dm = r.d; mejor = nom; }
      }
    }
    // z15: 1 px ≈ 4,8 m·cos(lat) → 6 px ≈ 25 m en Santiago
    return dm <= 6 ? mejor : null;
  }

  // ------------------------------------------------------------------ offline: buscar calles por nombre
  async function buscarOffline(q, lat, lng) {
    if (!src()) return [];
    const { calle, numero } = partir(q), want = expandir(calle).split(" ").filter(w => w.length > 1);
    if (!want.length) return [];
    const c = tileDe(lat, lng, 14), R = 3, hall = new Map();   // 7×7 tiles z14 ≈ 15 km por lado en Santiago
    const tareas = [];
    for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) tareas.push({ x: c.x + dx, y: c.y + dy, z: 14 });
    const lotes = await Promise.all(tareas.map(t => calles(t).then(fs => [t, fs])));
    for (const [t, fs] of lotes) for (const f of fs) {
      const nom = nombreDe(f); if (!nom) continue;
      const nn = expandir(nom); if (!want.every(w => nn.includes(w))) continue;
      // punto de esa calle más cercano a la ciclista
      const [ux, uy] = aPx(t, lat, lng);
      for (const linea of f.geom) for (let i = 1; i < linea.length; i++) {
        const r = distSeg(ux, uy, linea[i - 1], linea[i]);
        const [la, lo] = aLatLng(t, r.x, r.y), d = km(lat, lng, la, lo), prev = hall.get(nom);
        if (!prev || d < prev.d) hall.set(nom, { d, la, lo });
      }
    }
    return [...hall.entries()].sort((a, b) => a[1].d - b[1].d).slice(0, 6).map(([nom, h]) => ({
      name: nom + (numero ? " " + numero : ""), commune: numero ? "Sin numeración offline: punto más cercano de la calle" : "Calle (mapa offline)",
      category: "Calle", lat: h.la, lng: h.lo, distFromUserKm: +h.d.toFixed(1), fuente: "offline",
    }));
  }

  // ------------------------------------------------------------------ en línea: Photon → Nominatim
  async function conTiempo(url, ms) {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
    try { const r = await fetch(url, { signal: ac.signal }); if (!r.ok) throw new Error(r.status); return await r.json(); }
    finally { clearTimeout(t); }
  }
  function etiqueta(calle, num, nombre) {
    const dir = [calle, num].filter(Boolean).join(" ");
    return nombre && nombre !== calle ? (dir ? `${nombre} · ${dir}` : nombre) : (dir || nombre || "Dirección");
  }
  async function photon(q, lat, lng) {
    const u = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10&lat=${lat.toFixed(2)}&lon=${lng.toFixed(2)}&bbox=${CHILE}`;
    const j = await conTiempo(u, 6000);
    return (j.features || []).filter(f => (f.properties.countrycode || "").toUpperCase() === "CL").map(f => {
      const p = f.properties, [lo, la] = f.geometry.coordinates;
      return { name: etiqueta(p.street || (p.osm_key === "highway" ? p.name : ""), p.housenumber, p.osm_key === "highway" ? "" : p.name),
        commune: [p.district, p.city || p.county, p.state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).slice(0, 2).join(", "),
        category: p.housenumber ? "Dirección" : (p.osm_key === "highway" ? "Calle" : "Lugar"), exacta: !!p.housenumber,
        lat: la, lng: lo, distFromUserKm: +km(lat, lng, la, lo).toFixed(1), fuente: "photon" };
    });
  }
  async function nominatim(q, lat, lng) {
    const vb = [lng - 0.4, lat + 0.4, lng + 0.4, lat - 0.4].map(v => v.toFixed(2)).join(",");
    const u = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=cl&limit=8&accept-language=es&viewbox=${vb}&q=${encodeURIComponent(q)}`;
    const j = await conTiempo(u, 7000);
    return (j || []).map(r => {
      const a = r.address || {}, la = +r.lat, lo = +r.lon;
      return { name: etiqueta(a.road || a.pedestrian || a.footway, a.house_number, r.name && r.name !== a.road ? r.name : ""),
        commune: [a.suburb || a.city_district, a.city || a.town || a.village || a.municipality].filter(Boolean).slice(0, 2).join(", "),
        category: a.house_number ? "Dirección" : "Lugar", exacta: !!a.house_number,
        lat: la, lng: lo, distFromUserKm: +km(lat, lng, la, lo).toFixed(1), fuente: "nominatim" };
    });
  }
  const cacheQ = new Map();
  /** Resultados de dirección para q (promesa). Primero en línea; si no hay red o nada sirve, calles del mapa offline. */
  async function buscar(q, lat, lng) {
    q = (q || "").trim(); if (q.length < 3) return [];
    lat = isFinite(lat) ? lat : -33.45; lng = isFinite(lng) ? lng : -70.66;
    const k = norm(q); if (cacheQ.has(k)) return cacheQ.get(k);
    // abreviaturas chilenas expandidas ayudan a los geocodificadores («av» → «avenida», «pje» → «pasaje»)
    const p = partir(q), qq = [expandir(p.calle), p.numero].filter(Boolean).join(" ") + (p.comuna ? ", " + p.comuna : "");
    let res = [];
    if (navigator.onLine !== false) {
      try { res = await photon(qq, lat, lng); } catch (e) { }
      if (!res.length) try { res = await nominatim(qq, lat, lng); } catch (e) { }
      // con número pedido: arriba las coincidencias exactas de numeración
      if (p.numero) res.sort((a, b) => (b.exacta - a.exacta) || (a.distFromUserKm - b.distFromUserKm));
    }
    if (!res.length) res = await buscarOffline(q, lat, lng);
    const vistosK = new Set();                                   // sin duplicados (mismo nombre a < ~50 m)
    res = res.filter(r => { const k = norm(r.name) + "|" + r.lat.toFixed(3) + "|" + r.lng.toFixed(3); if (vistosK.has(k)) return false; vistosK.add(k); return true; });
    res = res.slice(0, 8);
    if (res.length) cacheQ.set(k, res);
    return res;
  }

  // registro de resultados para el onclick (las filas llevan una clave «dir:N»)
  const vistos = new Map(); let n = 0;
  function registrar(r) { const k = "dir:" + (++n); vistos.set(k, r); if (vistos.size > 200) vistos.delete(vistos.keys().next().value); return k; }

  window.Direcciones = { buscar, calleEn, partir, registrar, porClave: k => vistos.get(k) || null };
})();
