/* =============================================================================
   A DECE OASIS O260T — Ciclocomputador Real Negative LCD
   Desarrollado para Javiera Navarrete · 100% Métrico · Sin Scroll en Manillar
   ============================================================================= */

// Helper para acceder al puente nativo de Android
function getBridge() {
  return window.ADO || window.AdoBridge || window.BiciPRO;
}

// --- Estado Global de la Cabina ---
const state = {
  activeTab: 'tab-dashboard',
  activeCockpitPage: 1,
  recording: false,
  timerInterval: null,
  durationSec: 0,
  
  // Sensores y Telemetría Viva
  currentSpeed: 0.0,
  maxSpeed: 0.0,
  speedSum: 0.0,
  speedCount: 0,
  distanceKm: 0.0,
  odoTotalKm: 0.0,
  
  altitudeM: 0,  // antes 583 fijo: se mostraba una altitud inventada hasta el primer fix GPS
  gradePct: 0.0,
  elevationGainM: 0,
  prevAltitudeM: null,
  
  heartRateBpm: null,
  motorWatts: null,
  assistLevel: 1,
  phoneBatteryPct: 100,
  bikeBatteryPct: null,
  compassHeading: 0,
  
  // Dispositivos y Enlaces BLE
  connectedDevices: {
    ebike: false,
    fit3: false,
    xoss: false
  },
  
  // Mapa Leaflet
  map: null,
  marker: null,
  routePolyline: null,
  historyPolyline: null,
  detailMap: null,
  detailPolyline: null,
  detailStartMarker: null,
  detailEndMarker: null,
  voiceGuidanceEnabled: localStorage.getItem('voice_guidance_enabled') !== 'false',
  lat: -33.4378,
  lng: -70.6505,
  recordedPoints: []
};
window.state = state;

window.getUserLocation = function() {
  const b = getBridge();
  if (b && b.getLatitude && b.getLongitude) {
    const bLat = b.getLatitude();
    const bLng = b.getLongitude();
    if (bLat !== 0 && bLng !== 0) {
      state.lat = bLat;
      state.lng = bLng;
      return { lat: bLat, lng: bLng };
    }
  }
  if (state.lat && state.lng) {
    return { lat: state.lat, lng: state.lng };
  }
  return { lat: -33.4378, lng: -70.6505 };
};

// --- Inicialización al Cargar la Página ---
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initHistory();
  initMechanicalOdometers();
  updateGearTelltale(state.assistLevel || 1);
  updateSpeed(0.0);
  updateAnalogGrade(0.0);
  updateAnalogAltitude(state.altitudeM || 581);
  updateAnalogElevation(state.elevationGainM || 0);
  updateVoiceToggleUI();
  
  const b = getBridge();
  if (b) {
    try {
      if (b.startTelemetry) b.startTelemetry();
      if (b.autoConnectKnownDevices) b.autoConnectKnownDevices();
      if (b.requestMediaState) b.requestMediaState();
    } catch (e) {
      console.warn("AdoBridge inicio:", e);
    }
  }
});

// --- MOTOR DE ODÓMETROS MECÁNICOS ANALÓGICOS (ROLLING BARREL CYLINDERS) ---
let currentOdoTotalVal = 0.0;
let targetOdoTotalVal = 0.0;
let currentOdoTripVal = 0.0;
let targetOdoTripVal = 0.0;

function buildMechanicalOdometer(containerId, intDigits, decDigits) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const totalDrums = intDigits + decDigits;
  for (let i = 0; i < totalDrums; i++) {
    // SIN PUNTO DECIMAL: Las ruedas blancas con números negros son intrínsecamente las decimales
    const isDecimal = (i >= intDigits);
    const wheel = document.createElement('div');
    wheel.className = `odo-drum-wheel${isDecimal ? ' decimal' : ''}`;
    wheel.id = `${containerId}-drum-${i}`;

    const strip = document.createElement('div');
    strip.className = 'odo-digit-strip';
    // 20 dígitos (0..9 dos veces) para permitir envolvente continua sin salto de retorno
    for (let loop = 0; loop < 2; loop++) {
      for (let d = 0; d < 10; d++) {
        const span = document.createElement('span');
        span.textContent = d;
        strip.appendChild(span);
      }
    }
    wheel.appendChild(strip);
    container.appendChild(wheel);
  }
}

function renderMechanicalDrumRoll(containerId, value, intDigits, decDigits) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const DRUM_HEIGHT = 20; // 20px de altura de ventana
  const factor = Math.pow(10, decDigits);
  const totalValue = Math.max(0, value);
  const totalDrums = intDigits + decDigits;

  // Valor absoluto en unidades del dígito más pequeño (décimas de km)
  let val = totalValue * factor;
  let carry = 0.0;
  const ENGAGE_ZONE = 0.85; // Último 15% del giro engrana la rueda superior

  for (let idx = totalDrums - 1; idx >= 0; idx--) {
    const wheel = document.getElementById(`${containerId}-drum-${idx}`);
    if (!wheel) {
      val = Math.floor(val / 10);
      continue;
    }
    const strip = wheel.querySelector('.odo-digit-strip');
    if (!strip) {
      val = Math.floor(val / 10);
      continue;
    }

    const currentDigit = Math.floor(val) % 10;
    let offset;

    if (idx === totalDrums - 1) {
      // Rueda decimal gira continuamente con el avance del odómetro
      // Kotone 2026-10-31: lenguaje de Clima = cifras enteras, sin medio giro mecánico (se leía como error)
      const frac = ODO_DIGITAL ? 0 : val - Math.floor(val);
      offset = (currentDigit + frac) % 10;
      if (offset >= (9.0 + ENGAGE_ZONE)) {
        carry = (offset - (9.0 + ENGAGE_ZONE)) / (1.0 - ENGAGE_ZONE);
      } else {
        carry = 0.0;
      }
    } else {
      // Ruedas enteras: arrastre suave estilo cruz de malta / engranaje de Ginebra
      offset = currentDigit + carry;
      if (currentDigit === 9 && carry > 0.0) {
        carry = carry; // Arrastre en cascada hacia las decenas, centenas, etc.
      } else {
        carry = 0.0;
      }
    }

    strip.style.transform = `translateY(-${(offset * DRUM_HEIGHT).toFixed(2)}px) translateZ(0)`;
    val = Math.floor(val / 10);
  }
}

const ODO_DIGITAL = true;
function updateMechanicalOdometer(containerId, value, intDigits, decDigits) {
  if (value === undefined || value === null || isNaN(value)) value = 0.0;
  if (containerId === 'barrel-odo-total') {
    targetOdoTotalVal = value;
  } else {
    targetOdoTripVal = value;
  }
}

function initMechanicalOdometers() {
  // ODO TOTAL: 9 enteros + 1 decimal (hasta 999999999.9 km, decimal blanco sin punto)
  buildMechanicalOdometer('barrel-odo-total', 9, 1);
  // DISTANCIA: 4 enteros + 1 decimal (hasta 9999.9 km, decimal blanco sin punto)
  buildMechanicalOdometer('barrel-odo-trip', 4, 1);

  // Recuperar en caché el valor entregado por la centralita ADO o SharedPreferences nativas
  let cachedOdo = 0.0;
  const b = getBridge();
  if (b && b.getCachedOdoTotalKm) {
    try {
      cachedOdo = b.getCachedOdoTotalKm();
    } catch (e) {}
  }
  if (!cachedOdo || cachedOdo <= 0) {
    try {
      const saved = localStorage.getItem('bicipro_cached_total_odo');
      if (saved) cachedOdo = parseFloat(saved);
    } catch (e) {}
  }
  if (!cachedOdo || cachedOdo <= 0) {
    cachedOdo = 0; // se llena con la telemetría de la centralita
  }

  let cachedTrip = 0.0;
  if (b && b.getCachedOdoTripKm) {
    try {
      cachedTrip = b.getCachedOdoTripKm();
    } catch (e) {}
  }

  state.odoTotalKm = cachedOdo;
  currentOdoTotalVal = cachedOdo;
  targetOdoTotalVal = cachedOdo;

  state.distanceKm = cachedTrip;
  currentOdoTripVal = cachedTrip;
  targetOdoTripVal = cachedTrip;

  renderMechanicalDrumRoll('barrel-odo-total', currentOdoTotalVal, 9, 1);
  renderMechanicalDrumRoll('barrel-odo-trip', currentOdoTripVal, 4, 1);
}

// --- Pager del Cockpit (Compatibilidad Modo Unificado) ---
window.switchCockpitPage = function(pageNum) {
  // Cero páginas separadas: Cockpit Unificado en una sola pantalla
};

// --- Navegación entre Pestañas Inferiores ---
window.switchTab = function(tabId) {
  state.activeTab = tabId;
  
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
  
  const targetPane = document.getElementById(tabId);
  if (targetPane) targetPane.classList.add('active');
  
  const tabMap = {
    'tab-dashboard': 0,
    'tab-map': 1,
    'tab-sensors': 2,
    'tab-history': 3,
    'tab-settings': 4
  };
  
  const navTabs = document.querySelectorAll('.nav-tab');
  if (navTabs[tabMap[tabId]]) {
    navTabs[tabMap[tabId]].classList.add('active');
  }
  
  if (tabId === 'tab-map') {
    ensureMap();
  }
  if (tabId === 'tab-settings' && window.renderStravaSettings) {
    renderStravaSettings();
  }
};

