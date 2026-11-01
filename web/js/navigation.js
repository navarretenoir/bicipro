/**
 * ADO O260T Navigation Engine — Motor de Navegación de Ruta Más Corta Offline para Santiago de Chile
 * Arquitectura 100% Soberana y Autónoma sin dependencias de servidores externos.
 * Algoritmo Dijkstra euclidiano puro (Ruta estrictamente más corta).
 * Integración nativa con pantalla de centralita ADO O260T (Little-Endian verificado).
 * Desarrollado para Javiera Navarrete (JNA).
 */

(function(window) {
  'use strict';

  // Nodos estratégicos con coordenadas WGS84 de alta precisión de Santiago
  const SANTIAGO_NODES = {
    "sm_gran_av_americo": {
        "name": "Gran Avenida con Américo Vespucio (Metro La Cisterna)",
        "lat": -33.537,
        "lng": -70.664,
        "type": "metro"
    },
    "sm_gran_av_lo_ovalle": {
        "name": "Gran Avenida con Lo Ovalle (Metro Lo Ovalle)",
        "lat": -33.522,
        "lng": -70.661,
        "type": "metro"
    },
    "sm_gran_av_depar": {
        "name": "Gran Avenida con Av. Departamental (Metro Departamental)",
        "lat": -33.504,
        "lng": -70.656,
        "type": "metro"
    },
    "sm_gran_av_sales": {
        "name": "Gran Avenida con Salesianos",
        "lat": -33.488,
        "lng": -70.653,
        "type": "intersection"
    },
    "sm_san_miguel_metro": {
        "name": "Metro San Miguel (Gran Avenida)",
        "lat": -33.481,
        "lng": -70.652,
        "type": "metro"
    },
    "sm_gran_av_valdo": {
        "name": "Gran Avenida con Carlos Valdovinos (Metro El Llano)",
        "lat": -33.4735,
        "lng": -70.6515,
        "type": "metro"
    },
    "pac_casa": {
        "name": "Pedro Aguirre Cerda (Sector Residencial)",
        "lat": -33.4851,
        "lng": -70.6698,
        "type": "base"
    },
    "pac_jarlan": {
        "name": "Parque André Jarlán (Ciclovía Clotario Blest)",
        "lat": -33.4832,
        "lng": -70.6815,
        "type": "park"
    },
    "pac_cl_hipico_depar": {
        "name": "Av. Club Hípico con Av. Departamental",
        "lat": -33.4985,
        "lng": -70.672,
        "type": "intersection"
    },
    "pac_cl_hipico_sales": {
        "name": "Av. Club Hípico con Salesianos",
        "lat": -33.4865,
        "lng": -70.6705,
        "type": "intersection"
    },
    "pac_carlos_valdo_hipico": {
        "name": "Av. Carlos Valdovinos con Club Hípico",
        "lat": -33.4735,
        "lng": -70.6685,
        "type": "intersection"
    },
    "sm_santa_rosa_depar": {
        "name": "Av. Santa Rosa con Av. Departamental",
        "lat": -33.505,
        "lng": -70.64,
        "type": "intersection"
    },
    "sm_santa_rosa_sales": {
        "name": "Av. Santa Rosa con Salesianos",
        "lat": -33.4885,
        "lng": -70.6385,
        "type": "intersection"
    },
    "sm_santa_rosa_valdo": {
        "name": "Av. Santa Rosa con Carlos Valdovinos",
        "lat": -33.474,
        "lng": -70.638,
        "type": "intersection"
    },
    "fl_vicuna_depar": {
        "name": "Av. Vicuña Mackenna con Av. Departamental (Metro Pedrero)",
        "lat": -33.5065,
        "lng": -70.612,
        "type": "metro"
    },
    "sm_vicuna_valdo": {
        "name": "Av. Vicuña Mackenna con Carlos Valdovinos (Metro Rodrigo de Araya)",
        "lat": -33.475,
        "lng": -70.622,
        "type": "metro"
    },
    "stgo_franklin_san_diego": {
        "name": "Barrio Franklin / Biobío (San Diego con Placer)",
        "lat": -33.468,
        "lng": -70.6505,
        "type": "landmark"
    },
    "stgo_franklin_santa_rosa": {
        "name": "Av. Santa Rosa con Franklin",
        "lat": -33.4685,
        "lng": -70.6375,
        "type": "intersection"
    },
    "stgo_nuble_vicuna": {
        "name": "Av. Vicuña Mackenna con Ñuble (Metro Ñuble)",
        "lat": -33.467,
        "lng": -70.624,
        "type": "metro"
    },
    "stgo_matta_san_diego": {
        "name": "Av. Matta con San Diego",
        "lat": -33.455,
        "lng": -70.65,
        "type": "intersection"
    },
    "stgo_matta_santa_rosa": {
        "name": "Av. Matta con Santa Rosa",
        "lat": -33.4555,
        "lng": -70.642,
        "type": "intersection"
    },
    "stgo_matta_vicuna": {
        "name": "Av. Matta con Vicuña Mackenna (Metro Irarrázaval)",
        "lat": -33.456,
        "lng": -70.628,
        "type": "metro"
    },
    "stgo_rondizzoni_av": {
        "name": "Av. Rondizzoni con Beaucheff (Parque O'Higgins)",
        "lat": -33.466,
        "lng": -70.663,
        "type": "park"
    },
    "stgo_blanco_encalada": {
        "name": "Av. Blanco Encalada con Beaucheff",
        "lat": -33.454,
        "lng": -70.662,
        "type": "intersection"
    },
    "stgo_diez_julio_san_diego": {
        "name": "10 de Julio con San Diego",
        "lat": -33.45,
        "lng": -70.6505,
        "type": "intersection"
    },
    "stgo_santa_isabel_san_diego": {
        "name": "Santa Isabel con San Diego (Metro Parque Almagro)",
        "lat": -33.4485,
        "lng": -70.651,
        "type": "metro"
    },
    "stgo_santa_isabel_santa_rosa": {
        "name": "Santa Isabel con Santa Rosa",
        "lat": -33.449,
        "lng": -70.643,
        "type": "intersection"
    },
    "stgo_santa_isabel_vicuna": {
        "name": "Santa Isabel con Vicuña Mackenna (Metro Santa Isabel)",
        "lat": -33.4495,
        "lng": -70.63,
        "type": "metro"
    },
    "stgo_alameda_san_diego": {
        "name": "Alameda con San Diego (Metro U. de Chile)",
        "lat": -33.4445,
        "lng": -70.6515,
        "type": "metro"
    },
    "stgo_alameda_santa_rosa": {
        "name": "Alameda con Santa Rosa (Metro Santa Lucía)",
        "lat": -33.4435,
        "lng": -70.645,
        "type": "metro"
    },
    "stgo_la_moneda": {
        "name": "Palacio de La Moneda / Plaza de la Ciudadanía",
        "lat": -33.443,
        "lng": -70.6538,
        "type": "landmark"
    },
    "stgo_alameda_los_heroes": {
        "name": "Alameda con Manuel Rodríguez (Metro Los Héroes)",
        "lat": -33.446,
        "lng": -70.66,
        "type": "metro"
    },
    "stgo_alameda_espana": {
        "name": "Alameda con Av. España (Metro U.L.A.)",
        "lat": -33.448,
        "lng": -70.668,
        "type": "metro"
    },
    "stgo_plaza_armas": {
        "name": "Plaza de Armas de Santiago",
        "lat": -33.4378,
        "lng": -70.6505,
        "type": "landmark"
    },
    "stgo_cerro_santa_lucia": {
        "name": "Cerro Santa Lucía (Merced con Santa Lucía)",
        "lat": -33.441,
        "lng": -70.6435,
        "type": "landmark"
    },
    "stgo_parque_forestal": {
        "name": "Parque Forestal (Ciclovía Mapocho)",
        "lat": -33.436,
        "lng": -70.64,
        "type": "park"
    },
    "stgo_plaza_baquedano": {
        "name": "Plaza Baquedano / Metro Baquedano (Plaza Italia)",
        "lat": -33.437,
        "lng": -70.6345,
        "type": "metro"
    },
    "prov_salvador": {
        "name": "Metro Salvador (Av. Providencia)",
        "lat": -33.435,
        "lng": -70.624,
        "type": "metro"
    },
    "prov_manuel_montt": {
        "name": "Av. Providencia con Manuel Montt",
        "lat": -33.431,
        "lng": -70.615,
        "type": "metro"
    },
    "prov_pedro_valdivia": {
        "name": "Av. Providencia con Pedro de Valdivia",
        "lat": -33.4265,
        "lng": -70.611,
        "type": "metro"
    },
    "prov_los_leones": {
        "name": "Av. Providencia con Los Leones (Metro Los Leones)",
        "lat": -33.4225,
        "lng": -70.608,
        "type": "metro"
    },
    "prov_costanera_center": {
        "name": "Costanera Center / Metro Tobalaba",
        "lat": -33.418,
        "lng": -70.605,
        "type": "metro"
    },
    "prov_parque_metropolitano": {
        "name": "Parque Metropolitano (Entrada Pío Nono)",
        "lat": -33.432,
        "lng": -70.635,
        "type": "park"
    },
    "prov_pocuro_lyon": {
        "name": "Ciclovía Pocuro con Ricardo Lyon",
        "lat": -33.434,
        "lng": -70.608,
        "type": "cycleway"
    },
    "prov_pocuro_los_leones": {
        "name": "Ciclovía Pocuro con Los Leones",
        "lat": -33.4325,
        "lng": -70.604,
        "type": "cycleway"
    },
    "prov_pocuro_tobalaba": {
        "name": "Ciclovía Pocuro con Av. Tobalaba",
        "lat": -33.43,
        "lng": -70.598,
        "type": "cycleway"
    },
    "lc_el_golf": {
        "name": "Metro El Golf (Av. Apoquindo)",
        "lat": -33.417,
        "lng": -70.596,
        "type": "metro"
    },
    "lc_escuela_militar": {
        "name": "Metro Escuela Militar (Av. Apoquindo con Américo Vespucio)",
        "lat": -33.415,
        "lng": -70.589,
        "type": "metro"
    },
    "lc_manquehue": {
        "name": "Metro Manquehue (Av. Apoquindo)",
        "lat": -33.408,
        "lng": -70.567,
        "type": "metro"
    },
    "lc_parque_arauco": {
        "name": "Parque Arauco / Parque Araucano",
        "lat": -33.402,
        "lng": -70.575,
        "type": "park"
    },
    "lc_dominicos": {
        "name": "Metro Los Domínicos (Plaza Los Domínicos)",
        "lat": -33.407,
        "lng": -70.543,
        "type": "metro"
    },
    "vita_parque_bicentenario": {
        "name": "Parque Bicentenario Vitacura",
        "lat": -33.398,
        "lng": -70.602,
        "type": "park"
    },
    "nunoa_plaza": {
        "name": "Plaza Ñuñoa (Av. Irarrázaval)",
        "lat": -33.454,
        "lng": -70.598,
        "type": "landmark"
    },
    "nunoa_estadio_nacional": {
        "name": "Estadio Nacional (Av. Grecia con Pedro de Valdivia)",
        "lat": -33.465,
        "lng": -70.611,
        "type": "landmark"
    },
    "nunoa_irarrazaval_pedro": {
        "name": "Av. Irarrázaval con Pedro de Valdivia",
        "lat": -33.4545,
        "lng": -70.612,
        "type": "intersection"
    },
    "ec_estacion_central": {
        "name": "Estación Central de Trenes / Alameda",
        "lat": -33.451,
        "lng": -70.68,
        "type": "metro"
    },
    "ec_pajaritos": {
        "name": "Metro Las Rejas / Av. Pajaritos",
        "lat": -33.456,
        "lng": -70.707,
        "type": "metro"
    },
    "maipu_plaza": {
        "name": "Plaza de Maipú (Templo Votivo)",
        "lat": -33.511,
        "lng": -70.757,
        "type": "landmark"
    }
};

  // Aristas de la red vial y ciclista con distancia física exacta (km)
  const SANTIAGO_EDGES = [
    {
        "u": "sm_gran_av_americo",
        "v": "sm_gran_av_lo_ovalle",
        "dist": 1.69,
        "street": "Gran Avenida José Miguel Carrera"
    },
    {
        "u": "sm_gran_av_lo_ovalle",
        "v": "sm_gran_av_depar",
        "dist": 2.05,
        "street": "Gran Avenida José Miguel Carrera"
    },
    {
        "u": "sm_gran_av_depar",
        "v": "sm_gran_av_sales",
        "dist": 1.8,
        "street": "Gran Avenida José Miguel Carrera"
    },
    {
        "u": "sm_gran_av_sales",
        "v": "sm_san_miguel_metro",
        "dist": 0.78,
        "street": "Gran Avenida José Miguel Carrera"
    },
    {
        "u": "sm_san_miguel_metro",
        "v": "sm_gran_av_valdo",
        "dist": 0.84,
        "street": "Gran Avenida José Miguel Carrera"
    },
    {
        "u": "sm_gran_av_valdo",
        "v": "stgo_franklin_san_diego",
        "dist": 0.62,
        "street": "Gran Avenida / San Diego"
    },
    {
        "u": "stgo_franklin_san_diego",
        "v": "stgo_matta_san_diego",
        "dist": 1.45,
        "street": "Calle San Diego"
    },
    {
        "u": "stgo_matta_san_diego",
        "v": "stgo_diez_julio_san_diego",
        "dist": 0.56,
        "street": "Calle San Diego"
    },
    {
        "u": "stgo_diez_julio_san_diego",
        "v": "stgo_santa_isabel_san_diego",
        "dist": 0.17,
        "street": "Calle San Diego"
    },
    {
        "u": "stgo_santa_isabel_san_diego",
        "v": "stgo_alameda_san_diego",
        "dist": 0.45,
        "street": "Calle San Diego"
    },
    {
        "u": "stgo_alameda_san_diego",
        "v": "stgo_plaza_armas",
        "dist": 0.75,
        "street": "Paseo Ahumada"
    },
    {
        "u": "pac_casa",
        "v": "pac_cl_hipico_sales",
        "dist": 0.17,
        "street": "Calle Teresa Vial / Salesianos"
    },
    {
        "u": "pac_cl_hipico_sales",
        "v": "sm_gran_av_sales",
        "dist": 1.63,
        "street": "Av. Salesianos"
    },
    {
        "u": "pac_casa",
        "v": "pac_carlos_valdo_hipico",
        "dist": 1.3,
        "street": "Calle Club Hípico"
    },
    {
        "u": "pac_carlos_valdo_hipico",
        "v": "sm_gran_av_valdo",
        "dist": 1.58,
        "street": "Av. Carlos Valdovinos"
    },
    {
        "u": "pac_cl_hipico_depar",
        "v": "sm_gran_av_depar",
        "dist": 1.6,
        "street": "Av. Departamental"
    },
    {
        "u": "pac_cl_hipico_depar",
        "v": "pac_cl_hipico_sales",
        "dist": 1.34,
        "street": "Av. Club Hípico"
    },
    {
        "u": "pac_cl_hipico_sales",
        "v": "pac_carlos_valdo_hipico",
        "dist": 1.46,
        "street": "Av. Club Hípico"
    },
    {
        "u": "pac_casa",
        "v": "pac_jarlan",
        "dist": 1.11,
        "street": "Av. Clotario Blest"
    },
    {
        "u": "pac_jarlan",
        "v": "pac_cl_hipico_depar",
        "dist": 1.92,
        "street": "Av. Departamental"
    },
    {
        "u": "sm_santa_rosa_depar",
        "v": "sm_santa_rosa_sales",
        "dist": 1.84,
        "street": "Av. Santa Rosa"
    },
    {
        "u": "sm_santa_rosa_sales",
        "v": "sm_santa_rosa_valdo",
        "dist": 1.61,
        "street": "Av. Santa Rosa"
    },
    {
        "u": "sm_santa_rosa_valdo",
        "v": "stgo_franklin_santa_rosa",
        "dist": 0.61,
        "street": "Av. Santa Rosa"
    },
    {
        "u": "stgo_franklin_santa_rosa",
        "v": "stgo_matta_santa_rosa",
        "dist": 1.5,
        "street": "Av. Santa Rosa"
    },
    {
        "u": "stgo_matta_santa_rosa",
        "v": "stgo_santa_isabel_santa_rosa",
        "dist": 0.73,
        "street": "Av. Santa Rosa"
    },
    {
        "u": "stgo_santa_isabel_santa_rosa",
        "v": "stgo_alameda_santa_rosa",
        "dist": 0.64,
        "street": "Av. Santa Rosa"
    },
    {
        "u": "stgo_alameda_santa_rosa",
        "v": "stgo_cerro_santa_lucia",
        "dist": 0.31,
        "street": "Calle Santa Lucía"
    },
    {
        "u": "stgo_cerro_santa_lucia",
        "v": "stgo_parque_forestal",
        "dist": 0.64,
        "street": "José Miguel de la Barra"
    },
    {
        "u": "sm_gran_av_depar",
        "v": "sm_santa_rosa_depar",
        "dist": 1.49,
        "street": "Av. Departamental"
    },
    {
        "u": "sm_gran_av_sales",
        "v": "sm_santa_rosa_sales",
        "dist": 1.35,
        "street": "Av. Salesianos"
    },
    {
        "u": "sm_gran_av_valdo",
        "v": "sm_santa_rosa_valdo",
        "dist": 1.25,
        "street": "Av. Carlos Valdovinos"
    },
    {
        "u": "stgo_franklin_san_diego",
        "v": "stgo_franklin_santa_rosa",
        "dist": 1.21,
        "street": "Calle Franklin / Placer"
    },
    {
        "u": "stgo_matta_san_diego",
        "v": "stgo_matta_santa_rosa",
        "dist": 0.74,
        "street": "Av. Manuel Antonio Matta"
    },
    {
        "u": "stgo_santa_isabel_san_diego",
        "v": "stgo_santa_isabel_santa_rosa",
        "dist": 0.74,
        "street": "Av. Santa Isabel"
    },
    {
        "u": "fl_vicuna_depar",
        "v": "sm_vicuna_valdo",
        "dist": 3.62,
        "street": "Av. Vicuña Mackenna"
    },
    {
        "u": "sm_vicuna_valdo",
        "v": "stgo_nuble_vicuna",
        "dist": 0.91,
        "street": "Av. Vicuña Mackenna"
    },
    {
        "u": "stgo_nuble_vicuna",
        "v": "stgo_matta_vicuna",
        "dist": 1.28,
        "street": "Av. Vicuña Mackenna"
    },
    {
        "u": "stgo_matta_vicuna",
        "v": "stgo_santa_isabel_vicuna",
        "dist": 0.75,
        "street": "Av. Vicuña Mackenna"
    },
    {
        "u": "stgo_santa_isabel_vicuna",
        "v": "stgo_plaza_baquedano",
        "dist": 1.45,
        "street": "Av. Vicuña Mackenna"
    },
    {
        "u": "sm_santa_rosa_depar",
        "v": "fl_vicuna_depar",
        "dist": 2.6,
        "street": "Av. Departamental"
    },
    {
        "u": "sm_santa_rosa_valdo",
        "v": "sm_vicuna_valdo",
        "dist": 1.49,
        "street": "Av. Carlos Valdovinos"
    },
    {
        "u": "stgo_matta_santa_rosa",
        "v": "stgo_matta_vicuna",
        "dist": 1.3,
        "street": "Av. Manuel Antonio Matta"
    },
    {
        "u": "stgo_santa_isabel_santa_rosa",
        "v": "stgo_santa_isabel_vicuna",
        "dist": 1.21,
        "street": "Av. Santa Isabel"
    },
    {
        "u": "ec_pajaritos",
        "v": "ec_estacion_central",
        "dist": 2.57,
        "street": "Av. Libertador Bernardo O'Higgins (Alameda)"
    },
    {
        "u": "ec_estacion_central",
        "v": "stgo_alameda_espana",
        "dist": 1.16,
        "street": "Alameda"
    },
    {
        "u": "stgo_alameda_espana",
        "v": "stgo_alameda_los_heroes",
        "dist": 0.77,
        "street": "Alameda"
    },
    {
        "u": "stgo_alameda_los_heroes",
        "v": "stgo_la_moneda",
        "dist": 0.66,
        "street": "Alameda"
    },
    {
        "u": "stgo_la_moneda",
        "v": "stgo_alameda_san_diego",
        "dist": 0.27,
        "street": "Alameda"
    },
    {
        "u": "stgo_alameda_san_diego",
        "v": "stgo_alameda_santa_rosa",
        "dist": 0.61,
        "street": "Alameda"
    },
    {
        "u": "stgo_alameda_santa_rosa",
        "v": "stgo_plaza_baquedano",
        "dist": 1.21,
        "street": "Alameda"
    },
    {
        "u": "maipu_plaza",
        "v": "ec_pajaritos",
        "dist": 7.67,
        "street": "Av. Pajaritos"
    },
    {
        "u": "stgo_plaza_baquedano",
        "v": "prov_salvador",
        "dist": 1.0,
        "street": "Av. Providencia"
    },
    {
        "u": "stgo_plaza_baquedano",
        "v": "stgo_parque_forestal",
        "dist": 0.52,
        "street": "Ciclovía Mapocho 42K"
    },
    {
        "u": "stgo_plaza_baquedano",
        "v": "prov_parque_metropolitano",
        "dist": 0.56,
        "street": "Pío Nono"
    },
    {
        "u": "prov_salvador",
        "v": "prov_manuel_montt",
        "dist": 0.95,
        "street": "Av. Providencia"
    },
    {
        "u": "prov_manuel_montt",
        "v": "prov_pedro_valdivia",
        "dist": 0.62,
        "street": "Av. Providencia"
    },
    {
        "u": "prov_pedro_valdivia",
        "v": "prov_los_leones",
        "dist": 0.52,
        "street": "Av. Providencia"
    },
    {
        "u": "prov_los_leones",
        "v": "prov_costanera_center",
        "dist": 0.57,
        "street": "Av. Providencia / Nueva Providencia"
    },
    {
        "u": "prov_costanera_center",
        "v": "lc_el_golf",
        "dist": 0.84,
        "street": "Av. Apoquindo"
    },
    {
        "u": "lc_el_golf",
        "v": "lc_escuela_militar",
        "dist": 0.69,
        "street": "Av. Apoquindo"
    },
    {
        "u": "lc_escuela_militar",
        "v": "lc_manquehue",
        "dist": 2.19,
        "street": "Av. Apoquindo"
    },
    {
        "u": "lc_manquehue",
        "v": "lc_parque_arauco",
        "dist": 1.0,
        "street": "Av. Manquehue"
    },
    {
        "u": "lc_manquehue",
        "v": "lc_dominicos",
        "dist": 2.23,
        "street": "Av. Apoquindo"
    },
    {
        "u": "prov_costanera_center",
        "v": "vita_parque_bicentenario",
        "dist": 2.24,
        "street": "Ciclovía Mapocho 42K"
    },
    {
        "u": "stgo_matta_vicuna",
        "v": "nunoa_estadio_nacional",
        "dist": 1.87,
        "street": "Av. Grecia"
    },
    {
        "u": "nunoa_estadio_nacional",
        "v": "nunoa_irarrazaval_pedro",
        "dist": 1.17,
        "street": "Av. Pedro de Valdivia"
    },
    {
        "u": "nunoa_irarrazaval_pedro",
        "v": "nunoa_plaza",
        "dist": 1.3,
        "street": "Av. Irarrázaval"
    },
    {
        "u": "nunoa_irarrazaval_pedro",
        "v": "prov_pocuro_lyon",
        "dist": 2.31,
        "street": "Av. Pedro de Valdivia / Lyon"
    },
    {
        "u": "prov_manuel_montt",
        "v": "prov_pocuro_lyon",
        "dist": 0.73,
        "street": "Av. Ricardo Lyon"
    },
    {
        "u": "prov_pocuro_lyon",
        "v": "prov_pocuro_los_leones",
        "dist": 0.41,
        "street": "Ciclovía Pocuro"
    },
    {
        "u": "prov_pocuro_los_leones",
        "v": "prov_pocuro_tobalaba",
        "dist": 0.62,
        "street": "Ciclovía Pocuro"
    },
    {
        "u": "prov_pocuro_tobalaba",
        "v": "prov_costanera_center",
        "dist": 1.48,
        "street": "Av. Tobalaba"
    },
    {
        "u": "pac_carlos_valdo_hipico",
        "v": "stgo_rondizzoni_av",
        "dist": 0.98,
        "street": "Av. Beaucheff"
    },
    {
        "u": "stgo_rondizzoni_av",
        "v": "stgo_blanco_encalada",
        "dist": 1.34,
        "street": "Av. Beaucheff"
    },
    {
        "u": "stgo_blanco_encalada",
        "v": "stgo_alameda_espana",
        "dist": 0.87,
        "street": "Av. España"
    },
    {
        "u": "stgo_blanco_encalada",
        "v": "stgo_matta_san_diego",
        "dist": 1.12,
        "street": "Av. Matta"
    }
];

  // Estado del motor de navegación
  const navState = {
    isNavigating: false,
    destinationNode: null,
    destinationName: "",
    currentSteps: [],
    currentStepIndex: 0,
    totalDistanceKm: 0,
    remainingDistanceKm: 0,
    etaMinutes: 0,
    lastVoiceAnnouncedIndex: -1,
    lastVoiceAnnouncedStage: null,
    routePolyline: null,
    destinationMarker: null
  };

  // Cálculo de distancia ortodrómica Haversine (km)
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371.0;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Obtiene la ubicación física real actual del usuario desde el hardware GPS
  function getUserLocation() {
    if (window.getUserLocation) {
      return window.getUserLocation();
    }
    const b = window.getBridge ? window.getBridge() : (window.BiciPRO || window.ADO);
    if (b && b.getLatitude && b.getLongitude) {
      const bLat = b.getLatitude();
      const bLng = b.getLongitude();
      if (bLat !== 0 && bLng !== 0) return { lat: bLat, lng: bLng };
    }
    if (window.state && window.state.lat && window.state.lng) {
      return { lat: window.state.lat, lng: window.state.lng };
    }
    return { lat: -33.5039, lng: -70.6610 };
  }

  // Encuentra el nodo más cercano en el grafo de Santiago a una coordenada GPS
  function findNearestNode(lat, lng) {
    let nearestKey = null;
    let minDist = Infinity;
    for (const key in SANTIAGO_NODES) {
      const node = SANTIAGO_NODES[key];
      const d = haversineDistance(lat, lng, node.lat, node.lng);
      if (d < minDist) {
        minDist = d;
        nearestKey = key;
      }
    }
    return nearestKey;
  }

  // Algoritmo Dijkstra euclidiano puro — RUTA ESTRICTAMENTE MÁS CORTA
  function calculateRoute(startNodeKey, endNodeKey) {
    if (startNodeKey === endNodeKey) return null;

    // Construcción de lista de adyacencia
    const adj = {};
    for (const key in SANTIAGO_NODES) adj[key] = [];

    SANTIAGO_EDGES.forEach(edge => {
      // Ponderación de distancia pura: siempre el camino más corto
      adj[edge.u].push({ node: edge.v, dist: edge.dist, street: edge.street });
      adj[edge.v].push({ node: edge.u, dist: edge.dist, street: edge.street });
    });

    const distances = {};
    const previous = {};
    const previousEdge = {};
    const unvisited = new Set(Object.keys(SANTIAGO_NODES));

    for (const key in SANTIAGO_NODES) {
      distances[key] = Infinity;
    }
    distances[startNodeKey] = 0;

    while (unvisited.size > 0) {
      let current = null;
      let minDistance = Infinity;
      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          current = node;
        }
      }

      if (current === null || distances[current] === Infinity) break;
      if (current === endNodeKey) break;

      unvisited.delete(current);

      for (const neighbor of adj[current]) {
        if (unvisited.has(neighbor.node)) {
          const alt = distances[current] + neighbor.dist;
          if (alt < distances[neighbor.node]) {
            distances[neighbor.node] = alt;
            previous[neighbor.node] = current;
            previousEdge[neighbor.node] = neighbor;
          }
        }
      }
    }

    if (!previous[endNodeKey] && distances[endNodeKey] === Infinity) {
      return null;
    }

    // Reconstruir camino
    const pathNodes = [];
    let curr = endNodeKey;
    while (curr) {
      pathNodes.unshift(curr);
      curr = previous[curr];
    }

    // Generar coordenadas completas para la polilínea del mapa
    const coordinates = pathNodes.map(key => [SANTIAGO_NODES[key].lat, SANTIAGO_NODES[key].lng]);

    // Generar instrucciones de maniobra paso a paso
    const steps = [];
    let totalDistKm = 0;

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const uKey = pathNodes[i];
      const vKey = pathNodes[i + 1];
      const nodeObj = SANTIAGO_NODES[uKey];
      const nextNodeObj = SANTIAGO_NODES[vKey];

      const edgeInfo = SANTIAGO_EDGES.find(e => (e.u === uKey && e.v === vKey) || (e.u === vKey && e.v === uKey));
      const legDist = edgeInfo ? edgeInfo.dist : haversineDistance(nodeObj.lat, nodeObj.lng, nextNodeObj.lat, nextNodeObj.lng);
      totalDistKm += legDist;

      // Calcular ángulo de maniobra (giro)
      let turnType = "straight";
      let dirCode = 0x01; // Straight por defecto
      if (i > 0) {
        const prevNodeObj = SANTIAGO_NODES[pathNodes[i - 1]];
        const bearing1 = calculateBearing(prevNodeObj.lat, prevNodeObj.lng, nodeObj.lat, nodeObj.lng);
        const bearing2 = calculateBearing(nodeObj.lat, nodeObj.lng, nextNodeObj.lat, nextNodeObj.lng);
        let diff = (bearing2 - bearing1 + 360) % 360;
        if (diff > 180) diff -= 360;

        if (diff > 45 && diff < 135) {
          turnType = "turn-right";
          dirCode = 0x03; // Right
        } else if (diff >= 135) {
          turnType = "u-turn";
          dirCode = 0x08; // U-Turn
        } else if (diff < -45 && diff > -135) {
          turnType = "turn-left";
          dirCode = 0x02; // Left
        } else if (diff <= -135) {
          turnType = "u-turn";
          dirCode = 0x08; // U-Turn
        } else if (diff >= 15 && diff <= 45) {
          turnType = "slight-right";
          dirCode = 0x05; // Slight Right
        } else if (diff <= -15 && diff >= -45) {
          turnType = "slight-left";
          dirCode = 0x04; // Slight Left
        }
      }

      const streetName = edgeInfo ? edgeInfo.street : "Vía local";
      let instruction = "";
      if (i === 0) {
        instruction = `Continúa recto por ${streetName} hacia ${nextNodeObj.name}`;
      } else if (turnType === "turn-right") {
        instruction = `Gira a la derecha en ${streetName}`;
      } else if (turnType === "turn-left") {
        instruction = `Gira a la izquierda en ${streetName}`;
      } else if (turnType === "slight-right") {
        instruction = `Sigue levemente a la derecha por ${streetName}`;
      } else if (turnType === "slight-left") {
        instruction = `Sigue levemente a la izquierda por ${streetName}`;
      } else if (turnType === "u-turn") {
        instruction = `Realiza un retorno en U hacia ${streetName}`;
      } else {
        instruction = `Continúa recto por ${streetName}`;
      }

      steps.push({
        stepNumber: i + 1,
        fromName: nodeObj.name,
        toName: nextNodeObj.name,
        street: streetName,
        distanceM: Math.round(legDist * 1000),
        turnType: turnType,
        dirCode: dirCode,
        lat: nodeObj.lat,
        lng: nodeObj.lng,
        instruction: instruction
      });
    }

    // Paso final de llegada
    steps.push({
      stepNumber: steps.length + 1,
      fromName: SANTIAGO_NODES[endNodeKey].name,
      toName: SANTIAGO_NODES[endNodeKey].name,
      street: SANTIAGO_NODES[endNodeKey].name,
      distanceM: 0,
      turnType: "arrive",
      dirCode: 0x07,
      lat: SANTIAGO_NODES[endNodeKey].lat,
      lng: SANTIAGO_NODES[endNodeKey].lng,
      instruction: `Has llegado a ${SANTIAGO_NODES[endNodeKey].name}`
    });

    const etaMin = Math.round((totalDistKm / 22.5) * 60 + (steps.length * 0.35));

    return {
      coordinates,
      steps,
      totalDistKm: parseFloat(totalDistKm.toFixed(2)),
      etaMinutes: Math.max(1, etaMin),
      destinationName: SANTIAGO_NODES[endNodeKey].name
    };
  }

  function calculateBearing(lat1, lon1, lat2, lon2) {
    const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }


  // Arranca la navegación con una ruta ya calculada (red de Santiago o BRouter offline). Kotone 2026-10-31.
  function iniciarRuta(route, destName, dest, destIdentifier, silencioso) {
    navState.isNavigating = true;
    navState.destinationNode = typeof destIdentifier === 'string' ? destIdentifier : (dest.id || 'custom');
    navState.destinationName = destName;
    navState.currentSteps = route.steps;
    navState.currentStepIndex = 0;
    navState.totalDistanceKm = route.totalDistKm;
    navState.remainingDistanceKm = route.totalDistKm;
    navState.etaMinutes = route.etaMinutes;
    navState.lastVoiceAnnouncedIndex = -1;
    navState.lastVoiceAnnouncedStage = null;

    // Dibujar traza en el mapa
    if (window.state && window.state.map) {
      if (navState.routePolyline) {
        window.state.map.removeLayer(navState.routePolyline);
      }
      navState.routePolyline = L.polyline(route.coordinates, {
        color: '#0066FF',
        weight: 6,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(window.state.map);

      window.state.map.fitBounds(navState.routePolyline.getBounds(), { padding: [60, 60] });
    }

    // Mostrar HUD
    showNavHud();
    updateNavHud();

    // Enviar inicio a pantalla ADO
    sendAdoNavStart();
    const firstStep = route.steps[0];
    setTimeout(() => {
      sendAdoNavDirection(firstStep.dirCode, firstStep.distanceM, Math.round(route.totalDistKm * 1000));
    }, 200);

    // Locución por voz en Español Chileno
    navState.routeCoords = route.coordinates;
    navState.dest = { lat: dest.lat, lng: dest.lng, name: destName };
    navState.offRouteSince = 0;
    navState.recalculando = false;
    navState.pctCiclovia = route.pctCiclovia;
    pintarCiclovia(route.pctCiclovia);
    if (silencioso) speakGuidance(`Estás en la ruta. ${firstStep.instruction}.`);
    else {
      const resumen = route.offline ? ` ${String(route.totalDistKm).replace('.', ',')} kilómetros${route.pctCiclovia ? ', ' + route.pctCiclovia + ' por ciento por ciclovía' : ''}.` : '';
      speakGuidance(`Iniciando navegación hacia ${destName}.${resumen} ${firstStep.instruction}.`);
    }
  }

  // % de la ruta por ciclovía en la barra inferior (como «% de ciclovías» de Google Maps)
  function pintarCiclovia(pct) {
    const bar = document.getElementById('nav-hud-bottom');
    if (!bar) return;
    let col = document.getElementById('nav-hud-ciclo');
    if (!col) {
      col = document.createElement('div');
      col.className = 'nav-stat-col'; col.id = 'nav-hud-ciclo';
      col.innerHTML = '<span class="nav-stat-val" id="nav-hud-ciclo-val">0%</span><span class="nav-stat-lbl">por ciclovía</span>';
      const salir = bar.querySelector('.btn-end-nav');
      bar.insertBefore(col, salir);
    }
    col.style.display = pct === undefined ? 'none' : '';
    const v = document.getElementById('nav-hud-ciclo-val');
    if (v) v.textContent = (pct || 0) + '%';
  }

  // instantánea de sólo lectura para la Now Bar (enlace.js)
  window.navEstado = () => navState.isNavigating ? {
    total: navState.totalDistanceKm, resto: navState.remainingDistanceKm, eta: navState.etaMinutes,
    paso: navState.currentSteps[navState.currentStepIndex] || null, destino: navState.destinationName,
  } : null;

  // --- API Pública del Motor de Navegación ADO O260T ---

  window.searchSantiagoLocations = function(query) {
    if (!query || query.trim().length === 0) return [];
    const uPos = getUserLocation();

    if (window.ChileGeo && window.ChileGeo.search) {
      return window.ChileGeo.search(query, uPos.lat, uPos.lng);
    }

    const q = query.trim().toLowerCase();
    const matches = [];
    for (const key in SANTIAGO_NODES) {
      const n = SANTIAGO_NODES[key];
      if (n.name.toLowerCase().includes(q)) {
        const d = haversineDistance(uPos.lat, uPos.lng, n.lat, n.lng);
        matches.push({
          key: key,
          id: key,
          name: n.name,
          title: n.name,
          commune: n.type || "Santiago",
          category: n.type || "Punto de Interés",
          distFromUserKm: parseFloat(d.toFixed(1)),
          lat: n.lat,
          lng: n.lng
        });
      }
    }
    return matches.sort((a, b) => a.distFromUserKm - b.distFromUserKm);
  };

  window.startNavigationToNode = function(destIdentifier, sinOffline) {
    let dest = null;
    if (typeof destIdentifier === 'string') {
      if (SANTIAGO_NODES[destIdentifier]) {
        dest = { ...SANTIAGO_NODES[destIdentifier], key: destIdentifier, id: destIdentifier };
      } else if (window.ChileGeo && window.ChileGeo.getById) {
        dest = window.ChileGeo.getById(destIdentifier);
      }
    } else if (typeof destIdentifier === 'object' && destIdentifier !== null) {
      dest = destIdentifier;
    }

    if (!dest || dest.lat === undefined || dest.lng === undefined) {
      console.warn("Destino no válido:", destIdentifier);
      return;
    }

    const destName = dest.name || dest.title || "Destino";
    const destLat = dest.lat;
    const destLng = dest.lng;

    // Obtener la posición física REAL del usuario (desde hardware o GPS vivo)
    const userPos = getUserLocation();
    const currentLat = userPos.lat;
    const currentLng = userPos.lng;

    // Marcador de destino en el mapa Leaflet
    if (window.state && window.state.map) {
      if (navState.destinationMarker) {
        window.state.map.removeLayer(navState.destinationMarker);
      }
      const destIcon = L.divIcon({
        className: 'bicipro-dest-pin',
        html: '<div style="background:#0066FF;color:#fff;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.5);border:2.5px solid #fff;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });
      navState.destinationMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(window.state.map);
      navState.destinationMarker.bindPopup(`<b>${destName}</b><br><span style="font-size:11px;color:#555;">${dest.commune || ''} ${dest.region ? '(' + dest.region + ')' : ''}</span>`).openPopup();
    }

    // Ruteo OFFLINE de todo Chile con BRouter (mapas.js); si no está o falla, la red de Santiago de siempre.
    if (!sinOffline && window.RuteoOffline && window.RuteoOffline.disponible()) {
      speakGuidance('Calculando ruta');
      window.RuteoOffline.ruta(currentLat, currentLng, destLat, destLng, destName).then(route => {
        if (route && route.steps.length > 1) iniciarRuta(route, destName, dest, destIdentifier);
        else window.startNavigationToNode(destIdentifier, true);
      });
      return;
    }

    const directDistKm = haversineDistance(currentLat, currentLng, destLat, destLng);
    const targetNodeKey = findNearestNode(destLat, destLng);
    const startNodeKey = findNearestNode(currentLat, currentLng);
    const distToTargetNodeKm = targetNodeKey ? haversineDistance(destLat, destLng, SANTIAGO_NODES[targetNodeKey].lat, SANTIAGO_NODES[targetNodeKey].lng) : 999;
    const distToStartNodeKm = startNodeKey ? haversineDistance(currentLat, currentLng, SANTIAGO_NODES[startNodeKey].lat, SANTIAGO_NODES[startNodeKey].lng) : 999;

    // Si el destino está dentro del área de Santiago (hasta 12 km de un nodo y menos de 50 km del usuario)
    if (targetNodeKey && distToTargetNodeKm <= 12.0 && directDistKm <= 50.0) {
      let route = null;

      if (startNodeKey === targetNodeKey) {
        // Usuario muy cerca del destino: conexión directa
        route = {
          coordinates: [[currentLat, currentLng], [destLat, destLng]],
          steps: [
            {
              stepNumber: 1,
              fromName: "Ubicación actual",
              toName: destName,
              street: destName,
              distanceM: Math.round(directDistKm * 1000),
              turnType: "straight",
              dirCode: 0x01,
              lat: currentLat,
              lng: currentLng,
              instruction: `Continúa directo hacia ${destName}`
            },
            {
              stepNumber: 2,
              fromName: destName,
              toName: destName,
              street: destName,
              distanceM: 0,
              turnType: "arrive",
              dirCode: 0x07,
              lat: destLat,
              lng: destLng,
              instruction: `Has llegado a ${destName}`
            }
          ],
          totalDistKm: parseFloat(directDistKm.toFixed(2)),
          etaMinutes: Math.max(1, Math.round((directDistKm / 22.5) * 60 + 1)),
          destinationName: destName
        };
      } else {
        const graphRoute = calculateRoute(startNodeKey, targetNodeKey);

        if (graphRoute && graphRoute.steps && graphRoute.steps.length > 0) {
          const coordinates = [[currentLat, currentLng], ...graphRoute.coordinates];
          const steps = [];

          // Paso 1: Desde la ubicación exacta del usuario hacia el nodo inicial
          const startNodeObj = SANTIAGO_NODES[startNodeKey];
          const leg0DistM = Math.round(distToStartNodeKm * 1000);
          steps.push({
            stepNumber: 1,
            fromName: "Ubicación actual",
            toName: startNodeObj.name,
            street: startNodeObj.name,
            distanceM: leg0DistM,
            turnType: "straight",
            dirCode: 0x01,
            lat: currentLat,
            lng: currentLng,
            instruction: `Dirígete hacia ${startNodeObj.name}`
          });

          // Pasos de la red
          graphRoute.steps.forEach(st => {
            if (st.turnType !== 'arrive') {
              steps.push({
                ...st,
                stepNumber: steps.length + 1
              });
            }
          });

          // Paso final de llegada al destino físico
          if (Math.abs(destLat - SANTIAGO_NODES[targetNodeKey].lat) > 0.0004 || Math.abs(destLng - SANTIAGO_NODES[targetNodeKey].lng) > 0.0004) {
            coordinates.push([destLat, destLng]);
            const finalLegM = Math.round(distToTargetNodeKm * 1000);
            steps.push({
              stepNumber: steps.length + 1,
              fromName: SANTIAGO_NODES[targetNodeKey].name,
              toName: destName,
              street: destName,
              distanceM: finalLegM,
              turnType: 'arrive',
              dirCode: 0x07,
              lat: destLat,
              lng: destLng,
              instruction: `Llegada a destino en ${destName}`
            });
          } else {
            steps.push({
              stepNumber: steps.length + 1,
              fromName: destName,
              toName: destName,
              street: destName,
              distanceM: 0,
              turnType: 'arrive',
              dirCode: 0x07,
              lat: destLat,
              lng: destLng,
              instruction: `Has llegado a ${destName}`
            });
          }

          const totalDist = parseFloat((distToStartNodeKm + graphRoute.totalDistKm + (distToTargetNodeKm > 0.05 ? distToTargetNodeKm : 0)).toFixed(2));
          const eta = Math.max(1, Math.round((totalDist / 22.5) * 60 + (steps.length * 0.35)));

          route = {
            coordinates,
            steps,
            totalDistKm: totalDist,
            etaMinutes: eta,
            destinationName: destName
          };
        }
      }

      if (route && route.steps && route.steps.length > 0) {
        iniciarRuta(route, destName, dest, destIdentifier);
        return;
      }
    }

    // Fuera de Santiago (ej. Regiones: Viña, Concepción, Arica, etc.)
    if (window.state && window.state.map) {
      window.state.map.setView([destLat, destLng], 14, { animate: true });
    }
    const distRound = Math.round(directDistKm);
    speakGuidance(`Destino seleccionado: ${destName}. Distancia aproximada: ${distRound} kilómetros.`);
  };

  window.stopNavigation = function() {
    navState.isNavigating = false;
    navState.destinationNode = null;
    navState.currentSteps = [];
    navState.currentStepIndex = 0;

    if (window.state && window.state.map) {
      if (navState.routePolyline) {
        window.state.map.removeLayer(navState.routePolyline);
        navState.routePolyline = null;
      }
      if (navState.destinationMarker) {
        window.state.map.removeLayer(navState.destinationMarker);
        navState.destinationMarker = null;
      }
    }

    hideNavHud();
    sendAdoNavEnd();
    speakGuidance("Navegación finalizada");
  };

  // Actualización en tiempo real conforme avanza el GPS
  window.updateNavigationLocation = function(lat, lng) {
    if (!navState.isNavigating || navState.currentSteps.length === 0) return;

    const currentStep = navState.currentSteps[navState.currentStepIndex];
    if (!currentStep) return;

    // Desvío: > 40 m de la traza durante 8 s → recalcular con BRouter (como Google Maps)
    if (navState.routeCoords && window.RuteoOffline && window.RuteoOffline.disponible() && !navState.recalculando) {
      const off = window.RuteoOffline.distanciaARuta(lat, lng, navState.routeCoords);
      if (off > 40) {
        if (!navState.offRouteSince) navState.offRouteSince = Date.now();
        else if (Date.now() - navState.offRouteSince > 8000) {
          navState.recalculando = true;
          speakGuidance('Recalculando');
          const d = navState.dest;
          window.RuteoOffline.ruta(lat, lng, d.lat, d.lng, d.name).then(route => {
            navState.recalculando = false; navState.offRouteSince = 0;
            if (route && route.steps.length > 1 && navState.isNavigating) iniciarRuta(route, d.name, d, navState.destinationNode, true);
          });
        }
      } else navState.offRouteSince = 0;
    }

    // Distancia al punto de maniobra
    const distToTurnM = Math.round(haversineDistance(lat, lng, currentStep.lat, currentStep.lng) * 1000);
    if (distToTurnM <= 420 && distToTurnM >= 330 && navState.lastVoiceAnnouncedStage !== 'lejos' && navState.lastVoiceAnnouncedStage !== 'far'
        && currentStep.turnType !== 'straight') {
      navState.lastVoiceAnnouncedStage = 'lejos';
      speakGuidance(`En 400 metros, ${currentStep.instruction.toLowerCase()}`);
    }

    // Si ya completamos el paso (a menos de 25 metros)
    if (distToTurnM < 25 && navState.currentStepIndex < navState.currentSteps.length - 1) {
      navState.currentStepIndex++;
      const nextStep = navState.currentSteps[navState.currentStepIndex];
      navState.lastVoiceAnnouncedIndex = -1;
      navState.lastVoiceAnnouncedStage = null;

      // Recalcular distancia restante
      let remM = 0;
      for (let s = navState.currentStepIndex; s < navState.currentSteps.length; s++) {
        remM += navState.currentSteps[s].distanceM;
      }
      navState.remainingDistanceKm = parseFloat((remM / 1000).toFixed(2));

      updateNavHud();
      sendAdoNavDirection(nextStep.dirCode, nextStep.distanceM, remM);
      speakGuidance(nextStep.instruction);
      return;
    }

    // Anuncios de voz anticipados a 150 metros
    if (distToTurnM <= 160 && distToTurnM >= 100 && navState.lastVoiceAnnouncedStage !== 'far' && navState.currentStepIndex !== navState.lastVoiceAnnouncedIndex) {
      navState.lastVoiceAnnouncedStage = 'far';
      navState.lastVoiceAnnouncedIndex = navState.currentStepIndex;
      speakGuidance(`En ciento cincuenta metros, ${currentStep.instruction.toLowerCase()}`);
    }

    updateNavHud(distToTurnM);
  };

  function updateNavHud(distToTurnM) {
    const banner = document.getElementById('nav-hud-banner');
    if (!banner || !navState.isNavigating) return;

    const step = navState.currentSteps[navState.currentStepIndex];
    if (!step) return;

    const iconEl = document.getElementById('nav-hud-icon');
    const distEl = document.getElementById('nav-hud-dist');
    const streetEl = document.getElementById('nav-hud-street');
    const remDistEl = document.getElementById('nav-hud-rem-dist');
    const remEtaEl = document.getElementById('nav-hud-rem-eta');

    const displayM = distToTurnM !== undefined ? distToTurnM : step.distanceM;
    if (distEl) distEl.textContent = displayM > 1000 ? `${(displayM / 1000).toFixed(1)} km` : `${displayM} m`;
    if (streetEl) streetEl.textContent = step.street;
    // como Mapas de iOS: «8,9 km», «28 min» y la hora de llegada
    const km = Number(navState.remainingDistanceKm || navState.totalDistanceKm || 0);
    if (remDistEl) remDistEl.textContent = (km >= 10 ? Math.round(km) : km.toFixed(1)).toString().replace('.', ',') + ' km';
    if (remEtaEl) remEtaEl.textContent = `${navState.etaMinutes} min`;
    const llegaEl = document.getElementById('nav-hud-llegada');
    if (llegaEl) { const t = new Date(Date.now() + navState.etaMinutes * 60000); llegaEl.textContent = t.getHours() + ':' + String(t.getMinutes()).padStart(2, '0'); }

    if (iconEl) {
      iconEl.innerHTML = getManeuverSvg(step.turnType);
    }
  }

  function getManeuverSvg(type) {
    if (type === 'turn-right') {
      return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 19V11a4 4 0 0 1 4-4h6"/><polyline points="13 3 17 7 13 11"/></svg>';
    } else if (type === 'turn-left') {
      return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 19V11a4 4 0 0 0-4-4H7"/><polyline points="11 3 7 7 11 11"/></svg>';
    } else if (type === 'arrive') {
      return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
    } else {
      return '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
    }
  }

  function showNavHud() {
    const banner = document.getElementById('nav-hud-banner');
    const bottomBar = document.getElementById('nav-hud-bottom');
    const searchBar = document.getElementById('map-search-bar');
    const searchDropdown = document.getElementById('map-search-results');
    if (banner) banner.style.display = 'flex';
    if (bottomBar) bottomBar.style.display = 'flex';
    if (searchBar) searchBar.style.display = 'none';
    if (searchDropdown) searchDropdown.style.display = 'none';
  }

  function hideNavHud() {
    const banner = document.getElementById('nav-hud-banner');
    const bottomBar = document.getElementById('nav-hud-bottom');
    const searchBar = document.getElementById('map-search-bar');
    if (banner) banner.style.display = 'none';
    if (bottomBar) bottomBar.style.display = 'none';
    if (searchBar) searchBar.style.display = 'flex';
  }

  // Envío a Text-to-Speech nativo de Android
  function speakGuidance(text) {
    if (window.state && window.state.voiceGuidanceEnabled === false) return;
    const b = window.getBridge ? window.getBridge() : (window.BiciPRO || window.ADO);
    if (b && b.speak) {
      b.speak(text);
    } else if (window.speechSynthesis) {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-CL';
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }
  }

  // Enlace oficial de hardware ADO BLE — Turn-by-Turn en la centralita
  function sendAdoNavStart() {
    const b = window.getBridge ? window.getBridge() : (window.BiciPRO || window.ADO);
    if (b) {
      if (b.sendAdoNavStart) {
        b.sendAdoNavStart();
      } else if (b.sendRawAdoHex) {
        b.sendRawAdoHex("0211F103000101");
      }
    }
  }

  function sendAdoNavEnd() {
    const b = window.getBridge ? window.getBridge() : (window.BiciPRO || window.ADO);
    if (b) {
      if (b.sendAdoNavEnd) {
        b.sendAdoNavEnd();
      } else if (b.sendRawAdoHex) {
        b.sendRawAdoHex("0211F103000003");
      }
    }
  }

  function sendAdoNavDirection(dirCode, distanceMeters, totalRemainingMeters) {
    const b = window.getBridge ? window.getBridge() : (window.BiciPRO || window.ADO);
    if (b && b.sendAdoNavGuidance) {
      const rem = (totalRemainingMeters !== undefined) ? totalRemainingMeters : Math.round(((navState.remainingDistanceKm || navState.totalDistanceKm) || 0) * 1000);
      b.sendAdoNavGuidance(dirCode, distanceMeters, rem);
    }
  }

  window.BiciProNav = {
    search: window.searchSantiagoLocations,
    start: window.startNavigationToNode,
    stop: window.stopNavigation,
    update: window.updateNavigationLocation,
    getNode: function(key) { return SANTIAGO_NODES[key] || (window.ChileGeo ? window.ChileGeo.getById(key) : null); }
  };

})(window);
