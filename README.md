# BiciPRO

Ciclocomputador para Android con **mapas y navegación sin conexión para Chile**, con detalle especial de **Santiago**. Se conecta por Bluetooth a
**centralitas de bicicletas eléctricas** (lee sus tramas y códigos), **pulsómetros**, sensores de **velocidad/cadencia** y de **potencia**, controla
**cualquier reproductor** de música del teléfono, graba rutas (GPX/Strava) y puede usarse como pantalla de inicio en cualquier teléfono (modo launcher).

**Desarrollada por Javiera Navarrete** · Licencia [GPL-3.0-or-later](LICENSE) · Android 5.0 hasta la 17, en teléfonos y tabletas.

## Mapas de Chile
Los mapas y el ruteo van aparte (pesan ~1,3 GB). Con el teléfono conectado por USB (depuración USB), corre `mapas/instalar-mapa-chile.sh`: recorta Chile
desde Protomaps/OpenStreetMap y lo copia a la app. Sin mapas la app funciona, pero sin navegación sin conexión.

## Sensores
En la pestaña *Sensores* busca por Bluetooth y asigna cada dispositivo a su rol (centralita, pulsómetro, velocidad/cadencia, potencia). Nada viene preasignado.

---

## English
**BiciPRO** is an Android cycling computer with **offline maps and navigation for Chile**, especially detailed for **Santiago**. It connects over Bluetooth to
**e-bike controllers** (reads their frames and codes), **heart-rate monitors**, **speed/cadence** and **power** sensors, controls **any music player** on the
phone, records rides (GPX/Strava) and can serve as a home screen on any phone (launcher mode). Android 5.0 up to 17, phones and tablets. Maps and routing data
(~1.3 GB) are installed separately with `mapas/instalar-mapa-chile.sh` over USB debugging. **Developed by Javiera Navarrete**, GPL-3.0-or-later.