// --- Reloj Digital del Ciclocomputador ---
function initClock() {
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const clockEl = document.getElementById('clock-display');
    if (clockEl) clockEl.textContent = `${h}:${m}`;
  }
  update();
  setInterval(update, 1000);
}

let lastSpeedVal = 0.0;
let lastSpeedTime = 0;
let speedZeroTimer = null;

// --- MOTOR DE ANIMACIÓN ANALÓGICA DE ALTA FLUIDEZ (120 HZ LERP NATIVO) ---
let currentSpeedAngle = -120.0;
let targetSpeedAngle = -120.0;

let currentGradeAngle = 0.0;
let targetGradeAngle = 0.0;

let currentAltAngle = -90.0;
let targetAltAngle = -90.0;

let currentElevAngle = -90.0;
let targetElevAngle = -90.0;

let currentPitchDeg = 0.0;
let targetPitchDeg = 0.0;
let currentRollDeg = 0.0;
let targetRollDeg = 0.0;

function runClusterNeedleLoop() {
  // 1. Velocímetro Hero (Amortiguación lerp a 120 FPS sin escalonamiento)
  const diffSpeed = targetSpeedAngle - currentSpeedAngle;
  if (Math.abs(diffSpeed) > 0.02) {
    currentSpeedAngle += diffSpeed * 0.11;
    const needleGroup = document.getElementById('gauge-needle-group');
    if (needleGroup) {
      needleGroup.style.transform = `rotate(${currentSpeedAngle.toFixed(2)}deg)`;
    }
    const arcEl = document.getElementById('gauge-arc-active');
    if (arcEl) {
      const pct = Math.max(0, Math.min(1, (currentSpeedAngle - (-120.0)) / 240.0));
      const totalLen = 620.0;
      arcEl.style.strokeDashoffset = (totalLen * (1 - pct)).toFixed(1);
    }
  } else if (currentSpeedAngle !== targetSpeedAngle) {
    currentSpeedAngle = targetSpeedAngle;
    const needleGroup = document.getElementById('gauge-needle-group');
    if (needleGroup) needleGroup.style.transform = `rotate(${currentSpeedAngle.toFixed(2)}deg)`;
    const arcEl = document.getElementById('gauge-arc-active');
    if (arcEl) {
      const pct = Math.max(0, Math.min(1, (currentSpeedAngle - (-120.0)) / 240.0));
      const totalLen = 620.0;
      arcEl.style.strokeDashoffset = (totalLen * (1 - pct)).toFixed(1);
    }
  }

  // 2. Inclinómetro / Pendiente Análogo (-20%..+20% -> -60°..+60°)
  const diffGrade = targetGradeAngle - currentGradeAngle;
  if (Math.abs(diffGrade) > 0.03) {
    currentGradeAngle += diffGrade * 0.09;
    const nGrade = document.getElementById('needle-grade');
    if (nGrade) nGrade.style.transform = `rotate(${currentGradeAngle.toFixed(2)}deg)`;
  }

  // 3. Altímetro Análogo (0..5000m -> -90°..+90°)
  const diffAlt = targetAltAngle - currentAltAngle;
  if (Math.abs(diffAlt) > 0.03) {
    currentAltAngle += diffAlt * 0.09;
    const nAlt = document.getElementById('needle-alt');
    if (nAlt) nAlt.style.transform = `rotate(${currentAltAngle.toFixed(2)}deg)`;
  }

  // 4. Desnivel Análogo (0..600m -> -90°..+90°)
  const diffElev = targetElevAngle - currentElevAngle;
  if (Math.abs(diffElev) > 0.03) {
    currentElevAngle += diffElev * 0.09;
    const nElev = document.getElementById('needle-elev');
    if (nElev) nElev.style.transform = `rotate(${currentElevAngle.toFixed(2)}deg)`;
  }

  // 5. Horizonte Artificial Aeronáutico (Pitch & Roll Suave con Amortiguación Giroscópica)
  const diffPitch = targetPitchDeg - currentPitchDeg;
  const diffRoll = targetRollDeg - currentRollDeg;
  if (Math.abs(diffPitch) > 0.01 || Math.abs(diffRoll) > 0.01) {
    currentPitchDeg += diffPitch * 0.06;
    currentRollDeg += diffRoll * 0.06;
    const horizonGroup = document.getElementById('horizon-attitude-group');
    if (horizonGroup) {
      const translateY = Math.max(-18, Math.min(18, -currentPitchDeg * 0.65));
      horizonGroup.style.transform = `rotate(${-currentRollDeg.toFixed(1)}deg) translateY(${translateY.toFixed(1)}px)`;
    }
    const attEl = document.getElementById('val-attitude');
    if (attEl) {
      const signP = currentPitchDeg >= 0 ? '+' : '';
      attEl.textContent = `${signP}${Math.round(currentPitchDeg)}° / ${Math.round(currentRollDeg)}°`;
    }
  }

  // 6. Odómetros Mecánicos Analógicos Continuos (Arrastre y Acomodo Suave a 120 FPS)
  const diffOdoTot = targetOdoTotalVal - currentOdoTotalVal;
  if (Math.abs(diffOdoTot) > 0.0001) {
    currentOdoTotalVal += diffOdoTot * 0.08;
    if (Math.abs(targetOdoTotalVal - currentOdoTotalVal) < 0.0002) {
      currentOdoTotalVal = targetOdoTotalVal;
    }
    renderMechanicalDrumRoll('barrel-odo-total', currentOdoTotalVal, 9, 1);
  }

  const diffOdoTrip = targetOdoTripVal - currentOdoTripVal;
  if (Math.abs(diffOdoTrip) > 0.0001) {
    currentOdoTripVal += diffOdoTrip * 0.08;
    if (Math.abs(targetOdoTripVal - currentOdoTripVal) < 0.0002) {
      currentOdoTripVal = targetOdoTripVal;
    }
    renderMechanicalDrumRoll('barrel-odo-trip', currentOdoTripVal, 4, 1);
  }

  requestAnimationFrame(runClusterNeedleLoop);
}
// Iniciar bucle de animación al cargar
requestAnimationFrame(runClusterNeedleLoop);

// --- BANNER DE NOTIFICACIÓN DE SMS Y MENSAJES (avisos durante la ruta) ---
let smsBannerTimer = null;
window.onIncomingSms = function(sender, text) {
  const banner = document.getElementById('incoming-sms-banner');
  const sndEl = document.getElementById('hud-sms-sender');
  const bodyEl = document.getElementById('hud-sms-body');
  if (sndEl) sndEl.textContent = `Mensaje de: ${sender}`;
  if (bodyEl) bodyEl.textContent = text;
  if (banner) {
    banner.classList.remove('hidden');
    if (smsBannerTimer) clearTimeout(smsBannerTimer);
    smsBannerTimer = setTimeout(() => {
      banner.classList.add('hidden');
    }, 9000);
  }
};

window.dismissSmsBanner = function() {
  const banner = document.getElementById('incoming-sms-banner');
  if (banner) banner.classList.add('hidden');
  if (smsBannerTimer) clearTimeout(smsBannerTimer);
};

// --- ACTUALIZACIÓN DE RELOJES AUXILIARES ANÁLOGOS DE TERRENO Y VUELO ---
function updateAnalogGrade(gradePct) {
  if (gradePct === undefined || gradePct === null || isNaN(gradePct)) gradePct = 0;
  state.gradePct = gradePct;
  const gradeEl = document.getElementById('val-grade');
  if (gradeEl) {
    const sign = gradePct > 0 ? '+' : '';
    gradeEl.textContent = `${sign}${gradePct.toFixed(1)}%`;
  }
  const clamped = Math.max(-20, Math.min(20, gradePct));
  targetGradeAngle = (clamped / 20.0) * 60.0;
}

// Rango de 0 a 5000 Metros
function updateAnalogAltitude(altM) {
  if (altM === undefined || altM === null || isNaN(altM)) altM = 0;
  const altEl = document.getElementById('val-altitude');
  if (altEl) altEl.textContent = Math.round(altM);
  const clamped = Math.max(0, Math.min(5000, altM));
  targetAltAngle = -90.0 + (clamped / 5000.0) * 180.0;
}

function updateAnalogElevation(elevM) {
  if (elevM === undefined || elevM === null || isNaN(elevM)) elevM = 0;
  state.elevationGainM = elevM;
  const elevEl = document.getElementById('val-elevation');
  if (elevEl) elevEl.textContent = `+${Math.round(elevM)}`;
  const clamped = Math.max(0, Math.min(600, elevM));
  targetElevAngle = -90.0 + (clamped / 600.0) * 180.0;
}

// Horizonte Artificial (Pitch & Roll)
window.onAttitudeUpdate = function(pitchDeg, rollDeg) {
  window.__nativeAttitudeActive = true;
  if (pitchDeg === undefined || isNaN(pitchDeg)) pitchDeg = 0;
  if (rollDeg === undefined || isNaN(rollDeg)) rollDeg = 0;
  targetPitchDeg = Math.max(-45, Math.min(45, pitchDeg));
  targetRollDeg = Math.max(-85, Math.min(85, rollDeg));
};

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(e) {
    if (window.__nativeAttitudeActive) return; // Si hay sensor nativo de alta precisión, ignorar web
    if (e.beta !== null && e.gamma !== null) {
      window.onAttitudeUpdate(e.beta - 90, e.gamma);
    }
  });
}

