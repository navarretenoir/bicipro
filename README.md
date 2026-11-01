# BiciPRO

Ciclocomputador para Android con **mapas y navegación sin conexión para Chile**, con detalle especial de **Santiago**. Se conecta por Bluetooth a
**centralitas de bicicletas eléctricas** (lee sus tramas y códigos), **pulsómetros**, sensores de **velocidad/cadencia** y de **potencia**, controla
**cualquier reproductor** de música del teléfono, graba rutas (GPX/Strava) y puede usarse como pantalla de inicio en cualquier teléfono (modo launcher).

**Desarrollada por Javiera Navarrete** · Licencia [GPL-3.0-or-later](LICENSE) · Android 5.0 hasta la 17, en teléfonos y tabletas.

## Mapas de Chile
La primera vez, la app ofrece **descargar los mapas y el ruteo de Chile** (~1,2 GB, mejor con Wi‑Fi), con detalle de Santiago: se bajan desde la
*release* `mapas-20261031` de este repositorio, se reanudan si se cortan y se verifican con SHA-256. Después todo funciona sin conexión. Datos © colaboradores de
OpenStreetMap (ODbL), compilados por Protomaps; ruteo de brouter.de. Para regenerarlos tú: `mapas/instalar-mapa-chile.sh`.

## Sensores
En la pestaña *Sensores* busca por Bluetooth y asigna cada dispositivo a su rol (centralita, pulsómetro, velocidad/cadencia, potencia). Nada viene preasignado.

---

## English
**BiciPRO** is an Android cycling computer with **offline maps and navigation for Chile**, especially detailed for **Santiago**. It connects over Bluetooth to
**e-bike controllers** (reads their frames and codes), **heart-rate monitors**, **speed/cadence** and **power** sensors, controls **any music player** on the
phone, records rides (GPX/Strava) and can serve as a home screen on any phone (launcher mode). Android 5.0 up to 17, phones and tablets. On first run the app offers to download the Chile maps and routing data (~1.2 GB, Wi‑Fi recommended); they resume if interrupted and are
SHA-256 verified. Map data © OpenStreetMap contributors (ODbL), built by Protomaps. **Developed by Javiera Navarrete**, GPL-3.0-or-later.
