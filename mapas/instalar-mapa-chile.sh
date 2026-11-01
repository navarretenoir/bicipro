#!/usr/bin/env bash
# BiciPRO · instala el MAPA DE CHILE 100 % OFFLINE en el teléfono (Kotone 2026-10-31).
# Se corre en tu computador con el teléfono conectado por USB (depuración USB):
#   mapas/instalar-mapa-chile.sh
# 1) Recorta Chile continental (zoom 0–15 = detalle de calles) del mapa base mundial de Protomaps
#    (OpenStreetMap, licencia ODbL), sólo bajando los trozos de Chile por peticiones de rango.
# 2) Lo copia al teléfono conectado por USB (Android/data/cl.kotone.bicipro/files/mapas/chile.pmtiles).
# 3) Copia también los segmentos de ruteo BRouter (ya están puestos; esto sólo actualiza).
# No usa sudo. Reanudar: volver a correrlo (si chile.pmtiles ya existe, se salta la descarga).
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"; cd "$D"
BUILD="${BUILD:-20261031}"                       # versión del mapa base (https://maps.protomaps.com/builds/)
BBOX="-76.0,-56.1,-66.3,-17.4"                   # Chile continental, de Arica al Cabo de Hornos
[ -x bin/pmtiles ] || ./descargar.sh
if [ ! -s chile.pmtiles ]; then
  echo "==> recortando Chile (z0–15) desde el build $BUILD …"
  # reintentos: el DNS a veces se demora y pmtiles aborta al primer «i/o timeout»
  for intento in 1 2 3 4 5; do
    if bin/pmtiles extract "https://build.protomaps.com/$BUILD.pmtiles" chile.pmtiles.parcial --bbox="$BBOX" --maxzoom=15 --download-threads=8; then
      mv chile.pmtiles.parcial chile.pmtiles; break
    fi
    echo "   intento $intento falló; reintento en 15 s…"; rm -f chile.pmtiles.parcial; sleep 15
  done
  [ -s chile.pmtiles ] || { echo "✘ no se pudo descargar tras 5 intentos (revisa la conexión)"; exit 1; }
fi
ls -lh chile.pmtiles
bin/pmtiles verify chile.pmtiles
echo "==> copiando al teléfono …"
adb get-state >/dev/null
adb shell mkdir -p /sdcard/Android/data/cl.kotone.bicipro/files/mapas /sdcard/Android/data/cl.kotone.bicipro/files/segments
adb push chile.pmtiles /sdcard/Android/data/cl.kotone.bicipro/files/mapas/chile.pmtiles
adb push segments/. /sdcard/Android/data/cl.kotone.bicipro/files/segments/
adb shell am force-stop cl.kotone.bicipro
echo "✔ listo: abre BiciPRO → Mapa (abajo a la derecha dirá «offline»)."