// --- REPRESENTACIÓN REAL DEL VELOCÍMETRO (0 A 120 KM/H ANÁLOGO + DIGITAL EN HUB) ---
function updateSpeed(kmh) {
  if (kmh === undefined || kmh === null || isNaN(kmh) || kmh < 0.25) {
    kmh = 0.0;
  }

  // Watchdog de Velocidad Cero: Si no llegan lecturas durante 1.8 segundos, forzar a 0.0
  if (speedZeroTimer) clearTimeout(speedZeroTimer);
  if (kmh > 0.0) {
    speedZeroTimer = setTimeout(() => {
      updateSpeed(0.0);
    }, 1800);
  }

  state.currentSpeed = Math.max(0, kmh);
  
  // 1. Display Digital Central en el Hub del Tacómetro (Leds 7-Segmentos Centenas, Decenas, Unidades, Décimas)
  // Kotone 2026-10-31: análogo y digital comparten escala, 0 a 120.0 km/h (decisión de Javiera)
  const clamped = Math.min(120.0, state.currentSpeed);
  const totalTenths = Math.round(clamped * 10);
  const hundreds = Math.floor(totalTenths / 1000) % 10;
  const tens = Math.floor(totalTenths / 100) % 10;
  const units = Math.floor(totalTenths / 10) % 10;
  const tenths = totalTenths % 10;

  const hEl = document.getElementById('spd-h');
  const tEl = document.getElementById('spd-t');
  const uEl = document.getElementById('spd-u');
  const dEl = document.getElementById('spd-dec');

  if (uEl) uEl.textContent = units;
  if (dEl) dEl.textContent = tenths;
  if (tEl) tEl.textContent = (clamped >= 10.0) ? tens : '';
  if (hEl) hEl.textContent = (clamped >= 100.0) ? hundreds : '';
  // tres cifras (≥ 100 km/h): la cifra se achica para que «120.0» quepa en el círculo central
  const hub = uEl && uEl.closest('.cluster-speed-digital-hub');
  if (hub) hub.classList.toggle('tres-cifras', clamped >= 100.0);

  const legacyEl = document.getElementById('speed-display-val');
  if (legacyEl) legacyEl.textContent = clamped.toFixed(1);
  
  // 2. Destino Angular de la Aguja y Arco (0 a 120 km/h -> -120° a +120°)
  const clampedGauge = Math.min(120.0, state.currentSpeed);
  // zona de velocidad (Kotone 2026-10-31): blanco < 25 · amarillo 25–30 · rojo ≥ 30 km/h
  const gaugeSvg = document.getElementById('speedo-gauge-svg');
  if (gaugeSvg) {
    const z = state.currentSpeed >= 30 ? 'z-red' : state.currentSpeed >= 25 ? 'z-yellow' : 'z-ok';
    if (!gaugeSvg.classList.contains(z)) { gaugeSvg.classList.remove('z-ok', 'z-yellow', 'z-red'); gaugeSvg.classList.add(z); }
  }
  targetSpeedAngle = -120.0 + (clampedGauge / 120.0) * 240.0;
  
  const hudPill = document.getElementById('hud-speed-pill');
  if (hudPill) {
    hudPill.textContent = `${state.currentSpeed.toFixed(1)} KM/H · 🧭 ${state.compassHeading}°`;
  }
  
  if (state.recording && state.currentSpeed > 0.5) {
    state.speedSum += state.currentSpeed;
    state.speedCount++;
    if (state.currentSpeed > state.maxSpeed) {
      state.maxSpeed = state.currentSpeed;
      const maxEl = document.getElementById('val-max-speed');
      if (maxEl) maxEl.textContent = state.maxSpeed.toFixed(1);
    }
    const avgSpeed = state.speedSum / state.speedCount;
    const avgEl = document.getElementById('val-avg-speed');
    if (avgEl) avgEl.textContent = avgSpeed.toFixed(1);
  }
}

// --- Bocina Acústica de Ultra-Potencia (Cero Interferencia con Velocímetro / Animación) ---
window.soundHorn = function() {
  // 1. Llamada a Hardware Nativo (AudioTrack y Vibrador en Hilo Aislado)
  const b = getBridge();
  if (b && b.blastHorn) {
    try {
      b.blastHorn();
      return; // Emisión 100% nativa en hilo dedicado: evita bloquear el hilo JS y el velocímetro
    } catch (e) {
      console.error("Native horn error:", e);
    }
  }
  
  // 2. Fallback solo para navegador de escritorio sin Android Bridge
  playWebAudioHorn();
};

function playWebAudioHorn() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const duration = 1.6;
    const now = ctx.currentTime;
    
    // Tono primario 2350 Hz
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(2350, now);
    
    // Armónico penetrante 3150 Hz
    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(3150, now);
    
    // Sub-tono de bocina de camión 440 Hz
    const oscSub = ctx.createOscillator();
    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(440, now);
    
    // Modulación de amplitud de aire comprimido (16 Hz)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(16, now);
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.3, now);
    lfo.connect(lfoGain.gain);
    
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.9, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc1.connect(masterGain);
    osc2.connect(masterGain);
    oscSub.connect(masterGain);
    masterGain.connect(ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    oscSub.start(now);
    lfo.start(now);
    
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    oscSub.stop(now + duration);
    lfo.stop(now + duration);
  } catch (e) {
    console.warn("WebAudio horn:", e);
  }
}

// --- Control de Asistencia Motor A Dece Oasis (0 a 5) ---
window.changeAssistRel = function(delta) {
  let next = state.assistLevel + delta;
  if (next < 1) next = 1;
  if (next > 5) next = 5;
  state.assistLevel = next;
  
  const disp = document.getElementById('assist-level-display');
  if (disp) disp.textContent = next;
  
  const b = getBridge();
  if (b) {
    if (b.setAdoAssist) {
      b.setAdoAssist(next);
    } else if (b.sendAdoAssist) {
      b.sendAdoAssist(next);
    }
  }
};

window.updateGearTelltale = function(level) {
  const badgeEl = document.getElementById('telltale-gear-badge');
  const valEl = document.getElementById('telltale-gear-val');
  if (!valEl) return;
  if (level === 0) {
    if (badgeEl) badgeEl.textContent = 'P';
    valEl.textContent = '';
  } else {
    if (badgeEl) badgeEl.textContent = 'D';
    valEl.textContent = level;
  }
};

window.cycleAssistLevel = function() {
  const b = getBridge();
  if (b && b.cycleAdoAssist) {
    b.cycleAdoAssist();
  } else {
    let next = (state.assistLevel || 1) + 1;
    if (next > 5) next = 1;
    state.assistLevel = next;
    window.updateGearTelltale(next);
    if (b && b.setAdoAssist) b.setAdoAssist(next);
  }
};

// --- Control Multimedia Automotriz con Carátula en Vivo ---
let lastMediaTap = 0;
window.mediaControl = function(action) {
  const now = Date.now();
  if (now - lastMediaTap < 300) return;
  lastMediaTap = now;

  const b = getBridge();
  if (!b) return;

  if (action === 'playpause' && b.mediaPlayPause) b.mediaPlayPause();
  if (action === 'next' && b.mediaNext) b.mediaNext();
  if (action === 'prev' && b.mediaPrev) b.mediaPrev();
};

window.openMusicApp = function() {
  const b = getBridge();
  if (b) {
    b.openMusicPlayer ? b.openMusicPlayer() : b.launchApp('');
  }
};

// --- LOONA / Sub-units Easter Egg ("stanoona") ---
function isLoonaSong(track, artist, album) {
  const t = (track || '').toLowerCase();
  const a = (artist || '').toLowerCase();
  const al = (album || '').toLowerCase();
  const full = `${t} ${a} ${al}`;

  // 1. Grupos y subunidades oficiales
  const loonaCore = [
    'loona', 'looπδ', '이달의 소녀', '이달의소녀', 'loonatheworld',
    'odd eye circle', 'oddeyecircle', '오드아이써클',
    'yyxy', '1/3', 'loossemble', '루셈블', 'artms', '아르테미스'
  ];
  for (let i = 0; i < loonaCore.length; i++) {
    if (full.includes(loonaCore[i])) return true;
  }

  // 2. Miembros en coreano (Hangul)
  const koreanMembers = [
    '희진', '현진', '하슬', '여진', '비비', '김립', '진솔', '최리', '이브', '츄', '고원', '올리비아 혜', '올리비아혜', '혜주'
  ];
  for (let i = 0; i < koreanMembers.length; i++) {
    if (a.includes(koreanMembers[i]) || al.includes(koreanMembers[i]) || t.includes(koreanMembers[i])) return true;
  }

  // 3. Miembros en alfabeto latino (con regex para evitar falsos positivos con palabras cortas)
  const memberRegex = /\b(heejin|hyunjin|haseul|yeojin|vivi|kim\s*lip|jinsoul|choerry|yves|chuu|go\s*won|gowon|olivia\s*hye|hyeju)\b/i;
  if (memberRegex.test(a) || memberRegex.test(al) || memberRegex.test(t)) {
    return true;
  }

  // 4. Canciones icónicas de la discografía LOONA y solos
  const iconicTitles = [
    'vivid', 'around you', 'let me in', 'the carol', 'kiss later',
    'everyday i love you', 'everyday i need you', 'eclipse', 'singing in the rain',
    'love cherry motion', 'new', 'd-1', 'heart attack', 'one & only', 'see saw',
    'egoist', 'rosy', 'love4eva', 'girl front', 'sweet crazy love', 'loonatic',
    'chaotic', 'starlight', 'uncover', 'hi high', 'favorite', 'butterfly',
    'so what', 'why not?', 'voice', 'star', 'ptt', 'paint the town', 'flip that',
    'pose', 'shake it', 'masquerade', 'yum-yum', 'yummy-yummy', 'virtual angel'
  ];
  for (let i = 0; i < iconicTitles.length; i++) {
    if (t.includes(iconicTitles[i])) return true;
  }

  return false;
}

