// BiciPRO · sensores del usuario, lector de códigos de la centralita y «Equipo» (desarrollado por Javiera Navarrete).
// Nada viene de fábrica: el usuario busca por Bluetooth y asigna cada dispositivo a un rol. Se carga después de app.js
// y reemplaza sus funciones de sensores.
(function () {
  "use strict";
  const ROLES = {
    centralita: { txt: "Centralita / display", color: "#0A84FF", estado: "ebike" },
    pulso: { txt: "Pulsómetro", color: "#FF375F", estado: "fit3" },
    velocidad: { txt: "Velocidad / cadencia", color: "#30B0C7", estado: "xoss" },
    potencia: { txt: "Potenciómetro", color: "#FF9F0A", estado: "potencia" },
  };
  const TIPO_A_ROL = { ebike: "centralita", heartrate: "pulso", speed: "velocidad", power: "potencia" };
  const br = () => (typeof getBridge === "function" ? getBridge() : window.AdoBridge);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const conectados = {};

  function asignados() {
    try { const b = br(); return b && b.getSensores ? JSON.parse(b.getSensores()) : []; } catch (e) { return []; }
  }

  function renderAsignados() {
    const box = document.getElementById("paired-devices-list");
    if (!box) return;
    const lista = asignados();
    if (!lista.length) {
      box.innerHTML = '<div class="sensor-vacio">Aún no tienes sensores asignados. Toca «Buscar BLE» y asigna los tuyos: centralita, pulsómetro, velocidad/cadencia o potencia.</div>';
      return;
    }
    box.innerHTML = lista.map((s) => {
      const r = ROLES[s.rol] || { txt: s.rol, color: "#8E8E93" };
      const on = !!conectados[(s.mac || "").toUpperCase()];
      return `<div class="device-item-lcd sensor-fila">
        <span class="sensor-ic" style="background:${r.color}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="5"/></svg></span>
        <div class="sensor-tx"><div class="dev-name">${esc(s.nombre || "Sin nombre")}</div>
          <div class="dev-meta">${esc(r.txt)} · ${esc(s.mac)}</div></div>
        <span class="sensor-honest-badge ${on ? "connected" : "disconnected"}">${on ? "Conectado" : "Desconectado"}</span>
        <button class="btn-lcd-mini" onclick="quitarSensorUI('${esc(s.mac)}')">Quitar</button></div>`;
    }).join("");
  }

  window.quitarSensorUI = function (mac) {
    const b = br();
    if (b && b.quitarSensor) b.quitarSensor(mac);
    renderAsignados(); renderEquipo();
  };

  window.asignarSensorUI = function (mac, nombre, sel) {
    const rol = document.getElementById(sel).value;
    const b = br();
    if (b && b.asignarSensor) b.asignarSensor(mac, nombre, rol);
    renderAsignados(); renderEquipo();
  };

  window.onBleDeviceFound = function (name, address, rssi, type) {
    const box = document.getElementById("discovered-devices-list");
    if (!box) return;
    const id = "dev-" + address.replace(/:/g, "");
    if (document.getElementById(id)) return;
    const vacio = box.querySelector(".sensor-vacio"); if (vacio) vacio.remove();
    const sug = TIPO_A_ROL[type] || "pulso";
    const sel = "rol-" + id;
    const opts = Object.keys(ROLES).map((k) => `<option value="${k}"${k === sug ? " selected" : ""}>${ROLES[k].txt}</option>`).join("");
    const el = document.createElement("div");
    el.id = id; el.className = "device-item-lcd sensor-fila sensor-descubierto";
    el.innerHTML = `<div class="sensor-tx"><div class="dev-name">${esc(name || "Sin nombre")}</div>
        <div class="dev-meta">${esc(address)} · ${rssi} dBm</div></div>
      <select id="${sel}" class="sensor-rol">${opts}</select>
      <button class="btn-lcd-mini" data-mac="${esc(address)}" data-nombre="${esc(name || "")}" data-sel="${sel}"
        onclick="asignarSensorUI(this.dataset.mac, this.dataset.nombre, this.dataset.sel)">Asignar</button>`;
    box.appendChild(el);
  };

  window.onBleConnectionState = function (address, connected) {
    const mac = (address || "").toUpperCase();
    conectados[mac] = connected;
    const s = asignados().find((x) => (x.mac || "").toUpperCase() === mac);
    if (s && ROLES[s.rol] && window.state && state.connectedDevices) state.connectedDevices[ROLES[s.rol].estado] = connected;
    renderAsignados();
  };

  // ---- lector de códigos: tramas de centralitas que no hablan el protocolo ADO
  const tramas = [];
  window.onCentralitaTrama = function (hex) {
    tramas.unshift(new Date().toLocaleTimeString("es-CL") + "  " + hex.replace(/(..)/g, "$1 ").trim());
    tramas.length = Math.min(tramas.length, 40);
    const el = document.getElementById("lector-codigos");
    if (el) el.textContent = tramas.join("\n");
  };

  // ---- pulsómetro: intervalos RR y batería
  window.onPulsoDetalle = function (rr, bateria) {
    const el = document.getElementById("pulso-detalle");
    if (!el) return;
    const partes = [];
    if (rr && rr.length) partes.push("RR " + rr.join(" · ") + " ms");
    if (bateria >= 0) partes.push("batería " + bateria + " %");
    if (partes.length) el.textContent = partes.join(" — ");
  };

  // ---- Equipo: detectado + editable
  function equipo() {
    try { const b = br(); return b && b.getEquipo ? JSON.parse(b.getEquipo()) : {}; } catch (e) { return {}; }
  }
  function renderEquipo() {
    const box = document.getElementById("equipo-grid");
    if (!box) return;
    const e = equipo();
    const campo = (k, etiqueta, valor, ph) => `<label class="settings-meta-item"><span class="meta-label">${etiqueta}</span>
      <input class="equipo-input" data-k="${k}" value="${esc(valor || "")}" placeholder="${esc(ph)}"></label>`;
    const sens = [e.centralita && "Centralita: " + e.centralita, e.pulso && "Pulso: " + e.pulso,
                  e.velocidad && "Velocidad: " + e.velocidad, e.potencia && "Potencia: " + e.potencia].filter(Boolean).join(" · ");
    box.innerHTML = campo("bicicleta", "Bicicleta", e.bicicleta || e.centralita, "Marca, modelo y aro")
      + campo("telefono", "Teléfono", e.telefono || e.telefono_detectado, e.telefono_detectado || "Teléfono")
      + campo("edad", "Edad", e.edad, "Años (para zonas de pulso)")
      + campo("peso", "Peso (kg)", e.peso, "Para calorías")
      + campo("sexo", "Sexo (F/M)", e.sexo, "Para la fórmula de calorías")
      + campo("fcmax", "FC máxima", e.fcmax, "Opcional: si no, 220 − edad")
      + `<div class="settings-meta-item"><span class="meta-label">Sensores</span><span class="meta-val">${esc(sens || "Ninguno asignado todavía")}</span></div>`;
    box.querySelectorAll(".equipo-input").forEach((i) => i.addEventListener("change", guardarEquipo));
  }
  function guardarEquipo() {
    const e = equipo(), out = {};
    ["bicicleta", "telefono", "edad", "peso", "sexo", "fcmax"].forEach((k) => { out[k] = e[k] || ""; });
    document.querySelectorAll(".equipo-input").forEach((i) => { out[i.dataset.k] = i.value.trim(); });
    const b = br();
    if (b && b.setEquipo) b.setEquipo(JSON.stringify(out));
  }

  document.addEventListener("DOMContentLoaded", () => { renderAsignados(); renderEquipo(); });
  if (document.readyState !== "loading") { renderAsignados(); renderEquipo(); }
})();
