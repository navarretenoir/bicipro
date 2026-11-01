#!/usr/bin/env bash
# Descarga de insumos del mapa offline de BiciPRO (Kotone 2026-10-31). Idempotente.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)"; cd "$D"
[ -x bin/pmtiles ] || { curl -sL https://github.com/protomaps/go-pmtiles/releases/download/v1.31.2/go-pmtiles_1.31.2_Linux_x86_64.tar.gz | tar xz -C bin pmtiles; }
[ -f brouter.zip ] || curl -sL -o brouter.zip https://github.com/abrensch/brouter/releases/download/v1.7.10/brouter-1.7.10.zip
for lon in W75 W70; do for lat in S20 S25 S30 S35 S40 S45 S50 S55 S60; do
  f=segments/${lon}_${lat}.rd5; [ -s "$f" ] && continue
  curl -sfL -o "$f" "https://brouter.de/brouter/segments4/${lon}_${lat}.rd5" || rm -f "$f"
done; done
echo listo