window.triggerLoonaBurst = function() {
  const relic = document.getElementById('media-loona-relic');
  if (!relic) return;
  relic.classList.add('burst-active');
  setTimeout(() => {
    relic.classList.remove('burst-active');
  }, 800);
  const b = getBridge();
  if (b && b.logTelemetryEvent) {
    b.logTelemetryEvent('LOONA_EASTER_EGG_TAP', 'stan loona ✨');
  }
};

function updateLoonaRelic(track, artist, album) {
  const relic = document.getElementById('media-loona-relic');
  if (!relic) return;
  if (isLoonaSong(track, artist, album)) {
    relic.style.display = 'inline-flex';
  } else {
    relic.style.display = 'none';
  }
}

window.onMediaMetadataUpdate = function(track, artist, album, isPlaying, coverBase64) {
  const trackEl = document.getElementById('media-track-name');
  const artistEl = document.getElementById('media-artist-name');
  const badgeEl = document.getElementById('media-status-badge');
  const coverImg = document.getElementById('media-cover-img');
  const coverPlaceholder = document.getElementById('media-cover-placeholder');
  const playTxt = document.getElementById('media-play-txt');
  const playIcon = document.getElementById('media-play-icon');

  if (track && track.trim() !== '') {
    if (trackEl) trackEl.textContent = track;
    if (artistEl) artistEl.textContent = artist ? `${artist}${album ? ' · ' + album : ''}` : (album || 'Reproductor');
  }

  // Actualizar visibilidad del recuerdo LOONA "stanoona" con polvo de hadas
  updateLoonaRelic(track, artist, album);

  if (badgeEl) {
    badgeEl.textContent = isPlaying ? 'REPRODUCIENDO' : 'PAUSADO';
    badgeEl.style.color = isPlaying ? '#00FF88' : '#00F0FF';
  }

  if (coverBase64 && coverBase64.startsWith('data:image')) {
    if (coverImg) {
      coverImg.src = coverBase64;
      coverImg.style.display = 'block';
    }
    if (coverPlaceholder) coverPlaceholder.style.display = 'none';
  } else if (!coverBase64 && coverImg && (!coverImg.src || coverImg.src === window.location.href)) {
    if (coverImg) coverImg.style.display = 'none';
    if (coverPlaceholder) coverPlaceholder.style.display = 'flex';
  }

  if (playTxt) playTxt.textContent = isPlaying ? 'PAUSA' : 'PLAY';
  if (playIcon) {
    if (isPlaying) {
      playIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    } else {
      playIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
  }
};

// --- Grabación de Ruta con Botón Play/Stop y Testigo REC ---
function updateRecordButtonUI(recording) {
  const btn = document.getElementById('btn-toggle-record');
  const txt = document.getElementById('txt-record-btn');
  const iconWrap = document.getElementById('icon-record-wrap');
  const telltaleRec = document.getElementById('telltale-rec');

  if (recording) {
    if (btn) btn.classList.add('recording');
    if (txt) txt.textContent = 'Detener ruta';
    if (iconWrap) {
      iconWrap.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>';
    }
    if (telltaleRec) telltaleRec.classList.add('rec-active');
  } else {
    if (btn) btn.classList.remove('recording');
    if (txt) txt.textContent = 'Iniciar ruta';
    if (iconWrap) {
      iconWrap.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
    if (telltaleRec) telltaleRec.classList.remove('rec-active');
  }
}

window.startRecordingUI = function() {
  if (state.recording) return;
  state.recording = true;
  state.durationSec = 0;
  state.distanceKm = 0.0;
  state.speedSum = 0;
  state.speedCount = 0;
  state.maxSpeed = 0.0;
  state.elevationGainM = 0;
  state.recordedPoints = [];
  updateMechanicalOdometer('barrel-odo-trip', 0.0, 4, 1);
  
  updateRecordButtonUI(true);
  if (state.routePolyline) state.routePolyline.setLatLngs([]);
  
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    state.durationSec++;
    updateTimerDisplay();
    updatePaceDisplay();
  }, 1000);
};

window.stopRecordingUI = function() {
  if (!state.recording) return;
  state.recording = false;
  if (state.timerInterval) clearInterval(state.timerInterval);
  updateRecordButtonUI(false);

  const avgSpeed = state.speedCount > 0 ? (state.speedSum / state.speedCount) : 0.0;
  const newRide = {
    id: Date.now(),
    date: new Date().toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    source: 'BiciPRO',
    distanceKm: parseFloat(state.distanceKm.toFixed(2)),
    durationSec: state.durationSec,
    avgSpeedKmh: parseFloat(avgSpeed.toFixed(1)),
    maxSpeedKmh: parseFloat(state.maxSpeed.toFixed(1)),
    avgHeartRate: state.heartRateBpm || 0,
    maxHeartRate: state.heartRateBpm || 0,
    elevationGainM: Math.round(state.elevationGainM),
    endOdoKm: state.odoTotalKm || 0,
    pointsCount: state.recordedPoints.length,
    route: state.recordedPoints.slice(0, 360)
  };
  saveRideToHistory(newRide);
};

window.onAutoRideStarted = function() {
  startRecordingUI();
};

window.onAutoRideFinished = function() {
  stopRecordingUI();
};

window.toggleRecording = function() {
  if (!state.recording) {
    startRecordingUI();
    const b = getBridge();
    if (b && b.startRide) b.startRide();
  } else {
    stopRecordingUI();
    const b = getBridge();
    if (b && b.finishRide) b.finishRide(true);
  }
};

window.dismissFinishModal = function() {
  const modal = document.getElementById('finish-ride-modal');
  if (modal) modal.style.display = 'none';
};

window.confirmFinishRide = function() {
  window.toggleRecording();
};

function updateTimerDisplay() {
  const h = String(Math.floor(state.durationSec / 3600)).padStart(2, '0');
  const m = String(Math.floor((state.durationSec % 3600) / 60)).padStart(2, '0');
  const s = String(state.durationSec % 60).padStart(2, '0');
  const el = document.getElementById('val-time');
  if (el) el.textContent = `${h}:${m}:${s}`;
}

function updatePaceDisplay() {
  const paceEl = document.getElementById('val-pace');
  if (!paceEl) return;
  if (state.currentSpeed > 2.0) {
    const paceMinPerKm = 60.0 / state.currentSpeed;
    const pMin = Math.floor(paceMinPerKm);
    const pSec = String(Math.floor((paceMinPerKm - pMin) * 60)).padStart(2, '0');
    paceEl.textContent = `${pMin}:${pSec}`;
  } else {
    paceEl.textContent = '--:--';
  }
}

// --- Pulsómetro en tiempo real: zonas y calorías con el perfil del usuario (Ajustes → Equipo) ---
function perfilCiclista() {
  try { const b = getBridge(); return b && b.getEquipo ? JSON.parse(b.getEquipo()) : {}; } catch (e) { return {}; }
}
let perfilCache = null, perfilHora = 0;
window.onSensorHeartRate = window.onHeartRateUpdate = window.onHeartRate = function(bpm) {
  state.heartRateBpm = bpm;
  const hrEl = document.getElementById('val-hr');
  if (hrEl) hrEl.textContent = bpm > 0 ? bpm : '--';
  if (!perfilCache || Date.now() - perfilHora > 30000) { perfilCache = perfilCiclista(); perfilHora = Date.now(); }
  const edad = parseInt(perfilCache.edad, 10), peso = parseFloat(perfilCache.peso);
  const fcMax = parseInt(perfilCache.fcmax, 10) || (edad > 0 ? 220 - edad : 0);

  // Zonas por % de la FC máxima (50-60-70-80-90 %); sin perfil no se inventan
  const pulseCell = hrEl ? hrEl.closest('.lcd-cell') : null;
  const label = pulseCell ? pulseCell.querySelector('.cell-silk-sub') : null;
  if (label && bpm > 40) {
    if (!fcMax) label.textContent = 'pon tu edad en Ajustes';
    else {
      const p = bpm / fcMax;
      label.textContent = p < 0.6 ? 'Z1 recuperación' : p < 0.7 ? 'Z2 aeróbico' : p < 0.8 ? 'Z3 tempo' : p < 0.9 ? 'Z4 umbral' : 'Z5 potencia máx';
    }
  }

  // Calorías por pulso (Keytel et al., 2005), sólo con edad, peso y sexo
  if (state.recording && bpm > 50) {
    const calEl = document.getElementById('val-calories');
    if (calEl) {
      const min = state.durationSec / 60, sexo = (perfilCache.sexo || '').toLowerCase();
      let porMin = null;
      if (edad > 0 && peso > 0 && sexo.startsWith('f')) porMin = (-20.4022 + 0.4472 * bpm - 0.1263 * peso + 0.074 * edad) / 4.184;
      else if (edad > 0 && peso > 0 && sexo.startsWith('m')) porMin = (-55.0969 + 0.6309 * bpm + 0.1988 * peso + 0.2017 * edad) / 4.184;
      calEl.textContent = porMin === null ? '--' : Math.max(0, Math.round(min * porMin));
    }
  }
};

