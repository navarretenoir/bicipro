// BiciPRO · descarga de los mapas de Chile en el primer uso (desarrollado por Javiera Navarrete).
(function () {
  "use strict";
  var R = window.Ruteo; if (!R || !R.descarga) return;
  var tarjeta, timer;
  function st() { try { return JSON.parse(R.estado()); } catch (e) { return {}; } }
  function dl() { try { return JSON.parse(R.descarga()); } catch (e) { return {}; } }
  function mb(b) { return (b / 1048576).toFixed(0) + " MB"; }
  function dibujar() {
    var d = dl(), e = st();
    if (e.mapa > 0 && e.segmentos > 0 && !d.activa) { if (tarjeta) { tarjeta.remove(); tarjeta = null; } return; }
    if (!tarjeta) {
      tarjeta = document.createElement("div");
      tarjeta.style.cssText = "position:fixed;left:12px;right:12px;bottom:84px;z-index:9999;background:#fff;color:#111;border-radius:14px;padding:14px 16px;box-shadow:0 6px 24px rgba(0,0,0,.35);font:14px/1.4 sans-serif";
      document.body.appendChild(tarjeta);
    }
    var pct = d.total ? Math.min(100, Math.round(d.hechos * 100 / d.total)) : 0;
    tarjeta.innerHTML = "<b>Mapas de Chile (sin conexión)</b><br>" + (d.activa
      ? "<div style='margin:8px 0;height:8px;background:#ddd;border-radius:4px;overflow:hidden'><div style='height:8px;width:" + pct + "%;background:#1a9d5b'></div></div>" + (d.mensaje || "") + " · " + mb(d.hechos) + " de " + mb(d.total)
        + "<br><button id='dl-no' style='margin-top:8px'>Cancelar</button>"
      : "Descarga los mapas y el ruteo de Chile (" + mb(d.total || 1259325234) + ", mejor con Wi‑Fi) para navegar sin conexión, con detalle de Santiago. Se reanuda si se corta." + (d.mensaje ? "<br><i>" + d.mensaje + "</i>" : "")
        + "<br><button id='dl-si' style='margin-top:8px;padding:6px 12px'>Descargar mapas</button> <button id='dl-luego' style='margin-top:8px'>Más tarde</button>");
    var si = document.getElementById("dl-si"), no = document.getElementById("dl-no"), lu = document.getElementById("dl-luego");
    if (si) si.onclick = function () { R.descargarMapas(); sondear(); };
    if (no) no.onclick = function () { R.cancelarDescarga(); };
    if (lu) lu.onclick = function () { tarjeta.remove(); tarjeta = null; clearInterval(timer); };
  }
  function sondear() { clearInterval(timer); timer = setInterval(dibujar, 700); dibujar(); }
  window.onMapasInstalados = function () { setTimeout(function () { location.reload(); }, 600); };
  document.addEventListener("DOMContentLoaded", function () { setTimeout(function () { var e = st(); if (!(e.mapa > 0)) sondear(); }, 2500); });
})();