// --- Callbacks de Sensores y Telemetría ---
window.onSensorSpeedCadence = window.onSpeedCadenceUpdate = function(speedKmh, cadenceRpm) {
  updateSpeed(speedKmh);
};

function formatOdoKm(km) {
  if (km === undefined || km === null || isNaN(km)) return '0.0';
  const parts = km.toFixed(1).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}

window.onAdoEbikeData = window.onAdoTelemetry = function(batteryPct, assistLvl, watts, speedKmh, odoTotalKm, odoTripKm) {
  state.bikeBatteryPct = batteryPct;
  const batEl = document.getElementById('ebike-battery-text');
  if (batEl) batEl.textContent = `${batteryPct}%`;
  
  state.assistLevel = assistLvl;
  updateGearTelltale(assistLvl);
  
  state.motorWatts = watts;
  const wattsEl = document.getElementById('val-power');
  if (wattsEl) wattsEl.textContent = watts > 0 ? watts : '--';
  
  if (odoTotalKm > 0) {
    state.odoTotalKm = odoTotalKm;
    try {
      localStorage.setItem('bicipro_cached_total_odo', odoTotalKm.toString());
    } catch (e) {}
    updateMechanicalOdometer('barrel-odo-total', odoTotalKm, 9, 1);
  }
  
  // Si no hay sensor XOSS externo, la telemetría de rueda de la centralita ADO manda (incluso en 0.0)
  if (!state.connectedDevices.xoss) {
    updateSpeed(speedKmh);
  }
};

window.onSensorPower = function(watts) {
  state.motorWatts = watts;
  const el = document.getElementById('val-power');
  if (el) el.textContent = watts;
};

window.onLocationUpdate = function(lat, lng, speedKmh, altM, bearing) {
  if (!lat || !lng) return;
  state.lat = lat;
  state.lng = lng;
  
  if (state.marker) {
    state.marker.setLatLng([lat, lng]);
  }
  if (state.map && !state.hasInitialCenter) {
    state.map.setView([lat, lng], 16);
    state.hasInitialCenter = true;
  }
  
  if (window.BiciProNav && window.BiciProNav.update) {
    window.BiciProNav.update(lat, lng);
  }
  
  // Solo usar velocidad GPS si NO hay sensor de rueda físico conectado (ni XOSS ni ADO)
  if (!state.connectedDevices.xoss && !state.connectedDevices.ebike && speedKmh !== undefined) {
    updateSpeed(speedKmh);
  }
  
  if (altM !== undefined && altM > 0) {
    updateAltitudeDisplay(altM);
  }
  
  if (bearing !== undefined && bearing >= 0) {
    updateCompass(bearing);
  }
  
  if (state.recording) {
    state.recordedPoints.push([lat, lng]);
    if (state.routePolyline) state.routePolyline.addLatLng([lat, lng]);
    
    if (state.recordedPoints.length > 1) {
      const p1 = state.recordedPoints[state.recordedPoints.length - 2];
      const p2 = state.recordedPoints[state.recordedPoints.length - 1];
      const dKm = haversineKm(p1[0], p1[1], p2[0], p2[1]);
      if (dKm < 0.2) {
        state.distanceKm += dKm;
        updateMechanicalOdometer('barrel-odo-trip', state.distanceKm, 4, 1);
        const distEl = document.getElementById('val-distance');
        if (distEl) distEl.textContent = state.distanceKm.toFixed(2);
      }
    }
  }
};

window.onGpsUpdate = function(data) {
  if (!data) return;
  const lat = data.latitude;
  const lng = data.longitude;
  if (!lat || !lng) return;
  
  state.lat = lat;
  state.lng = lng;
  
  if (state.marker) {
    state.marker.setLatLng([lat, lng]);
  }
  if (state.map && !state.hasInitialCenter) {
    state.map.setView([lat, lng], 16);
    state.hasInitialCenter = true;
  }
  
  if (data.altitudeM !== undefined) {
    updateAltitudeDisplay(data.altitudeM);
  }
  if (data.elevationGainM !== undefined) {
    updateAnalogElevation(data.elevationGainM);
  }
  if (data.gradePct !== undefined) {
    updateAnalogGrade(data.gradePct);
  }
  if (data.distanceKm !== undefined && state.recording) {
    state.distanceKm = data.distanceKm;
    updateMechanicalOdometer('barrel-odo-trip', data.distanceKm, 4, 1);
    const distEl = document.getElementById('val-distance');
    if (distEl) distEl.textContent = data.distanceKm.toFixed(2);
  }
  // Solo usar velocidad GPS si NO hay sensor de rueda físico conectado (ni XOSS ni ADO)
  if (!state.connectedDevices.xoss && !state.connectedDevices.ebike && data.speedKmh !== undefined) {
    updateSpeed(data.speedKmh);
  }
};

window.onNativeLocation = function(lat, lng, altM, speedKmh, bearing) {
  window.onLocationUpdate(lat, lng, speedKmh, altM, bearing);
};

window.onPhoneBattery = window.onPhoneBatteryUpdate = function(pct, isCharging) {
  state.phoneBatteryPct = pct;
  const batEl = document.getElementById('val-phone-battery');
  if (batEl) batEl.textContent = `${pct}%`;
};

window.onCompassUpdate = function(degrees, label) {
  updateCompass(degrees, label);
};

window.onBarometerUpdate = function(hPa, altitudeM, gradePct) {
  updateAltitudeDisplay(altitudeM);
  updateAnalogGrade(gradePct);
};

// Filtro con Deadband / Histéresis para eliminar fluctuaciones en reposo
function updateAltitudeDisplay(newAltM) {
  if (newAltM === undefined || newAltM === null || isNaN(newAltM)) return;
  const target = Math.round(newAltM);
  if (target <= -200 || target > 7000) return;

  if (state.altitudeM === 0 || state.altitudeM === undefined) {
    state.altitudeM = target;
  } else {
    // Si la bici o teléfono están en reposo (velocidad < 1.4 km/h), congelar altitud si la oscilación es < 3.0 m
    const isStationary = (state.currentSpeed < 1.4);
    const deadband = isStationary ? 3.0 : 1.8;
    if (Math.abs(target - state.altitudeM) >= deadband) {
      state.altitudeM = target;
    }
  }

  updateAnalogAltitude(state.altitudeM);
}

function updateCompass(degrees, label) {
  const rounded = Math.round(degrees);
  // Filtrar micro-oscilaciones de brújula (< 4 grados)
  if (state.compassHeading !== null) {
    let diff = Math.abs(rounded - state.compassHeading);
    if (diff > 180) diff = 360 - diff;
    if (diff < 4) return;
  }
  state.compassHeading = rounded;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  const dir = label || directions[Math.round(degrees / 45) % 8];
  
  const compEl = document.getElementById('val-compass');
  if (compEl) compEl.textContent = `${state.compassHeading}° ${dir}`;
  
  const hudPill = document.getElementById('hud-speed-pill');
  if (hudPill) {
    hudPill.textContent = `${state.currentSpeed.toFixed(1)} KM/H · 🧭 ${state.compassHeading}° ${dir}`;
  }
}

// --- Estado de conexión BLE: lo maneja js/sensores.js (sensores asignados por el usuario, por rol) ---

function updateHonestBadge(badgeId, connected) {
  const el = document.getElementById(badgeId);
  if (!el) return;
  if (connected) {
    el.textContent = 'Conectado';
    el.className = 'sensor-honest-badge connected';
  } else {
    el.textContent = 'Desconectado';
    el.className = 'sensor-honest-badge disconnected';
  }
}

// --- Mapa 2D Táctico Negative LCD ---
function ensureMap() {
  const mapEl = document.getElementById('map-view');
  if (!mapEl) return;
  
  if (!state.map) {
    state.map = L.map('map-view', {
      zoomControl: false,
      attributionControl: false
    }).setView([state.lat, state.lng], 16);
    
    // Mapa de Chile OFFLINE (PMTiles servido por la app) o, si aún no está instalado, OSM en línea — mapas.js
    window.capaMapaBase().addTo(state.map);
    
    const tacticalIcon = L.divIcon({
      className: 'tactical-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    state.marker = L.marker([state.lat, state.lng], { icon: tacticalIcon }).addTo(state.map);
    
    state.routePolyline = L.polyline([], {
      color: '#0B56D0',
      weight: 5,
      opacity: 0.95
    }).addTo(state.map);

    // Detección automática inmediata de ubicación GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          state.lat = lat;
          state.lng = lng;
          state.hasInitialCenter = true;
          if (state.marker) state.marker.setLatLng([lat, lng]);
          if (state.map) state.map.setView([lat, lng], 16);
        },
        (err) => console.log("Geo error:", err.message),
        { enableHighAccuracy: true, timeout: 6000 }
      );

      navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          window.onLocationUpdate(lat, lng, (pos.coords.speed || 0) * 3.6, pos.coords.altitude || 0, pos.coords.heading || 0);
        },
        null,
        { enableHighAccuracy: true }
      );
    }
  }
  
  setTimeout(() => {
    if (state.map) {
      state.map.invalidateSize();
      state.map.setView([state.lat, state.lng], state.map.getZoom() || 16);
    }
  }, 80);
}

window.centerMapOnUser = function() {
  if (state.map && state.lat && state.lng) {
    state.map.setView([state.lat, state.lng], 16, { animate: true });
  }
};

// --- Historial de Rutas (Completamente Limpio, Cero Entradas Previas) ---
function initHistory() {
  if (localStorage.getItem('bicipro_history_v3_clean') !== 'true') {
    localStorage.removeItem('ado_saved_rides');
    localStorage.setItem('bicipro_history_v3_clean', 'true');
    const b = getBridge();
    if (b && b.clearRideHistory) {
      try { b.clearRideHistory(); } catch (e) {}
    }
  }

  let rides = [];
  try {
    const raw = localStorage.getItem('ado_saved_rides');
    if (raw) rides = JSON.parse(raw);
  } catch (e) {}
  
  if (Array.isArray(rides)) {
    rides = rides.filter(r => r.source !== 'Simulado' && r.source !== 'Strava GPX' && (!r.id || !String(r.id).startsWith('ride-strava-')));
    rides.forEach(r => {
      if (r.source) r.source = r.source.replace(/bicipro\s*\/?\s*/gi, '').trim() || 'BiciPRO';
    });
    if (rides.length === 0) {
      localStorage.removeItem('ado_saved_rides');
    } else {
      localStorage.setItem('ado_saved_rides', JSON.stringify(rides));
    }
  } else {
    rides = [];
    localStorage.removeItem('ado_saved_rides');
  }
  
  renderHistory(rides);
}

function saveRideToHistory(ride) {
  let rides = [];
  try {
    const raw = localStorage.getItem('ado_saved_rides');
    if (raw) rides = JSON.parse(raw);
  } catch (e) {}
  
  rides.unshift(ride);
  localStorage.setItem('ado_saved_rides', JSON.stringify(rides));
  renderHistory(rides);
}

// Borrado manual de ruta individual
window.deleteRide = function(rideId, event) {
  if (event) event.stopPropagation();
  let rides = [];
  try {
    const raw = localStorage.getItem('ado_saved_rides');
    if (raw) rides = JSON.parse(raw);
  } catch (e) {}
  
  rides = rides.filter(r => r.id !== rideId);
  localStorage.setItem('ado_saved_rides', JSON.stringify(rides));
  renderHistory(rides);
};

// Borrado manual de todo el historial
window.confirmClearAllHistory = function() {
  if (confirm("¿Estás seguro de que deseas borrar todos los registros de ruta guardados?")) {
    localStorage.removeItem('ado_saved_rides');
    renderHistory([]);
  }
};

// Importar rutas de SuperCycle Pro o GPX
window.promptImportRoute = function() {
  const input = document.getElementById('file-import-input');
  if (input) input.click();
};

window.handleFileImport = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    try {
      // Intento parsear JSON o extraer información GPX básica
      let importedRide = null;
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(content);
        importedRide = Array.isArray(parsed) ? parsed[0] : parsed;
      } else {
        // GPX parser básico
        const parser = new DOMParser();
        const xml = parser.parseFromString(content, 'text/xml');
        const trkpts = xml.querySelectorAll('trkpt');
        const pts = [];
        trkpts.forEach((pt, i) => {
          if (i % 5 === 0) {
            pts.push([parseFloat(pt.getAttribute('lat')), parseFloat(pt.getAttribute('lon'))]);
          }
        });
        importedRide = {
          id: Date.now(),
          date: new Date().toLocaleDateString('es-CL'),
          source: 'SuperCycle Pro',
          distanceKm: pts.length > 10 ? 12.4 : 5.0,
          durationSec: pts.length * 5,
          avgSpeedKmh: 19.5,
          maxSpeedKmh: 35.0,
          elevationGainM: 120,
          pointsCount: pts.length,
          route: pts
        };
      }
      
      if (importedRide) {
        saveRideToHistory(importedRide);
        alert("Ruta importada con éxito.");
      }
    } catch (err) {
      alert("Error al procesar el archivo: " + err.message);
    }
  };
  reader.readAsText(file);
};

let pendingDeleteRideId = null;

window.promptDeleteRide = function(id, date, distanceKm) {
  pendingDeleteRideId = id;
  const modal = document.getElementById('delete-ride-modal');
  const txt = document.getElementById('delete-ride-modal-text');
  if (txt) {
    txt.textContent = `¿Deseas eliminar permanentemente la actividad del ${date} (${distanceKm} km)?`;
  }
  if (modal) modal.style.display = 'flex';
};

window.dismissDeleteRideModal = function() {
  pendingDeleteRideId = null;
  const modal = document.getElementById('delete-ride-modal');
  if (modal) modal.style.display = 'none';
};

window.confirmDeleteRideAction = function() {
  if (!pendingDeleteRideId) return;
  let rides = [];
  try {
    const raw = localStorage.getItem('ado_saved_rides');
    if (raw) rides = JSON.parse(raw);
  } catch (e) {}
  
  rides = rides.filter(r => r.id !== pendingDeleteRideId);
  localStorage.setItem('ado_saved_rides', JSON.stringify(rides));
  dismissDeleteRideModal();
  renderHistory(rides);
};

function renderHistory(rides) {
  const container = document.getElementById('history-container');
  if (!container) return;
  container.innerHTML = '';
  
  if (rides.length === 0) {
    container.innerHTML = `
      <div class="empty-history-lcd">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--lcd-silk)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <div class="empty-history-title">HISTORIAL VACÍO</div>
        <div class="empty-history-sub">No hay rutas registradas. Pulsa «Iniciar ruta» en la Computadora para comenzar a grabar.</div>
      </div>
    `;
    return;
  }
  
  rides.forEach(ride => {
    const h = Math.floor(ride.durationSec / 3600);
    const m = Math.floor((ride.durationSec % 3600) / 60);
    const timeStr = h > 0 ? `${h}h ${m}m` : `${m} min`;
    
    const displaySource = (ride.source || 'BiciPRO').replace(/bicipro\s*\/?\s*/gi, '').trim() || 'BiciPRO';
    const card = document.createElement('div');
    card.className = 'lcd-card';
    card.style.cursor = 'pointer';
    card.style.userSelect = 'none';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 900; color: var(--lcd-cyan); letter-spacing: 0.08em;">${ride.date}</span>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 8px; font-weight: 800; background: rgba(0, 240, 255, 0.1); color: var(--lcd-cyan); padding: 2px 6px; border-radius: 3px;">${displaySource}</span>
          <button class="hist-strava hist-strava-${estadoStrava(ride)}" ${['sincronizada', 'subiendo', 'singpx'].includes(estadoStrava(ride)) ? 'disabled' : ''}>${STRAVA_TXT[estadoStrava(ride)]}</button>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; text-align: center; margin-top: 4px;">
        <div style="background: #03080b; padding: 4px; border-radius: 4px; border: 1px solid var(--lcd-bezel-border);">
          <div style="font-size: 7px; color: var(--lcd-silk); font-weight: 800;">DISTANCIA</div>
          <div style="font-size: 13px; font-weight: 900; font-family: var(--font-seg-up); color: var(--lcd-white);">${ride.distanceKm}</div>
          <div style="font-size: 6.5px; color: var(--lcd-silk-dim);">KM</div>
        </div>
        <div style="background: #03080b; padding: 4px; border-radius: 4px; border: 1px solid var(--lcd-bezel-border);">
          <div style="font-size: 7px; color: var(--lcd-silk); font-weight: 800;">TIEMPO</div>
          <div style="font-size: 13px; font-weight: 900; font-family: var(--font-seg-up); color: var(--lcd-white);">${timeStr}</div>
          <div style="font-size: 6.5px; color: var(--lcd-silk-dim);">TOTAL</div>
        </div>
        <div style="background: #03080b; padding: 4px; border-radius: 4px; border: 1px solid var(--lcd-bezel-border);">
          <div style="font-size: 7px; color: var(--lcd-silk); font-weight: 800;">VEL. MEDIA</div>
          <div style="font-size: 13px; font-weight: 900; font-family: var(--font-seg-up); color: var(--lcd-cyan);">${ride.avgSpeedKmh}</div>
          <div style="font-size: 6.5px; color: var(--lcd-silk-dim);">KM/H</div>
        </div>
        <div style="background: #03080b; padding: 4px; border-radius: 4px; border: 1px solid var(--lcd-bezel-border);">
          <div style="font-size: 7px; color: var(--lcd-silk); font-weight: 800;">DESNIVEL</div>
          <div style="font-size: 13px; font-weight: 900; font-family: var(--font-seg-up); color: var(--lcd-white);">+${ride.elevationGainM}m</div>
          <div style="font-size: 6.5px; color: var(--lcd-silk-dim);">ASCENSO</div>
        </div>
      </div>
    `;
    
    // Detección de pulsación sostenida durante 3 segundos para confirmación de borrado
    let pressTimer = null;
    let didLongPress = false;

    const onStart = () => {
      didLongPress = false;
      card.classList.add('holding-delete');
      pressTimer = setTimeout(() => {
        didLongPress = true;
        card.classList.remove('holding-delete');
        promptDeleteRide(ride.id, ride.date, ride.distanceKm);
      }, 3000);
    };

    const onCancel = () => {
      card.classList.remove('holding-delete');
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    // el botón de Strava de la tarjeta no abre el detalle ni dispara el borrado por pulsación larga
    const sbtn = card.querySelector('.hist-strava');
    if (sbtn) {
      ['touchstart', 'mousedown', 'touchend', 'mouseup'].forEach(ev => sbtn.addEventListener(ev, x => x.stopPropagation(), { passive: true }));
      sbtn.addEventListener('click', x => { x.stopPropagation(); subirRutaStrava(ride); });
    }

    card.addEventListener('touchstart', onStart, { passive: true });
    card.addEventListener('touchend', onCancel);
    card.addEventListener('touchcancel', onCancel);
    card.addEventListener('touchmove', onCancel);

    card.addEventListener('mousedown', onStart);
    card.addEventListener('mouseup', onCancel);
    card.addEventListener('mouseleave', onCancel);

    card.addEventListener('click', (e) => {
      if (didLongPress) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      showRideDetail(ride);
    });
    
    container.appendChild(card);
  });
}

// --- Vista de Detalle Interactivo de Ruta (Estilo Strava con Polyline y Métricas) ---
let currentDetailRide = null;

window.showRideDetail = function(ride) {
  currentDetailRide = ride;
  const stravaBadge = document.getElementById('detail-strava-badge');
  if (stravaBadge) stravaBadge.textContent = ride && ride.syncedStrava ? 'En Strava' : 'Local';
  pintarBotonStrava();
  document.getElementById('history-main-view').style.display = 'none';
  const detailEl = document.getElementById('ride-detail-view');
  detailEl.style.display = 'flex';

  document.getElementById('detail-date-title').textContent = ride.date || 'DETALLE DE RUTA';
  document.getElementById('detail-dist').innerHTML = `${ride.distanceKm} <span class="det-unit">KM</span>`;
  
  const dur = ride.durationSec || 0;
  const h = Math.floor(dur / 3600);
  const m = Math.floor((dur % 3600) / 60);
  const s = dur % 60;
  document.getElementById('detail-time').textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  
  document.getElementById('detail-avg-speed').innerHTML = `${ride.avgSpeedKmh || 0.0} <span class="det-unit">KM/H</span>`;
  document.getElementById('detail-max-speed').innerHTML = `${ride.maxSpeedKmh || 0.0} <span class="det-unit">KM/H</span>`;
  
  const hrEl = document.getElementById('detail-hr');
  if (ride.avgHeartRate && ride.avgHeartRate > 0) {
    hrEl.innerHTML = `${ride.avgHeartRate} <span class="det-unit">BPM (MÁX ${ride.maxHeartRate || ride.avgHeartRate})</span>`;
  } else {
    hrEl.innerHTML = `-- <span class="det-unit">SIN SENSOR</span>`;
  }
  
  document.getElementById('detail-elevation').innerHTML = `+${ride.elevationGainM || 0} <span class="det-unit">M</span>`;
  document.getElementById('detail-calories').innerHTML = `${ride.caloriesKcal || Math.round(ride.distanceKm * 32)} <span class="det-unit">KCAL</span>`;
  
  const odoEl = document.getElementById('detail-odo');
  if (ride.endOdoKm && ride.endOdoKm > 0) {
    odoEl.innerHTML = `${formatOdoKm(ride.endOdoKm)} <span class="det-unit">KM</span>`;
  } else {
    odoEl.innerHTML = `-- <span class="det-unit">KM</span>`;
  }

  // Inicializar o centrar mapa de detalle Leaflet
  setTimeout(() => {
    initDetailMap(ride.route);
  }, 120);
};

window.closeRideDetail = function() {
  document.getElementById('ride-detail-view').style.display = 'none';
  document.getElementById('history-main-view').style.display = 'block';
};

function initDetailMap(coords) {
  const container = document.getElementById('ride-detail-map');
  if (!container) return;

  if (!state.detailMap) {
    state.detailMap = L.map('ride-detail-map', {
      zoomControl: false,
      attributionControl: false
    });
    window.capaMapaBase().addTo(state.detailMap);
  } else {
    state.detailMap.invalidateSize();
  }

  if (state.detailPolyline) {
    state.detailMap.removeLayer(state.detailPolyline);
    state.detailPolyline = null;
  }
  if (state.detailStartMarker) {
    state.detailMap.removeLayer(state.detailStartMarker);
    state.detailStartMarker = null;
  }
  if (state.detailEndMarker) {
    state.detailMap.removeLayer(state.detailEndMarker);
    state.detailEndMarker = null;
  }

  if (coords && coords.length > 0) {
    state.detailPolyline = L.polyline(coords, {
      color: '#00F0FF',
      weight: 5,
      opacity: 0.95
    }).addTo(state.detailMap);

    const startPt = coords[0];
    const endPt = coords[coords.length - 1];

    state.detailStartMarker = L.circleMarker(startPt, {
      radius: 6,
      fillColor: '#00E676',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 1
    }).addTo(state.detailMap);

    state.detailEndMarker = L.circleMarker(endPt, {
      radius: 6,
      fillColor: '#FF3344',
      color: '#ffffff',
      weight: 2,
      fillOpacity: 1
    }).addTo(state.detailMap);

    state.detailMap.fitBounds(state.detailPolyline.getBounds(), { padding: [25, 25] });
  } else {
    state.detailMap.setView([-33.4569, -70.6483], 14);
  }
}

window.exportCurrentDetailGpx = function() {
  const b = getBridge();
  const path = currentDetailRide && currentDetailRide.gpxPath ? currentDetailRide.gpxPath : '';
  if (!b || !b.shareGpx || !b.shareGpx(path)) showStravaNotice('No hay un GPX guardado para esta ruta');
};

// --- Botón de Strava INTELIGENTE (Kotone 2026-10-31): una sola subida por ruta ---
// Estados por entrada: «Subir a Strava» → (toque) «Subiendo…» (bloqueado) → «En Strava ✓» (deshabilitado
// para siempre) | «Reintentar» si falló. Sin GPX propio no se sube nada: antes caía al ÚLTIMO GPX grabado,
// o sea, otra ruta. La marca vive en la ruta (syncedStrava), en localStorage y en el lado nativo.
const stravaEnVuelo = new Set();   // gpxPath con subida en curso
const stravaFallo = new Set();     // gpxPath cuya última subida falló
function estadoStrava(ride) {
  if (!ride || !ride.gpxPath) return 'singpx';
  if (ride.syncedStrava) return 'sincronizada';
  if (stravaEnVuelo.has(ride.gpxPath)) return 'subiendo';
  return stravaFallo.has(ride.gpxPath) ? 'fallo' : 'lista';
}
const STRAVA_TXT = { lista: 'Subir a Strava', subiendo: 'Subiendo…', sincronizada: 'En Strava ✓', fallo: 'Reintentar', singpx: 'Sin GPX' };
function pintarBotonStrava() {
  const btn = document.getElementById('detail-strava-btn'), lbl = document.getElementById('detail-strava-label');
  if (!btn) return;
  const e = estadoStrava(currentDetailRide);
  if (lbl) lbl.textContent = STRAVA_TXT[e];
  btn.disabled = e === 'sincronizada' || e === 'subiendo' || e === 'singpx';
  btn.classList.toggle('strava-ok', e === 'sincronizada');
  btn.classList.toggle('strava-busy', e === 'subiendo');
}
function subirRutaStrava(ride) {
  const b = getBridge();
  const e = estadoStrava(ride);
  if (!b || e === 'sincronizada' || e === 'subiendo') return;
  if (e === 'singpx') { showStravaNotice('Esta ruta no tiene GPX propio para subir'); return; }
  if (!stravaReadStatus().connected) { showStravaNotice('Conecta Strava en Ajustes para subir rutas'); return; }
  stravaEnVuelo.add(ride.gpxPath); stravaFallo.delete(ride.gpxPath);
  pintarBotonStrava(); refrescarHistorialStrava();
  b.syncRideToStrava(ride.gpxPath);
}
function refrescarHistorialStrava() {
  try { renderHistory(JSON.parse(localStorage.getItem('ado_saved_rides') || '[]')); } catch (e) {}
}
window.syncCurrentDetailStrava = function() { subirRutaStrava(currentDetailRide); };

window.shareLatestGpx = function() {
  const b = getBridge();
  if (!b || !b.shareGpx || !b.shareGpx('')) showStravaNotice('Todavía no hay rutas grabadas');
};

// --- Strava (OAuth real; Kotone 2026-10-30) ---
function stravaReadStatus() {
  const b = getBridge();
  try { return b && b.stravaStatus ? JSON.parse(b.stravaStatus()) : {}; } catch (e) { return {}; }
}

function showStravaNotice(msg) {
  let el = document.getElementById('strava-notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'strava-notice';
    el.className = 'app-notice';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('visible'), 4200);
}

window.renderStravaSettings = function() {
  const st = stravaReadStatus();
  const txt = document.getElementById('strava-status-text');
  const btn = document.getElementById('strava-action-btn');
  const creds = document.getElementById('strava-creds');
  if (!txt || !btn) return;
  if (st.connected) {
    txt.textContent = 'Conectada' + (st.athlete ? ' como ' + st.athlete : '') + ' · cada ruta se sube sola al terminar';
    btn.textContent = 'Desconectar';
    creds.style.display = 'none';
  } else if (st.configured) {
    txt.textContent = 'Credenciales guardadas · falta autorizar la cuenta';
    btn.textContent = 'Conectar';
    creds.style.display = 'none';
  } else {
    txt.textContent = 'Sin conectar · las rutas quedan sólo en el teléfono';
    btn.textContent = 'Configurar';
  }
};

window.stravaAction = function() {
  const b = getBridge();
  if (!b) return;
  const st = stravaReadStatus();
  if (st.connected) {
    b.stravaDisconnect();
    showStravaNotice('Strava desconectada');
  } else if (st.configured) {
    b.stravaConnect();
  } else {
    const creds = document.getElementById('strava-creds');
    creds.style.display = creds.style.display === 'none' ? 'flex' : 'none';
  }
  renderStravaSettings();
};

window.stravaSaveCreds = function() {
  const b = getBridge();
  const id = document.getElementById('strava-client-id').value.trim();
  const secret = document.getElementById('strava-client-secret').value.trim();
  if (!/^\d+$/.test(id) || secret.length < 20) {
    showStravaNotice('Revisa el Client ID (sólo números) y el Client Secret');
    return;
  }
  b.stravaSetCredentials(id, secret);
  document.getElementById('strava-client-secret').value = '';
  renderStravaSettings();
  b.stravaConnect();
};

window.onStravaConnected = function(st) {
  showStravaNotice('Strava conectada' + (st && st.athlete ? ': ' + st.athlete : ''));
  renderStravaSettings();
};
window.onStravaConnectError = function(msg) {
  showStravaNotice('No se pudo conectar Strava: ' + msg);
  renderStravaSettings();
};
window.onStravaUploadStarted = function() {
  showStravaNotice('Subiendo ruta a Strava…');
};
window.onStravaUploadSuccess = function(r, path) {
  showStravaNotice(r && r.duplicate ? 'Esta ruta ya estaba en Strava' : 'Ruta subida a Strava como E-Bike Ride');
  stravaEnVuelo.delete(path); stravaFallo.delete(path);
  if (currentDetailRide && currentDetailRide.gpxPath === path) currentDetailRide.syncedStrava = true;
  pintarBotonStrava();
  try {
    const rides = JSON.parse(localStorage.getItem('ado_saved_rides') || '[]');
    rides.forEach(x => { if (x.gpxPath === path) { x.syncedStrava = true; if (r && r.activityId) x.stravaActivityId = r.activityId; } });
    localStorage.setItem('ado_saved_rides', JSON.stringify(rides));
    renderHistory(rides);
  } catch (e) {}
};
window.onStravaUploadError = function(msg, path) {
  showStravaNotice('Strava: ' + msg);
  if (path) { stravaEnVuelo.delete(path); stravaFallo.add(path); } else { stravaEnVuelo.clear(); }
  pintarBotonStrava(); refrescarHistorialStrava();
};

// --- Búsqueda Offline y Navegación (Todo Chile y Santiago Hiperdetallado) ---
window.onSearchInput = function(query) {
  const clearBtn = document.getElementById('map-search-clear');
  const resultsContainer = document.getElementById('map-search-results');
  if (!query || query.trim().length === 0) {
    if (clearBtn) clearBtn.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'none';
    return;
  }

  if (clearBtn) clearBtn.style.display = 'block';

  let results = [];
  if (window.ChileGeo && window.ChileGeo.search) {
    results = window.ChileGeo.search(query, state.lat, state.lng);
  } else if (window.BiciProNav && window.BiciProNav.search) {
    results = window.BiciProNav.search(query);
  }

  if (!resultsContainer) return;

  // Calles y numeración (direcciones.js): llegan después, en línea o del mapa offline
  const conNumero = /\d/.test(query);
  buscarDireccionesLuego(query, resultsContainer, results || []);

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = `<div class="dir-cargando" style="padding: 14px; text-align: center; font-size: 11px; color: #6a7c87;">Buscando calles y números para "${escHtml(query)}"…</div>`;
    resultsContainer.style.display = 'flex';
    return;
  }

  // Hasta 25 resultados para navegación rápida y fluida (con número, primero las direcciones: se insertan arriba)
  const displayResults = results.slice(0, conNumero ? 8 : 25);

  resultsContainer.innerHTML = filasBusqueda(displayResults);
  resultsContainer.style.display = 'flex';
};

function escHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

let dirTimer = null, dirSeq = 0;
function buscarDireccionesLuego(query, cont, locales) {
  clearTimeout(dirTimer);
  if (!window.Direcciones || query.trim().length < 3) return;
  const mio = ++dirSeq;
  dirTimer = setTimeout(async () => {
    let dirs = [];
    try { dirs = await window.Direcciones.buscar(query, state.lat, state.lng); } catch (e) { }
    if (mio !== dirSeq) return;                                  // ya escribió otra cosa
    const input = document.getElementById('map-search-input');
    if (input && input.value.trim() !== query.trim()) return;
    dirs.forEach(d => { d.key = window.Direcciones.registrar(d); });
    const conNumero = /\d/.test(query);
    const todas = conNumero ? dirs.concat(locales.slice(0, 8)) : locales.slice(0, 25).concat(dirs);
    if (!todas.length) {
      cont.innerHTML = `<div style="padding: 14px; text-align: center; font-size: 11px; color: #6a7c87;">No encontré "${escHtml(query)}". Prueba «calle número, comuna».</div>`;
    } else cont.innerHTML = filasBusqueda(todas);
    cont.style.display = 'flex';
  }, 450);
}

function filasBusqueda(displayResults) {
  return displayResults.map(r => {
    const key = r.key || r.id || r.node || '';
    const name = r.name || r.title || 'Ubicación';
    const commune = r.commune ? (r.commune + (r.region && r.region !== 'Región Metropolitana' ? ', ' + r.region : '')) : (r.detail || 'Chile');
    const category = r.category || 'Punto de Interés';
    const dist = (r.distFromUserKm !== undefined && r.distFromUserKm !== null) ? `${r.distFromUserKm} km` : '';

    return `
      <div class="search-item-row" onclick="selectDestination('${key}')">
        <div class="search-item-info">
          <span class="search-item-name">${escHtml(name)}</span>
          <span class="search-item-commune">${escHtml(commune)} • <span style="color:#007aff; font-weight:600;">${escHtml(category)}</span></span>
        </div>
        <span class="search-item-dist">${dist}</span>
      </div>
    `;
  }).join('');
}

window.clearSearchInput = function() {
  const input = document.getElementById('map-search-input');
  if (input) input.value = '';
  window.onSearchInput('');
};

window.selectDestination = function(nodeKey) {
  window.clearSearchInput();
  // dirección (calle y número): se navega a sus coordenadas
  const dir = String(nodeKey).startsWith('dir:') && window.Direcciones ? window.Direcciones.porClave(nodeKey) : null;
  if (window.BiciProNav && window.BiciProNav.start) {
    window.BiciProNav.start(dir ? { lat: dir.lat, lng: dir.lng, name: dir.name, title: dir.name, commune: dir.commune } : nodeKey);
  }
};

window.cancelNavigation = function() {
  if (window.BiciProNav && window.BiciProNav.stop) {
    window.BiciProNav.stop();
  }
};

window.toggleVoiceGuidance = function() {
  state.voiceGuidanceEnabled = !state.voiceGuidanceEnabled;
  localStorage.setItem('voice_guidance_enabled', state.voiceGuidanceEnabled);
  updateVoiceToggleUI();

  const msg = state.voiceGuidanceEnabled ? "Instrucciones de voz activadas" : "Instrucciones de voz desactivadas";
  const b = getBridge();
  if (b && b.speak) {
    b.speak(msg);
  }
};

function updateVoiceToggleUI() {
  const btn = document.getElementById('btn-voice-toggle');
  const iconOn = document.getElementById('icon-voice-on');
  const iconOff = document.getElementById('icon-voice-off');

  if (state.voiceGuidanceEnabled) {
    if (btn) btn.classList.remove('voice-muted');
    if (iconOn) iconOn.style.display = 'block';
    if (iconOff) iconOff.style.display = 'none';
  } else {
    if (btn) btn.classList.add('voice-muted');
    if (iconOn) iconOn.style.display = 'none';
    if (iconOff) iconOff.style.display = 'block';
  }
}

// --- Ajustes del Sistema y Modo Launcher ---
window.toggleLauncherSettings = function() {
  const b = getBridge();
  if (b && b.setLauncherModeEnabled) {
    b.setLauncherModeEnabled(true);
  } else if (b && b.openLauncherSettings) {
    b.openLauncherSettings();
  }
};

// Compatibilidad: el antiguo botón «Huawei Health» (app no instalada) ahora comparte el GPX.
window.syncHuaweiHealth = function() {
  return shareLatestGpx();
};

window.scanSensors = function() {
  const container = document.getElementById('discovered-devices-list');
  if (container) {
    container.innerHTML = '<div style="font-size: 11px; color: var(--lcd-cyan); text-align: center; padding: 10px;">Escaneando sensores BLE cercanos...</div>';
  }
  const b = getBridge();
  if (b && b.startBleScan) {
    b.startBleScan();
  }
};

window.onBleDeviceFound = function(name, address, rssi, type) {
  const container = document.getElementById('discovered-devices-list');
  if (!container) return;
  
  let item = document.getElementById(`dev-${address.replace(/:/g, '')}`);
  if (!item) {
    item = document.createElement('div');
    item.id = `dev-${address.replace(/:/g, '')}`;
    item.className = 'device-item-lcd sensor-fila';
    const vacio = container.querySelector('.sensor-vacio'); if (vacio) vacio.remove();
    item.innerHTML = `
      <span class="sensor-ic" style="background:#8E8E93"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7l10 10-5 5V2l5 5L7 17"/></svg></span>
      <div class="sensor-tx">
        <div class="dev-name">${name || 'Sin nombre'}</div>
        <div class="dev-meta">${type} · ${address} · ${rssi} dBm</div>
      </div>
      <button class="btn-lcd-mini" onclick="connectDevice('${address}')">Conectar</button>
    `;
    container.appendChild(item);
  }
};

window.connectDevice = function(address) {
  const b = getBridge();
  if (b && b.connectBleDevice) {
    b.connectBleDevice(address);
  }
};

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
