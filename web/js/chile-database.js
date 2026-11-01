/**
 * ADO O260T Chile Geo Database — Directorio Completo de Todo Chile (Santiago Hiperdetallado)
 * 100% Offline, Cero dependencias externas. Creado para Javiera Navarrete.
 */

(function(window) {
  'use strict';

  const CHILE_DATABASE = [
  {
    "id": "m_l1_san_pablo",
    "key": "m_l1_san_pablo",
    "name": "Metro San Pablo",
    "title": "Metro San Pablo",
    "commune": "Lo Prado",
    "region": "Región Metropolitana",
    "category": "Metro L1/L5",
    "lat": -33.4431,
    "lng": -70.7259,
    "aliases": [
      "l1",
      "l5",
      "san pablo"
    ]
  },
  {
    "id": "m_l1_neptuno",
    "key": "m_l1_neptuno",
    "name": "Metro Neptuno",
    "title": "Metro Neptuno",
    "commune": "Lo Prado",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4475,
    "lng": -70.718,
    "aliases": [
      "l1",
      "neptuno"
    ]
  },
  {
    "id": "m_l1_pajaritos",
    "key": "m_l1_pajaritos",
    "name": "Metro Pajaritos",
    "title": "Metro Pajaritos",
    "commune": "Lo Prado",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4504,
    "lng": -70.7107,
    "aliases": [
      "l1",
      "pajaritos",
      "terminal buses"
    ]
  },
  {
    "id": "m_l1_las_rejas",
    "key": "m_l1_las_rejas",
    "name": "Metro Las Rejas",
    "title": "Metro Las Rejas",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4542,
    "lng": -70.7027,
    "aliases": [
      "l1",
      "las rejas"
    ]
  },
  {
    "id": "m_l1_ecuador",
    "key": "m_l1_ecuador",
    "name": "Metro Ecuador",
    "title": "Metro Ecuador",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4533,
    "lng": -70.6946,
    "aliases": [
      "l1",
      "ecuador"
    ]
  },
  {
    "id": "m_l1_san_alberto",
    "key": "m_l1_san_alberto",
    "name": "Metro San Alberto Hurtado",
    "title": "Metro San Alberto Hurtado",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4528,
    "lng": -70.689,
    "aliases": [
      "l1",
      "san alberto hurtado"
    ]
  },
  {
    "id": "m_l1_usach",
    "key": "m_l1_usach",
    "name": "Metro Universidad de Santiago (USACH)",
    "title": "Metro Universidad de Santiago (USACH)",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4522,
    "lng": -70.6834,
    "aliases": [
      "l1",
      "usach",
      "universidad de santiago"
    ]
  },
  {
    "id": "m_l1_estacion_central",
    "key": "m_l1_estacion_central",
    "name": "Metro Estación Central",
    "title": "Metro Estación Central",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4513,
    "lng": -70.6788,
    "aliases": [
      "l1",
      "estacion central",
      "tren central"
    ]
  },
  {
    "id": "m_l1_ula",
    "key": "m_l1_ula",
    "name": "Metro Unión Latinoamericana (U.L.A.)",
    "title": "Metro Unión Latinoamericana (U.L.A.)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4503,
    "lng": -70.6728,
    "aliases": [
      "l1",
      "ula",
      "barrio meiggs"
    ]
  },
  {
    "id": "m_l1_republica",
    "key": "m_l1_republica",
    "name": "Metro República",
    "title": "Metro República",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4491,
    "lng": -70.6672,
    "aliases": [
      "l1",
      "republica",
      "barrio universitario"
    ]
  },
  {
    "id": "m_l1_los_heroes",
    "key": "m_l1_los_heroes",
    "name": "Metro Los Héroes",
    "title": "Metro Los Héroes",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L1/L2",
    "lat": -33.4478,
    "lng": -70.6608,
    "aliases": [
      "l1",
      "l2",
      "los heroes"
    ]
  },
  {
    "id": "m_l1_la_moneda",
    "key": "m_l1_la_moneda",
    "name": "Metro La Moneda",
    "title": "Metro La Moneda",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4447,
    "lng": -70.6558,
    "aliases": [
      "l1",
      "la moneda",
      "palacio de la moneda"
    ]
  },
  {
    "id": "m_l1_u_de_chile",
    "key": "m_l1_u_de_chile",
    "name": "Metro Universidad de Chile",
    "title": "Metro Universidad de Chile",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L1/L3",
    "lat": -33.4439,
    "lng": -70.6508,
    "aliases": [
      "l1",
      "l3",
      "u de chile"
    ]
  },
  {
    "id": "m_l1_santa_lucia",
    "key": "m_l1_santa_lucia",
    "name": "Metro Santa Lucía",
    "title": "Metro Santa Lucía",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.443,
    "lng": -70.645,
    "aliases": [
      "l1",
      "santa lucia",
      "cerro santa lucia"
    ]
  },
  {
    "id": "m_l1_uc",
    "key": "m_l1_uc",
    "name": "Metro Universidad Católica (U.C.)",
    "title": "Metro Universidad Católica (U.C.)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4402,
    "lng": -70.6397,
    "aliases": [
      "l1",
      "universidad catolica",
      "gam"
    ]
  },
  {
    "id": "m_l1_baquedano",
    "key": "m_l1_baquedano",
    "name": "Metro Baquedano",
    "title": "Metro Baquedano",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L1/L5",
    "lat": -33.4373,
    "lng": -70.6343,
    "aliases": [
      "l1",
      "l5",
      "baquedano",
      "plaza italia"
    ]
  },
  {
    "id": "m_l1_salvador",
    "key": "m_l1_salvador",
    "name": "Metro Salvador",
    "title": "Metro Salvador",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4328,
    "lng": -70.6247,
    "aliases": [
      "l1",
      "salvador",
      "hospital del salvador"
    ]
  },
  {
    "id": "m_l1_manuel_montt",
    "key": "m_l1_manuel_montt",
    "name": "Metro Manuel Montt",
    "title": "Metro Manuel Montt",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4289,
    "lng": -70.6171,
    "aliases": [
      "l1",
      "manuel montt"
    ]
  },
  {
    "id": "m_l1_pedro_valdivia",
    "key": "m_l1_pedro_valdivia",
    "name": "Metro Pedro de Valdivia",
    "title": "Metro Pedro de Valdivia",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4249,
    "lng": -70.6111,
    "aliases": [
      "l1",
      "pedro de valdivia"
    ]
  },
  {
    "id": "m_l1_los_leones",
    "key": "m_l1_los_leones",
    "name": "Metro Los Leones",
    "title": "Metro Los Leones",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L1/L6",
    "lat": -33.4221,
    "lng": -70.6067,
    "aliases": [
      "l1",
      "l6",
      "los leones"
    ]
  },
  {
    "id": "m_l1_tobalaba",
    "key": "m_l1_tobalaba",
    "name": "Metro Tobalaba",
    "title": "Metro Tobalaba",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L1/L4",
    "lat": -33.4183,
    "lng": -70.6019,
    "aliases": [
      "l1",
      "l4",
      "tobalaba",
      "costanera center"
    ]
  },
  {
    "id": "m_l1_el_golf",
    "key": "m_l1_el_golf",
    "name": "Metro El Golf",
    "title": "Metro El Golf",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4172,
    "lng": -70.596,
    "aliases": [
      "l1",
      "el golf",
      "isidora goyenechea"
    ]
  },
  {
    "id": "m_l1_alcantara",
    "key": "m_l1_alcantara",
    "name": "Metro Alcántara",
    "title": "Metro Alcántara",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4161,
    "lng": -70.5908,
    "aliases": [
      "l1",
      "alcantara"
    ]
  },
  {
    "id": "m_l1_escuela_militar",
    "key": "m_l1_escuela_militar",
    "name": "Metro Escuela Militar",
    "title": "Metro Escuela Militar",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.415,
    "lng": -70.5847,
    "aliases": [
      "l1",
      "escuela militar",
      "subcentro"
    ]
  },
  {
    "id": "m_l1_manquehue",
    "key": "m_l1_manquehue",
    "name": "Metro Manquehue",
    "title": "Metro Manquehue",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4086,
    "lng": -70.5667,
    "aliases": [
      "l1",
      "manquehue",
      "parque araucano",
      "apumanque"
    ]
  },
  {
    "id": "m_l1_magallanes",
    "key": "m_l1_magallanes",
    "name": "Metro Hernando de Magallanes",
    "title": "Metro Hernando de Magallanes",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.4072,
    "lng": -70.5542,
    "aliases": [
      "l1",
      "hernando de magallanes"
    ]
  },
  {
    "id": "m_l1_los_dominicos",
    "key": "m_l1_los_dominicos",
    "name": "Metro Los Dominicos",
    "title": "Metro Los Dominicos",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L1",
    "lat": -33.407,
    "lng": -70.5431,
    "aliases": [
      "l1",
      "los dominicos",
      "pueblito artesanal"
    ]
  },
  {
    "id": "m_l2_vespucio_norte",
    "key": "m_l2_vespucio_norte",
    "name": "Metro Vespucio Norte",
    "title": "Metro Vespucio Norte",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.385,
    "lng": -70.6483,
    "aliases": [
      "l2",
      "vespucio norte"
    ]
  },
  {
    "id": "m_l2_zapadores",
    "key": "m_l2_zapadores",
    "name": "Metro Zapadores",
    "title": "Metro Zapadores",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.3986,
    "lng": -70.6481,
    "aliases": [
      "l2",
      "zapadores"
    ]
  },
  {
    "id": "m_l2_dorsal",
    "key": "m_l2_dorsal",
    "name": "Metro Dorsal",
    "title": "Metro Dorsal",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4069,
    "lng": -70.6478,
    "aliases": [
      "l2",
      "dorsal"
    ]
  },
  {
    "id": "m_l2_einstein",
    "key": "m_l2_einstein",
    "name": "Metro Einstein",
    "title": "Metro Einstein",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4144,
    "lng": -70.6481,
    "aliases": [
      "l2",
      "einstein"
    ]
  },
  {
    "id": "m_l2_cementerios",
    "key": "m_l2_cementerios",
    "name": "Metro Cementerios",
    "title": "Metro Cementerios",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4206,
    "lng": -70.6486,
    "aliases": [
      "l2",
      "cementerios",
      "cementerio general"
    ]
  },
  {
    "id": "m_l2_cerro_blanco",
    "key": "m_l2_cerro_blanco",
    "name": "Metro Cerro Blanco",
    "title": "Metro Cerro Blanco",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4258,
    "lng": -70.6492,
    "aliases": [
      "l2",
      "cerro blanco"
    ]
  },
  {
    "id": "m_l2_patronato",
    "key": "m_l2_patronato",
    "name": "Metro Patronato",
    "title": "Metro Patronato",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4319,
    "lng": -70.6497,
    "aliases": [
      "l2",
      "patronato",
      "barrio patronato"
    ]
  },
  {
    "id": "m_l2_cal_y_canto",
    "key": "m_l2_cal_y_canto",
    "name": "Metro Puente Cal y Canto",
    "title": "Metro Puente Cal y Canto",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L2/L3",
    "lat": -33.4339,
    "lng": -70.6517,
    "aliases": [
      "l2",
      "l3",
      "cal y canto",
      "mercado central"
    ]
  },
  {
    "id": "m_l2_santa_ana",
    "key": "m_l2_santa_ana",
    "name": "Metro Santa Ana",
    "title": "Metro Santa Ana",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L2/L5",
    "lat": -33.4389,
    "lng": -70.6586,
    "aliases": [
      "l2",
      "l5",
      "santa ana"
    ]
  },
  {
    "id": "m_l2_toesca",
    "key": "m_l2_toesca",
    "name": "Metro Toesca",
    "title": "Metro Toesca",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4528,
    "lng": -70.6592,
    "aliases": [
      "l2",
      "toesca",
      "universidades"
    ]
  },
  {
    "id": "m_l2_parque_ohiggins",
    "key": "m_l2_parque_ohiggins",
    "name": "Metro Parque O'Higgins",
    "title": "Metro Parque O'Higgins",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4619,
    "lng": -70.6578,
    "aliases": [
      "l2",
      "parque ohiggins",
      "movistar arena"
    ]
  },
  {
    "id": "m_l2_rondizzoni",
    "key": "m_l2_rondizzoni",
    "name": "Metro Rondizzoni",
    "title": "Metro Rondizzoni",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.47,
    "lng": -70.6569,
    "aliases": [
      "l2",
      "rondizzoni"
    ]
  },
  {
    "id": "m_l2_franklin",
    "key": "m_l2_franklin",
    "name": "Metro Franklin",
    "title": "Metro Franklin",
    "commune": "Santiago / San Miguel",
    "region": "Región Metropolitana",
    "category": "Metro L2/L6",
    "lat": -33.4772,
    "lng": -70.6558,
    "aliases": [
      "l2",
      "l6",
      "franklin",
      "persa franklin"
    ]
  },
  {
    "id": "m_l2_el_llano",
    "key": "m_l2_el_llano",
    "name": "Metro El Llano",
    "title": "Metro El Llano",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4839,
    "lng": -70.6528,
    "aliases": [
      "l2",
      "el llano",
      "hospital barros luco"
    ]
  },
  {
    "id": "m_l2_san_miguel",
    "key": "m_l2_san_miguel",
    "name": "Metro San Miguel",
    "title": "Metro San Miguel",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4914,
    "lng": -70.6533,
    "aliases": [
      "l2",
      "san miguel",
      "gran avenida paradero 6"
    ]
  },
  {
    "id": "m_l2_lo_vial",
    "key": "m_l2_lo_vial",
    "name": "Metro Lo Vial",
    "title": "Metro Lo Vial",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.4983,
    "lng": -70.6542,
    "aliases": [
      "l2",
      "lo vial",
      "gran avenida paradero 10"
    ]
  },
  {
    "id": "m_l2_departamental",
    "key": "m_l2_departamental",
    "name": "Metro Departamental",
    "title": "Metro Departamental",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5064,
    "lng": -70.6553,
    "aliases": [
      "l2",
      "departamental",
      "gran avenida paradero 12"
    ]
  },
  {
    "id": "m_l2_ciudad_del_nino",
    "key": "m_l2_ciudad_del_nino",
    "name": "Metro Ciudad del Niño",
    "title": "Metro Ciudad del Niño",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5133,
    "lng": -70.6567,
    "aliases": [
      "l2",
      "ciudad del nino",
      "gran avenida paradero 15"
    ]
  },
  {
    "id": "m_l2_lo_ovalle",
    "key": "m_l2_lo_ovalle",
    "name": "Metro Lo Ovalle",
    "title": "Metro Lo Ovalle",
    "commune": "La Cisterna",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5222,
    "lng": -70.6583,
    "aliases": [
      "l2",
      "lo ovalle",
      "intermodal lo ovalle"
    ]
  },
  {
    "id": "m_l2_el_parron",
    "key": "m_l2_el_parron",
    "name": "Metro El Parrón",
    "title": "Metro El Parrón",
    "commune": "La Cisterna",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5297,
    "lng": -70.6603,
    "aliases": [
      "l2",
      "el parron"
    ]
  },
  {
    "id": "m_l2_la_cisterna",
    "key": "m_l2_la_cisterna",
    "name": "Metro La Cisterna",
    "title": "Metro La Cisterna",
    "commune": "La Cisterna",
    "region": "Región Metropolitana",
    "category": "Metro L2/L4A",
    "lat": -33.5369,
    "lng": -70.6631,
    "aliases": [
      "l2",
      "l4a",
      "la cisterna",
      "intermodal la cisterna"
    ]
  },
  {
    "id": "m_l2_el_bosque",
    "key": "m_l2_el_bosque",
    "name": "Metro El Bosque",
    "title": "Metro El Bosque",
    "commune": "El Bosque",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5489,
    "lng": -70.6667,
    "aliases": [
      "l2",
      "el bosque"
    ]
  },
  {
    "id": "m_l2_observatorio",
    "key": "m_l2_observatorio",
    "name": "Metro Observatorio",
    "title": "Metro Observatorio",
    "commune": "El Bosque",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5572,
    "lng": -70.6683,
    "aliases": [
      "l2",
      "observatorio"
    ]
  },
  {
    "id": "m_l2_lo_martinez",
    "key": "m_l2_lo_martinez",
    "name": "Metro Copa Lo Martínez",
    "title": "Metro Copa Lo Martínez",
    "commune": "El Bosque",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5678,
    "lng": -70.6706,
    "aliases": [
      "l2",
      "lo martinez"
    ]
  },
  {
    "id": "m_l2_hospital_el_pino",
    "key": "m_l2_hospital_el_pino",
    "name": "Metro Hospital El Pino",
    "title": "Metro Hospital El Pino",
    "commune": "San Bernardo",
    "region": "Región Metropolitana",
    "category": "Metro L2",
    "lat": -33.5786,
    "lng": -70.6731,
    "aliases": [
      "l2",
      "hospital el pino"
    ]
  },
  {
    "id": "m_l3_plaza_quilicura",
    "key": "m_l3_plaza_quilicura",
    "name": "Metro Plaza Quilicura",
    "title": "Metro Plaza Quilicura",
    "commune": "Quilicura",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.3639,
    "lng": -70.7303,
    "aliases": [
      "l3",
      "quilicura"
    ]
  },
  {
    "id": "m_l3_lo_cruzat",
    "key": "m_l3_lo_cruzat",
    "name": "Metro Lo Cruzat",
    "title": "Metro Lo Cruzat",
    "commune": "Quilicura",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.3672,
    "lng": -70.7183,
    "aliases": [
      "l3",
      "lo cruzat"
    ]
  },
  {
    "id": "m_l3_ferrocarril",
    "key": "m_l3_ferrocarril",
    "name": "Metro Ferrocarril",
    "title": "Metro Ferrocarril",
    "commune": "Quilicura",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.3719,
    "lng": -70.7061,
    "aliases": [
      "l3",
      "ferrocarril"
    ]
  },
  {
    "id": "m_l3_los_libertadores",
    "key": "m_l3_los_libertadores",
    "name": "Metro Los Libertadores",
    "title": "Metro Los Libertadores",
    "commune": "Conchalí",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.3794,
    "lng": -70.6903,
    "aliases": [
      "l3",
      "los libertadores"
    ]
  },
  {
    "id": "m_l3_cardenal_caro",
    "key": "m_l3_cardenal_caro",
    "name": "Metro Cardenal Caro",
    "title": "Metro Cardenal Caro",
    "commune": "Conchalí",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.3886,
    "lng": -70.68,
    "aliases": [
      "l3",
      "cardenal caro"
    ]
  },
  {
    "id": "m_l3_vivaceta",
    "key": "m_l3_vivaceta",
    "name": "Metro Vivaceta",
    "title": "Metro Vivaceta",
    "commune": "Conchalí",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.3986,
    "lng": -70.6719,
    "aliases": [
      "l3",
      "vivaceta"
    ]
  },
  {
    "id": "m_l3_conchali",
    "key": "m_l3_conchali",
    "name": "Metro Conchalí",
    "title": "Metro Conchalí",
    "commune": "Conchalí",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4069,
    "lng": -70.6661,
    "aliases": [
      "l3",
      "conchali"
    ]
  },
  {
    "id": "m_l3_plaza_chacabuco",
    "key": "m_l3_plaza_chacabuco",
    "name": "Metro Plaza Chacabuco",
    "title": "Metro Plaza Chacabuco",
    "commune": "Independencia",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4161,
    "lng": -70.6586,
    "aliases": [
      "l3",
      "plaza chacabuco",
      "hipodromo chile"
    ]
  },
  {
    "id": "m_l3_hospitales",
    "key": "m_l3_hospitales",
    "name": "Metro Hospitales",
    "title": "Metro Hospitales",
    "commune": "Independencia",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4258,
    "lng": -70.6547,
    "aliases": [
      "l3",
      "hospitales",
      "hospital san jose",
      "facultad medicina"
    ]
  },
  {
    "id": "m_l3_plaza_armas",
    "key": "m_l3_plaza_armas",
    "name": "Metro Plaza de Armas",
    "title": "Metro Plaza de Armas",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L3/L5",
    "lat": -33.4383,
    "lng": -70.6508,
    "aliases": [
      "l3",
      "l5",
      "plaza de armas"
    ]
  },
  {
    "id": "m_l3_parque_almagro",
    "key": "m_l3_parque_almagro",
    "name": "Metro Parque Almagro",
    "title": "Metro Parque Almagro",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4503,
    "lng": -70.6517,
    "aliases": [
      "l3",
      "parque almagro"
    ]
  },
  {
    "id": "m_l3_matta",
    "key": "m_l3_matta",
    "name": "Metro Matta",
    "title": "Metro Matta",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4561,
    "lng": -70.645,
    "aliases": [
      "l3",
      "matta",
      "av matta"
    ]
  },
  {
    "id": "m_l3_irarrazaval",
    "key": "m_l3_irarrazaval",
    "name": "Metro Irarrázaval",
    "title": "Metro Irarrázaval",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L3/L5",
    "lat": -33.4528,
    "lng": -70.6278,
    "aliases": [
      "l3",
      "l5",
      "irarrazaval"
    ]
  },
  {
    "id": "m_l3_eyzaguirre",
    "key": "m_l3_eyzaguirre",
    "name": "Metro Monseñor Eyzaguirre",
    "title": "Metro Monseñor Eyzaguirre",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4533,
    "lng": -70.6156,
    "aliases": [
      "l3",
      "monsenor eyzaguirre"
    ]
  },
  {
    "id": "m_l3_nunoa",
    "key": "m_l3_nunoa",
    "name": "Metro Ñuñoa",
    "title": "Metro Ñuñoa",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L3/L6",
    "lat": -33.4536,
    "lng": -70.6067,
    "aliases": [
      "l3",
      "l6",
      "nunoa"
    ]
  },
  {
    "id": "m_l3_chile_espana",
    "key": "m_l3_chile_espana",
    "name": "Metro Chile España",
    "title": "Metro Chile España",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4542,
    "lng": -70.5986,
    "aliases": [
      "l3",
      "chile espana",
      "plaza nunoa"
    ]
  },
  {
    "id": "m_l3_villa_frei",
    "key": "m_l3_villa_frei",
    "name": "Metro Villa Frei",
    "title": "Metro Villa Frei",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4544,
    "lng": -70.5897,
    "aliases": [
      "l3",
      "villa frei"
    ]
  },
  {
    "id": "m_l3_plaza_egana",
    "key": "m_l3_plaza_egana",
    "name": "Metro Plaza Egaña",
    "title": "Metro Plaza Egaña",
    "commune": "Ñuñoa / La Reina",
    "region": "Región Metropolitana",
    "category": "Metro L3/L4",
    "lat": -33.4528,
    "lng": -70.5708,
    "aliases": [
      "l3",
      "l4",
      "plaza egana"
    ]
  },
  {
    "id": "m_l3_fernando_castillo",
    "key": "m_l3_fernando_castillo",
    "name": "Metro Fernando Castillo Velasco",
    "title": "Metro Fernando Castillo Velasco",
    "commune": "La Reina",
    "region": "Región Metropolitana",
    "category": "Metro L3",
    "lat": -33.4517,
    "lng": -70.5528,
    "aliases": [
      "l3",
      "fernando castillo velasco"
    ]
  },
  {
    "id": "m_l4_cristobal_colon",
    "key": "m_l4_cristobal_colon",
    "name": "Metro Cristóbal Colón",
    "title": "Metro Cristóbal Colón",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4278,
    "lng": -70.5947,
    "aliases": [
      "l4",
      "cristobal colon"
    ]
  },
  {
    "id": "m_l4_francisco_bilbao",
    "key": "m_l4_francisco_bilbao",
    "name": "Metro Francisco Bilbao",
    "title": "Metro Francisco Bilbao",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4339,
    "lng": -70.5892,
    "aliases": [
      "l4",
      "francisco bilbao"
    ]
  },
  {
    "id": "m_l4_principe_gales",
    "key": "m_l4_principe_gales",
    "name": "Metro Príncipe de Gales",
    "title": "Metro Príncipe de Gales",
    "commune": "La Reina",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4406,
    "lng": -70.5828,
    "aliases": [
      "l4",
      "principe de gales"
    ]
  },
  {
    "id": "m_l4_simon_bolivar",
    "key": "m_l4_simon_bolivar",
    "name": "Metro Simón Bolívar",
    "title": "Metro Simón Bolívar",
    "commune": "La Reina",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4472,
    "lng": -70.5767,
    "aliases": [
      "l4",
      "simon bolivar"
    ]
  },
  {
    "id": "m_l4_los_orientales",
    "key": "m_l4_los_orientales",
    "name": "Metro Los Orientales",
    "title": "Metro Los Orientales",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4608,
    "lng": -70.575,
    "aliases": [
      "l4",
      "los orientales"
    ]
  },
  {
    "id": "m_l4_grecia",
    "key": "m_l4_grecia",
    "name": "Metro Grecia",
    "title": "Metro Grecia",
    "commune": "Peñalolén",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4686,
    "lng": -70.5822,
    "aliases": [
      "l4",
      "grecia",
      "rotonda rodrigo de araya"
    ]
  },
  {
    "id": "m_l4_los_presidentes",
    "key": "m_l4_los_presidentes",
    "name": "Metro Los Presidentes",
    "title": "Metro Los Presidentes",
    "commune": "Peñalolén",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4789,
    "lng": -70.5886,
    "aliases": [
      "l4",
      "los presidentes"
    ]
  },
  {
    "id": "m_l4_quilin",
    "key": "m_l4_quilin",
    "name": "Metro Quilín",
    "title": "Metro Quilín",
    "commune": "Peñalolén / Macul",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.4897,
    "lng": -70.5944,
    "aliases": [
      "l4",
      "quilin",
      "mall quilin"
    ]
  },
  {
    "id": "m_l4_las_torres",
    "key": "m_l4_las_torres",
    "name": "Metro Las Torres",
    "title": "Metro Las Torres",
    "commune": "Peñalolén",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5019,
    "lng": -70.5975,
    "aliases": [
      "l4",
      "las torres"
    ]
  },
  {
    "id": "m_l4_macul",
    "key": "m_l4_macul",
    "name": "Metro Macul",
    "title": "Metro Macul",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5103,
    "lng": -70.5978,
    "aliases": [
      "l4",
      "macul"
    ]
  },
  {
    "id": "m_l4_vicuna_mackenna",
    "key": "m_l4_vicuna_mackenna",
    "name": "Metro Vicuña Mackenna",
    "title": "Metro Vicuña Mackenna",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L4/L4A",
    "lat": -33.5186,
    "lng": -70.5986,
    "aliases": [
      "l4",
      "l4a",
      "vicuna mackenna"
    ]
  },
  {
    "id": "m_l4_vicente_valdes",
    "key": "m_l4_vicente_valdes",
    "name": "Metro Vicente Valdés",
    "title": "Metro Vicente Valdés",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L4/L5",
    "lat": -33.5247,
    "lng": -70.5978,
    "aliases": [
      "l4",
      "l5",
      "vicente valdes"
    ]
  },
  {
    "id": "m_l4_rojas_magallanes",
    "key": "m_l4_rojas_magallanes",
    "name": "Metro Rojas Magallanes",
    "title": "Metro Rojas Magallanes",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5358,
    "lng": -70.5925,
    "aliases": [
      "l4",
      "rojas magallanes"
    ]
  },
  {
    "id": "m_l4_trinidad",
    "key": "m_l4_trinidad",
    "name": "Metro Trinidad",
    "title": "Metro Trinidad",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5461,
    "lng": -70.5892,
    "aliases": [
      "l4",
      "trinidad"
    ]
  },
  {
    "id": "m_l4_san_jose_estrella",
    "key": "m_l4_san_jose_estrella",
    "name": "Metro San José de la Estrella",
    "title": "Metro San José de la Estrella",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5539,
    "lng": -70.5878,
    "aliases": [
      "l4",
      "san jose de la estrella"
    ]
  },
  {
    "id": "m_l4_los_quillayes",
    "key": "m_l4_los_quillayes",
    "name": "Metro Los Quillayes",
    "title": "Metro Los Quillayes",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5628,
    "lng": -70.5872,
    "aliases": [
      "l4",
      "los quillayes"
    ]
  },
  {
    "id": "m_l4_elisa_correa",
    "key": "m_l4_elisa_correa",
    "name": "Metro Elisa Correa",
    "title": "Metro Elisa Correa",
    "commune": "Puente Alto",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5722,
    "lng": -70.5881,
    "aliases": [
      "l4",
      "elisa correa"
    ]
  },
  {
    "id": "m_l4_sotero_del_rio",
    "key": "m_l4_sotero_del_rio",
    "name": "Metro Hospital Sótero del Río",
    "title": "Metro Hospital Sótero del Río",
    "commune": "Puente Alto",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5828,
    "lng": -70.5894,
    "aliases": [
      "l4",
      "sotero del rio"
    ]
  },
  {
    "id": "m_l4_protectora",
    "key": "m_l4_protectora",
    "name": "Metro Protectora de la Infancia",
    "title": "Metro Protectora de la Infancia",
    "commune": "Puente Alto",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.5936,
    "lng": -70.5894,
    "aliases": [
      "l4",
      "protectora"
    ]
  },
  {
    "id": "m_l4_las_mercedes",
    "key": "m_l4_las_mercedes",
    "name": "Metro Las Mercedes",
    "title": "Metro Las Mercedes",
    "commune": "Puente Alto",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.6033,
    "lng": -70.5847,
    "aliases": [
      "l4",
      "las mercedes"
    ]
  },
  {
    "id": "m_l4_plaza_puente_alto",
    "key": "m_l4_plaza_puente_alto",
    "name": "Metro Plaza de Puente Alto",
    "title": "Metro Plaza de Puente Alto",
    "commune": "Puente Alto",
    "region": "Región Metropolitana",
    "category": "Metro L4",
    "lat": -33.6128,
    "lng": -70.5769,
    "aliases": [
      "l4",
      "plaza puente alto"
    ]
  },
  {
    "id": "m_l4a_santa_julia",
    "key": "m_l4a_santa_julia",
    "name": "Metro Santa Julia",
    "title": "Metro Santa Julia",
    "commune": "La Granja",
    "region": "Región Metropolitana",
    "category": "Metro L4A",
    "lat": -33.5286,
    "lng": -70.6139,
    "aliases": [
      "l4a",
      "santa julia"
    ]
  },
  {
    "id": "m_l4a_la_granja",
    "key": "m_l4a_la_granja",
    "name": "Metro La Granja",
    "title": "Metro La Granja",
    "commune": "La Granja",
    "region": "Región Metropolitana",
    "category": "Metro L4A",
    "lat": -33.5336,
    "lng": -70.6272,
    "aliases": [
      "l4a",
      "la granja"
    ]
  },
  {
    "id": "m_l4a_santa_rosa",
    "key": "m_l4a_santa_rosa",
    "name": "Metro Santa Rosa",
    "title": "Metro Santa Rosa",
    "commune": "San Ramón",
    "region": "Región Metropolitana",
    "category": "Metro L4A",
    "lat": -33.5361,
    "lng": -70.6403,
    "aliases": [
      "l4a",
      "santa rosa"
    ]
  },
  {
    "id": "m_l4a_san_ramon",
    "key": "m_l4a_san_ramon",
    "name": "Metro San Ramón",
    "title": "Metro San Ramón",
    "commune": "San Ramón",
    "region": "Región Metropolitana",
    "category": "Metro L4A",
    "lat": -33.5372,
    "lng": -70.6517,
    "aliases": [
      "l4a",
      "san ramon"
    ]
  },
  {
    "id": "m_l5_plaza_maipu",
    "key": "m_l5_plaza_maipu",
    "name": "Metro Plaza de Maipú",
    "title": "Metro Plaza de Maipú",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.5103,
    "lng": -70.7578,
    "aliases": [
      "l5",
      "plaza de maipu",
      "templo votivo"
    ]
  },
  {
    "id": "m_l5_santiago_bueras",
    "key": "m_l5_santiago_bueras",
    "name": "Metro Santiago Bueras",
    "title": "Metro Santiago Bueras",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.5042,
    "lng": -70.7547,
    "aliases": [
      "l5",
      "santiago bueras"
    ]
  },
  {
    "id": "m_l5_del_sol",
    "key": "m_l5_del_sol",
    "name": "Metro Del Sol",
    "title": "Metro Del Sol",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4967,
    "lng": -70.7497,
    "aliases": [
      "l5",
      "del sol",
      "autopista del sol"
    ]
  },
  {
    "id": "m_l5_monte_tabor",
    "key": "m_l5_monte_tabor",
    "name": "Metro Monte Tabor",
    "title": "Metro Monte Tabor",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4886,
    "lng": -70.7444,
    "aliases": [
      "l5",
      "monte tabor",
      "mall arauco maipu"
    ]
  },
  {
    "id": "m_l5_las_parcelas",
    "key": "m_l5_las_parcelas",
    "name": "Metro Las Parcelas",
    "title": "Metro Las Parcelas",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4797,
    "lng": -70.7397,
    "aliases": [
      "l5",
      "las parcelas"
    ]
  },
  {
    "id": "m_l5_laguna_sur",
    "key": "m_l5_laguna_sur",
    "name": "Metro Laguna Sur",
    "title": "Metro Laguna Sur",
    "commune": "Pudahuel",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4697,
    "lng": -70.735,
    "aliases": [
      "l5",
      "laguna sur"
    ]
  },
  {
    "id": "m_l5_barrancas",
    "key": "m_l5_barrancas",
    "name": "Metro Barrancas",
    "title": "Metro Barrancas",
    "commune": "Pudahuel",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4589,
    "lng": -70.7303,
    "aliases": [
      "l5",
      "barrancas"
    ]
  },
  {
    "id": "m_l5_pudahuel",
    "key": "m_l5_pudahuel",
    "name": "Metro Pudahuel",
    "title": "Metro Pudahuel",
    "commune": "Pudahuel",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4478,
    "lng": -70.7267,
    "aliases": [
      "l5",
      "pudahuel"
    ]
  },
  {
    "id": "m_l5_lo_prado",
    "key": "m_l5_lo_prado",
    "name": "Metro Lo Prado",
    "title": "Metro Lo Prado",
    "commune": "Lo Prado",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4439,
    "lng": -70.7161,
    "aliases": [
      "l5",
      "lo prado"
    ]
  },
  {
    "id": "m_l5_blanqueado",
    "key": "m_l5_blanqueado",
    "name": "Metro Blanqueado",
    "title": "Metro Blanqueado",
    "commune": "Quinta Normal",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4406,
    "lng": -70.7061,
    "aliases": [
      "l5",
      "blanqueado"
    ]
  },
  {
    "id": "m_l5_gruta_lourdes",
    "key": "m_l5_gruta_lourdes",
    "name": "Metro Gruta de Lourdes",
    "title": "Metro Gruta de Lourdes",
    "commune": "Quinta Normal",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4389,
    "lng": -70.6936,
    "aliases": [
      "l5",
      "gruta de lourdes"
    ]
  },
  {
    "id": "m_l5_quinta_normal",
    "key": "m_l5_quinta_normal",
    "name": "Metro Quinta Normal",
    "title": "Metro Quinta Normal",
    "commune": "Quinta Normal",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4394,
    "lng": -70.6806,
    "aliases": [
      "l5",
      "quinta normal",
      "matucana"
    ]
  },
  {
    "id": "m_l5_cumming",
    "key": "m_l5_cumming",
    "name": "Metro Cumming",
    "title": "Metro Cumming",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4392,
    "lng": -70.6694,
    "aliases": [
      "l5",
      "cumming",
      "barrio brasil"
    ]
  },
  {
    "id": "m_l5_bellas_artes",
    "key": "m_l5_bellas_artes",
    "name": "Metro Bellas Artes",
    "title": "Metro Bellas Artes",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4367,
    "lng": -70.6456,
    "aliases": [
      "l5",
      "bellas artes",
      "parque forestal"
    ]
  },
  {
    "id": "m_l5_bustamante",
    "key": "m_l5_bustamante",
    "name": "Metro Parque Bustamante",
    "title": "Metro Parque Bustamante",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4428,
    "lng": -70.6319,
    "aliases": [
      "l5",
      "parque bustamante"
    ]
  },
  {
    "id": "m_l5_santa_isabel",
    "key": "m_l5_santa_isabel",
    "name": "Metro Santa Isabel",
    "title": "Metro Santa Isabel",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4497,
    "lng": -70.6289,
    "aliases": [
      "l5",
      "santa isabel"
    ]
  },
  {
    "id": "m_l5_rodrigo_araya",
    "key": "m_l5_rodrigo_araya",
    "name": "Metro Rodrigo de Araya",
    "title": "Metro Rodrigo de Araya",
    "commune": "San Joaquín",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4686,
    "lng": -70.62,
    "aliases": [
      "l5",
      "rodrigo de araya"
    ]
  },
  {
    "id": "m_l5_carlos_valdovinos",
    "key": "m_l5_carlos_valdovinos",
    "name": "Metro Carlos Valdovinos",
    "title": "Metro Carlos Valdovinos",
    "commune": "San Joaquín",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4797,
    "lng": -70.6186,
    "aliases": [
      "l5",
      "carlos valdovinos"
    ]
  },
  {
    "id": "m_l5_camino_agricola",
    "key": "m_l5_camino_agricola",
    "name": "Metro Camino Agrícola",
    "title": "Metro Camino Agrícola",
    "commune": "San Joaquín",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4883,
    "lng": -70.6178,
    "aliases": [
      "l5",
      "camino agricola",
      "inacap"
    ]
  },
  {
    "id": "m_l5_san_joaquin",
    "key": "m_l5_san_joaquin",
    "name": "Metro San Joaquín",
    "title": "Metro San Joaquín",
    "commune": "San Joaquín",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.4967,
    "lng": -70.6169,
    "aliases": [
      "l5",
      "san joaquin",
      "campus san joaquin uc"
    ]
  },
  {
    "id": "m_l5_pedrero",
    "key": "m_l5_pedrero",
    "name": "Metro Pedrero",
    "title": "Metro Pedrero",
    "commune": "Macul",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.5078,
    "lng": -70.615,
    "aliases": [
      "l5",
      "pedrero",
      "estadio monumental"
    ]
  },
  {
    "id": "m_l5_mirador",
    "key": "m_l5_mirador",
    "name": "Metro Mirador",
    "title": "Metro Mirador",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.5139,
    "lng": -70.6067,
    "aliases": [
      "l5",
      "mirador",
      "mall florida center"
    ]
  },
  {
    "id": "m_l5_bellavista_florida",
    "key": "m_l5_bellavista_florida",
    "name": "Metro Bellavista de La Florida",
    "title": "Metro Bellavista de La Florida",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Metro L5",
    "lat": -33.5222,
    "lng": -70.5986,
    "aliases": [
      "l5",
      "bellavista de la florida",
      "mall plaza vespucio"
    ]
  },
  {
    "id": "m_l6_cerrillos",
    "key": "m_l6_cerrillos",
    "name": "Metro Cerrillos",
    "title": "Metro Cerrillos",
    "commune": "Cerrillos",
    "region": "Región Metropolitana",
    "category": "Metro L6",
    "lat": -33.4939,
    "lng": -70.7042,
    "aliases": [
      "l6",
      "cerrillos",
      "parque bicentenario cerrillos"
    ]
  },
  {
    "id": "m_l6_lo_valledor",
    "key": "m_l6_lo_valledor",
    "name": "Metro Lo Valledor",
    "title": "Metro Lo Valledor",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Metro L6",
    "lat": -33.4839,
    "lng": -70.6869,
    "aliases": [
      "l6",
      "lo valledor",
      "mercado lo valledor"
    ]
  },
  {
    "id": "m_l6_pac",
    "key": "m_l6_pac",
    "name": "Metro Presidente Pedro Aguirre Cerda",
    "title": "Metro Presidente Pedro Aguirre Cerda",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Metro L6",
    "lat": -33.4789,
    "lng": -70.6728,
    "aliases": [
      "l6",
      "pac",
      "club hipico"
    ]
  },
  {
    "id": "m_l6_bio_bio",
    "key": "m_l6_bio_bio",
    "name": "Metro Bío Bío",
    "title": "Metro Bío Bío",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Metro L6",
    "lat": -33.4758,
    "lng": -70.6433,
    "aliases": [
      "l6",
      "bio bio",
      "persa bio bio",
      "santa rosa"
    ]
  },
  {
    "id": "m_l6_nuble",
    "key": "m_l6_nuble",
    "name": "Metro Ñuble",
    "title": "Metro Ñuble",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L5/L6",
    "lat": -33.4667,
    "lng": -70.6267,
    "aliases": [
      "l5",
      "l6",
      "nuble"
    ]
  },
  {
    "id": "m_l6_estadio_nacional",
    "key": "m_l6_estadio_nacional",
    "name": "Metro Estadio Nacional",
    "title": "Metro Estadio Nacional",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Metro L6",
    "lat": -33.4608,
    "lng": -70.6086,
    "aliases": [
      "l6",
      "estadio nacional"
    ]
  },
  {
    "id": "m_l6_ines_suarez",
    "key": "m_l6_ines_suarez",
    "name": "Metro Inés de Suárez",
    "title": "Metro Inés de Suárez",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Metro L6",
    "lat": -33.4372,
    "lng": -70.6056,
    "aliases": [
      "l6",
      "ines de suarez",
      "parque ines de suarez"
    ]
  },
  {
    "id": "tren_alameda",
    "key": "tren_alameda",
    "name": "Estación Central Trenes (Alameda)",
    "title": "Estación Central Trenes (Alameda)",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Tren Nos",
    "lat": -33.4513,
    "lng": -70.6788,
    "aliases": [
      "tren",
      "tren nos",
      "alameda"
    ]
  },
  {
    "id": "tren_lo_valledor",
    "key": "tren_lo_valledor",
    "name": "Estación Tren Lo Valledor",
    "title": "Estación Tren Lo Valledor",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Tren Nos",
    "lat": -33.4839,
    "lng": -70.6869,
    "aliases": [
      "tren nos lo valledor"
    ]
  },
  {
    "id": "tren_pac",
    "key": "tren_pac",
    "name": "Estación Tren Pedro Aguirre Cerda",
    "title": "Estación Tren Pedro Aguirre Cerda",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Tren Nos",
    "lat": -33.4789,
    "lng": -70.6728,
    "aliases": [
      "tren nos pac"
    ]
  },
  {
    "id": "tren_san_bernardo",
    "key": "tren_san_bernardo",
    "name": "Estación Tren San Bernardo",
    "title": "Estación Tren San Bernardo",
    "commune": "San Bernardo",
    "region": "Región Metropolitana",
    "category": "Tren Nos",
    "lat": -33.593,
    "lng": -70.704,
    "aliases": [
      "tren nos san bernardo"
    ]
  },
  {
    "id": "tren_maestranza",
    "key": "tren_maestranza",
    "name": "Estación Tren Maestranza",
    "title": "Estación Tren Maestranza",
    "commune": "San Bernardo",
    "region": "Región Metropolitana",
    "category": "Tren Nos",
    "lat": -33.608,
    "lng": -70.707,
    "aliases": [
      "tren nos maestranza"
    ]
  },
  {
    "id": "tren_nos",
    "key": "tren_nos",
    "name": "Estación Tren Nos",
    "title": "Estación Tren Nos",
    "commune": "San Bernardo",
    "region": "Región Metropolitana",
    "category": "Tren Nos",
    "lat": -33.633,
    "lng": -70.713,
    "aliases": [
      "tren nos final"
    ]
  },
  {
    "id": "calle_alameda_centro",
    "key": "calle_alameda_centro",
    "name": "Av. Libertador Bernardo O'Higgins (Alameda)",
    "title": "Av. Libertador Bernardo O'Higgins (Alameda)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Avenida Principal",
    "lat": -33.4445,
    "lng": -70.6515,
    "aliases": [
      "alameda",
      "bernardo ohiggins",
      "eje central"
    ]
  },
  {
    "id": "calle_alameda_pajaritos",
    "key": "calle_alameda_pajaritos",
    "name": "Alameda con Av. Pajaritos",
    "title": "Alameda con Av. Pajaritos",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4542,
    "lng": -70.7027,
    "aliases": [
      "alameda pajaritos",
      "las rejas"
    ]
  },
  {
    "id": "calle_alameda_general_velasquez",
    "key": "calle_alameda_general_velasquez",
    "name": "Alameda con General Velásquez",
    "title": "Alameda con General Velásquez",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4533,
    "lng": -70.6946,
    "aliases": [
      "alameda general velasquez"
    ]
  },
  {
    "id": "calle_alameda_matucana",
    "key": "calle_alameda_matucana",
    "name": "Alameda con Matucana",
    "title": "Alameda con Matucana",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4513,
    "lng": -70.6788,
    "aliases": [
      "alameda matucana",
      "planetario"
    ]
  },
  {
    "id": "calle_alameda_espana",
    "key": "calle_alameda_espana",
    "name": "Alameda con Av. España",
    "title": "Alameda con Av. España",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4503,
    "lng": -70.6728,
    "aliases": [
      "alameda espana"
    ]
  },
  {
    "id": "calle_alameda_manuel_rodriguez",
    "key": "calle_alameda_manuel_rodriguez",
    "name": "Alameda con Manuel Rodríguez",
    "title": "Alameda con Manuel Rodríguez",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4478,
    "lng": -70.6608,
    "aliases": [
      "alameda manuel rodriguez",
      "autopista central"
    ]
  },
  {
    "id": "calle_alameda_morande",
    "key": "calle_alameda_morande",
    "name": "Alameda con Morandé",
    "title": "Alameda con Morandé",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.443,
    "lng": -70.6538,
    "aliases": [
      "alameda morande",
      "la moneda"
    ]
  },
  {
    "id": "calle_alameda_ahumada",
    "key": "calle_alameda_ahumada",
    "name": "Alameda con Paseo Ahumada",
    "title": "Alameda con Paseo Ahumada",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4439,
    "lng": -70.6508,
    "aliases": [
      "alameda ahumada"
    ]
  },
  {
    "id": "calle_alameda_santa_rosa",
    "key": "calle_alameda_santa_rosa",
    "name": "Alameda con Santa Rosa",
    "title": "Alameda con Santa Rosa",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.443,
    "lng": -70.645,
    "aliases": [
      "alameda santa rosa",
      "cerro santa lucia"
    ]
  },
  {
    "id": "calle_plaza_baquedano",
    "key": "calle_plaza_baquedano",
    "name": "Plaza Baquedano (Plaza Italia)",
    "title": "Plaza Baquedano (Plaza Italia)",
    "commune": "Providencia / Santiago",
    "region": "Región Metropolitana",
    "category": "Plaza / Hito",
    "lat": -33.4373,
    "lng": -70.6343,
    "aliases": [
      "plaza italia",
      "plaza dignidad",
      "baquedano"
    ]
  },
  {
    "id": "calle_providencia_salvador",
    "key": "calle_providencia_salvador",
    "name": "Av. Providencia con Av. Salvador",
    "title": "Av. Providencia con Av. Salvador",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4328,
    "lng": -70.6247,
    "aliases": [
      "providencia salvador"
    ]
  },
  {
    "id": "calle_providencia_manuel_montt",
    "key": "calle_providencia_manuel_montt",
    "name": "Av. Providencia con Manuel Montt",
    "title": "Av. Providencia con Manuel Montt",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4289,
    "lng": -70.6171,
    "aliases": [
      "providencia manuel montt"
    ]
  },
  {
    "id": "calle_providencia_pedro_valdivia",
    "key": "calle_providencia_pedro_valdivia",
    "name": "Av. Providencia con Pedro de Valdivia",
    "title": "Av. Providencia con Pedro de Valdivia",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4249,
    "lng": -70.6111,
    "aliases": [
      "providencia pedro de valdivia"
    ]
  },
  {
    "id": "calle_providencia_los_leones",
    "key": "calle_providencia_los_leones",
    "name": "Av. Providencia con Los Leones",
    "title": "Av. Providencia con Los Leones",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4221,
    "lng": -70.6067,
    "aliases": [
      "providencia los leones"
    ]
  },
  {
    "id": "calle_providencia_tobalaba",
    "key": "calle_providencia_tobalaba",
    "name": "Av. Providencia con Av. Tobalaba",
    "title": "Av. Providencia con Av. Tobalaba",
    "commune": "Providencia / Las Condes",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4183,
    "lng": -70.6019,
    "aliases": [
      "providencia tobalaba",
      "costanera"
    ]
  },
  {
    "id": "calle_apoquindo_el_bosque",
    "key": "calle_apoquindo_el_bosque",
    "name": "Av. Apoquindo con El Bosque Norte",
    "title": "Av. Apoquindo con El Bosque Norte",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4172,
    "lng": -70.596,
    "aliases": [
      "apoquindo el bosque"
    ]
  },
  {
    "id": "calle_apoquindo_escuela_militar",
    "key": "calle_apoquindo_escuela_militar",
    "name": "Av. Apoquindo con Vespucio (Escuela Militar)",
    "title": "Av. Apoquindo con Vespucio (Escuela Militar)",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.415,
    "lng": -70.5847,
    "aliases": [
      "apoquindo vespucio"
    ]
  },
  {
    "id": "calle_apoquindo_manquehue",
    "key": "calle_apoquindo_manquehue",
    "name": "Av. Apoquindo con Manquehue",
    "title": "Av. Apoquindo con Manquehue",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4086,
    "lng": -70.5667,
    "aliases": [
      "apoquindo manquehue"
    ]
  },
  {
    "id": "calle_apoquindo_tomas_moro",
    "key": "calle_apoquindo_tomas_moro",
    "name": "Av. Apoquindo con Tomás Moro",
    "title": "Av. Apoquindo con Tomás Moro",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4072,
    "lng": -70.5542,
    "aliases": [
      "apoquindo tomas moro"
    ]
  },
  {
    "id": "calle_las_condes_padre_hurtado",
    "key": "calle_las_condes_padre_hurtado",
    "name": "Av. Las Condes con Padre Hurtado",
    "title": "Av. Las Condes con Padre Hurtado",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.398,
    "lng": -70.54,
    "aliases": [
      "las condes padre hurtado"
    ]
  },
  {
    "id": "calle_las_condes_cantagallo",
    "key": "calle_las_condes_cantagallo",
    "name": "Av. Las Condes con San Carlos de Apoquindo (Cantagallo)",
    "title": "Av. Las Condes con San Carlos de Apoquindo (Cantagallo)",
    "commune": "Las Condes",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.385,
    "lng": -70.528,
    "aliases": [
      "cantagallo",
      "san carlos"
    ]
  },
  {
    "id": "calle_vitacura_alonso_cordova",
    "key": "calle_vitacura_alonso_cordova",
    "name": "Av. Vitacura con Alonso de Córdova",
    "title": "Av. Vitacura con Alonso de Córdova",
    "commune": "Vitacura",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.399,
    "lng": -70.598,
    "aliases": [
      "vitacura alonso de cordova"
    ]
  },
  {
    "id": "calle_vitacura_vespucio",
    "key": "calle_vitacura_vespucio",
    "name": "Av. Vitacura con Américo Vespucio",
    "title": "Av. Vitacura con Américo Vespucio",
    "commune": "Vitacura",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.398,
    "lng": -70.602,
    "aliases": [
      "vitacura vespucio",
      "parque bicentenario"
    ]
  },
  {
    "id": "base_pac_casa",
    "key": "base_pac_casa",
    "name": "Mi Casa / Base PAC",
    "title": "Mi Casa / Base PAC",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Base Residencial",
    "lat": -33.4851,
    "lng": -70.6698,
    "aliases": [
      "casa",
      "base pac",
      "pedro aguirre cerda"
    ]
  },
  {
    "id": "calle_pac_carlos_valdovinos",
    "key": "calle_pac_carlos_valdovinos",
    "name": "Av. Carlos Valdovinos con Club Hípico",
    "title": "Av. Carlos Valdovinos con Club Hípico",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4735,
    "lng": -70.6685,
    "aliases": [
      "carlos valdovinos club hipico"
    ]
  },
  {
    "id": "calle_pac_clotario_blest",
    "key": "calle_pac_clotario_blest",
    "name": "Av. Clotario Blest con Departamental",
    "title": "Av. Clotario Blest con Departamental",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.504,
    "lng": -70.678,
    "aliases": [
      "clotario blest departamental"
    ]
  },
  {
    "id": "calle_pac_salvador_allende",
    "key": "calle_pac_salvador_allende",
    "name": "Av. Salvador Allende (Las Rejas Sur)",
    "title": "Av. Salvador Allende (Las Rejas Sur)",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Avenida",
    "lat": -33.489,
    "lng": -70.69,
    "aliases": [
      "salvador allende pac"
    ]
  },
  {
    "id": "calle_pac_parque_jarlan",
    "key": "calle_pac_parque_jarlan",
    "name": "Parque André Jarlán (Ciclovía y Circuito Verde)",
    "title": "Parque André Jarlán (Ciclovía y Circuito Verde)",
    "commune": "Pedro Aguirre Cerda",
    "region": "Región Metropolitana",
    "category": "Parque",
    "lat": -33.4832,
    "lng": -70.6815,
    "aliases": [
      "jarlan",
      "andre jarlan"
    ]
  },
  {
    "id": "calle_sm_gran_av_valdovinos",
    "key": "calle_sm_gran_av_valdovinos",
    "name": "Gran Avenida con Carlos Valdovinos (Paradero 1)",
    "title": "Gran Avenida con Carlos Valdovinos (Paradero 1)",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4735,
    "lng": -70.6515,
    "aliases": [
      "gran avenida valdovinos"
    ]
  },
  {
    "id": "calle_sm_gran_av_salesianos",
    "key": "calle_sm_gran_av_salesianos",
    "name": "Gran Avenida con Salesianos (Paradero 8)",
    "title": "Gran Avenida con Salesianos (Paradero 8)",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.488,
    "lng": -70.653,
    "aliases": [
      "gran avenida salesianos"
    ]
  },
  {
    "id": "calle_sm_gran_av_departamental",
    "key": "calle_sm_gran_av_departamental",
    "name": "Gran Avenida con Av. Departamental (Paradero 12)",
    "title": "Gran Avenida con Av. Departamental (Paradero 12)",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.504,
    "lng": -70.656,
    "aliases": [
      "gran avenida departamental"
    ]
  },
  {
    "id": "calle_sm_gran_av_lo_ovalle",
    "key": "calle_sm_gran_av_lo_ovalle",
    "name": "Gran Avenida con Lo Ovalle (Paradero 17)",
    "title": "Gran Avenida con Lo Ovalle (Paradero 17)",
    "commune": "La Cisterna",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.5222,
    "lng": -70.6583,
    "aliases": [
      "gran avenida lo ovalle"
    ]
  },
  {
    "id": "calle_sm_santa_rosa_valdovinos",
    "key": "calle_sm_santa_rosa_valdovinos",
    "name": "Av. Santa Rosa con Carlos Valdovinos",
    "title": "Av. Santa Rosa con Carlos Valdovinos",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.474,
    "lng": -70.638,
    "aliases": [
      "santa rosa valdovinos"
    ]
  },
  {
    "id": "calle_sm_santa_rosa_departamental",
    "key": "calle_sm_santa_rosa_departamental",
    "name": "Av. Santa Rosa con Departamental",
    "title": "Av. Santa Rosa con Departamental",
    "commune": "San Miguel / La Granja",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.505,
    "lng": -70.64,
    "aliases": [
      "santa rosa departamental"
    ]
  },
  {
    "id": "calle_sm_hospital_barros_luco",
    "key": "calle_sm_hospital_barros_luco",
    "name": "Hospital Barros Luco Trudeau",
    "title": "Hospital Barros Luco Trudeau",
    "commune": "San Miguel",
    "region": "Región Metropolitana",
    "category": "Hospital",
    "lat": -33.486,
    "lng": -70.65,
    "aliases": [
      "barros luco",
      "salud"
    ]
  },
  {
    "id": "calle_stgo_san_diego_matta",
    "key": "calle_stgo_san_diego_matta",
    "name": "Calle San Diego con Av. Matta",
    "title": "Calle San Diego con Av. Matta",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.455,
    "lng": -70.65,
    "aliases": [
      "san diego matta"
    ]
  },
  {
    "id": "calle_stgo_san_diego_franklin",
    "key": "calle_stgo_san_diego_franklin",
    "name": "Calle San Diego con Franklin",
    "title": "Calle San Diego con Franklin",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.477,
    "lng": -70.65,
    "aliases": [
      "san diego franklin",
      "persa"
    ]
  },
  {
    "id": "calle_stgo_matta_santa_rosa",
    "key": "calle_stgo_matta_santa_rosa",
    "name": "Av. Matta con Av. Santa Rosa",
    "title": "Av. Matta con Av. Santa Rosa",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4555,
    "lng": -70.642,
    "aliases": [
      "matta santa rosa"
    ]
  },
  {
    "id": "calle_stgo_matta_vicuna",
    "key": "calle_stgo_matta_vicuna",
    "name": "Av. Matta con Vicuña Mackenna",
    "title": "Av. Matta con Vicuña Mackenna",
    "commune": "Santiago Centro / Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.456,
    "lng": -70.628,
    "aliases": [
      "matta vicuna mackenna"
    ]
  },
  {
    "id": "calle_stgo_blanco_beaucheff",
    "key": "calle_stgo_blanco_beaucheff",
    "name": "Av. Blanco Encalada con Beaucheff",
    "title": "Av. Blanco Encalada con Beaucheff",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.454,
    "lng": -70.662,
    "aliases": [
      "blanco beaucheff",
      "fcfm u de chile"
    ]
  },
  {
    "id": "calle_stgo_rondizzoni_beaucheff",
    "key": "calle_stgo_rondizzoni_beaucheff",
    "name": "Av. Rondizzoni con Beaucheff (Acceso Parque O'Higgins)",
    "title": "Av. Rondizzoni con Beaucheff (Acceso Parque O'Higgins)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.466,
    "lng": -70.663,
    "aliases": [
      "rondizzoni beaucheff"
    ]
  },
  {
    "id": "calle_stgo_parque_ohiggins",
    "key": "calle_stgo_parque_ohiggins",
    "name": "Parque O'Higgins (Movistar Arena / Cúpula)",
    "title": "Parque O'Higgins (Movistar Arena / Cúpula)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Parque",
    "lat": -33.465,
    "lng": -70.66,
    "aliases": [
      "parque ohiggins",
      "movistar arena"
    ]
  },
  {
    "id": "calle_stgo_plaza_armas",
    "key": "calle_stgo_plaza_armas",
    "name": "Plaza de Armas de Santiago (Km 0)",
    "title": "Plaza de Armas de Santiago (Km 0)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Centro Cívico",
    "lat": -33.4378,
    "lng": -70.6505,
    "aliases": [
      "plaza de armas",
      "catedral",
      "km 0"
    ]
  },
  {
    "id": "calle_stgo_cerro_santa_lucia",
    "key": "calle_stgo_cerro_santa_lucia",
    "name": "Cerro Santa Lucía (Castillo Hidalgo)",
    "title": "Cerro Santa Lucía (Castillo Hidalgo)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Paseo Urbano",
    "lat": -33.441,
    "lng": -70.6435,
    "aliases": [
      "santa lucia",
      "castillo hidalgo"
    ]
  },
  {
    "id": "calle_stgo_parque_forestal",
    "key": "calle_stgo_parque_forestal",
    "name": "Parque Forestal (Museo Bellas Artes)",
    "title": "Parque Forestal (Museo Bellas Artes)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Parque",
    "lat": -33.436,
    "lng": -70.64,
    "aliases": [
      "parque forestal",
      "bellas artes"
    ]
  },
  {
    "id": "calle_stgo_barrio_lastarria",
    "key": "calle_stgo_barrio_lastarria",
    "name": "Barrio Lastarria (Paseo y Gastronomía)",
    "title": "Barrio Lastarria (Paseo y Gastronomía)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Barrio Turístico",
    "lat": -33.439,
    "lng": -70.641,
    "aliases": [
      "lastarria",
      "barrio lastarria"
    ]
  },
  {
    "id": "calle_stgo_barrio_brasil",
    "key": "calle_stgo_barrio_brasil",
    "name": "Barrio Brasil (Plaza Brasil)",
    "title": "Barrio Brasil (Plaza Brasil)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Barrio Patrimonial",
    "lat": -33.44,
    "lng": -70.668,
    "aliases": [
      "barrio brasil",
      "plaza brasil"
    ]
  },
  {
    "id": "calle_stgo_barrio_yungay",
    "key": "calle_stgo_barrio_yungay",
    "name": "Barrio Yungay (Plaza Yungay)",
    "title": "Barrio Yungay (Plaza Yungay)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Barrio Patrimonial",
    "lat": -33.438,
    "lng": -70.678,
    "aliases": [
      "barrio yungay",
      "plaza yungay"
    ]
  },
  {
    "id": "calle_stgo_barrio_meiggs",
    "key": "calle_stgo_barrio_meiggs",
    "name": "Barrio Meiggs (Estación Central)",
    "title": "Barrio Meiggs (Estación Central)",
    "commune": "Estación Central",
    "region": "Región Metropolitana",
    "category": "Comercio",
    "lat": -33.451,
    "lng": -70.675,
    "aliases": [
      "meiggs",
      "barrio meiggs"
    ]
  },
  {
    "id": "calle_stgo_persa_biobio",
    "key": "calle_stgo_persa_biobio",
    "name": "Persa Bío Bío / Franklin",
    "title": "Persa Bío Bío / Franklin",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Mercado Patrimonial",
    "lat": -33.477,
    "lng": -70.646,
    "aliases": [
      "persa bio bio",
      "franklin"
    ]
  },
  {
    "id": "calle_stgo_la_vega",
    "key": "calle_stgo_la_vega",
    "name": "La Vega Central (Recoleta)",
    "title": "La Vega Central (Recoleta)",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Mercado",
    "lat": -33.431,
    "lng": -70.652,
    "aliases": [
      "la vega",
      "vega central"
    ]
  },
  {
    "id": "ciclovia_pocuro",
    "key": "ciclovia_pocuro",
    "name": "Ciclovía Pocuro (Av. Pocuro completa)",
    "title": "Ciclovía Pocuro (Av. Pocuro completa)",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Ciclovía Exclusiva",
    "lat": -33.434,
    "lng": -70.608,
    "aliases": [
      "pocuro",
      "ciclovia pocuro"
    ]
  },
  {
    "id": "ciclovia_mapocho_42k",
    "key": "ciclovia_mapocho_42k",
    "name": "Ciclovía Mapocho 42K (Ribera Río Mapocho)",
    "title": "Ciclovía Mapocho 42K (Ribera Río Mapocho)",
    "commune": "Santiago / Providencia",
    "region": "Región Metropolitana",
    "category": "Ciclovía Troncal",
    "lat": -33.435,
    "lng": -70.635,
    "aliases": [
      "mapocho 42k",
      "ciclovia mapocho"
    ]
  },
  {
    "id": "ciclovia_san_diego",
    "key": "ciclovia_san_diego",
    "name": "Ciclovía San Diego (Hacia Franklin)",
    "title": "Ciclovía San Diego (Hacia Franklin)",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Ciclovía",
    "lat": -33.455,
    "lng": -70.65,
    "aliases": [
      "ciclovia san diego"
    ]
  },
  {
    "id": "ciclovia_beaucheff",
    "key": "ciclovia_beaucheff",
    "name": "Ciclovía Beaucheff / Club Hípico",
    "title": "Ciclovía Beaucheff / Club Hípico",
    "commune": "Santiago Centro",
    "region": "Región Metropolitana",
    "category": "Ciclovía",
    "lat": -33.46,
    "lng": -70.663,
    "aliases": [
      "ciclovia beaucheff"
    ]
  },
  {
    "id": "ciclovia_pajaritos",
    "key": "ciclovia_pajaritos",
    "name": "Ciclovía Av. Pajaritos (Eje Maipú)",
    "title": "Ciclovía Av. Pajaritos (Eje Maipú)",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Ciclovía Troncal",
    "lat": -33.4967,
    "lng": -70.7497,
    "aliases": [
      "ciclovia pajaritos"
    ]
  },
  {
    "id": "ciclovia_tobalaba",
    "key": "ciclovia_tobalaba",
    "name": "Ciclovía Av. Tobalaba (Canal San Carlos)",
    "title": "Ciclovía Av. Tobalaba (Canal San Carlos)",
    "commune": "Las Condes / Providencia",
    "region": "Región Metropolitana",
    "category": "Ciclovía",
    "lat": -33.425,
    "lng": -70.6,
    "aliases": [
      "ciclovia tobalaba"
    ]
  },
  {
    "id": "calle_prov_costanera_center",
    "key": "calle_prov_costanera_center",
    "name": "Costanera Center / Sky Costanera",
    "title": "Costanera Center / Sky Costanera",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Centro Comercial",
    "lat": -33.418,
    "lng": -70.605,
    "aliases": [
      "costanera center",
      "mall"
    ]
  },
  {
    "id": "calle_prov_parque_metropolitano",
    "key": "calle_prov_parque_metropolitano",
    "name": "Parque Metropolitano (Cerro San Cristóbal - Pío Nono)",
    "title": "Parque Metropolitano (Cerro San Cristóbal - Pío Nono)",
    "commune": "Recoleta",
    "region": "Región Metropolitana",
    "category": "Parque Urbano",
    "lat": -33.432,
    "lng": -70.635,
    "aliases": [
      "san cristobal",
      "parquemet"
    ]
  },
  {
    "id": "calle_prov_pedro_valdivia_norte",
    "key": "calle_prov_pedro_valdivia_norte",
    "name": "Acceso Pedro de Valdivia Norte (Teleférico San Cristóbal)",
    "title": "Acceso Pedro de Valdivia Norte (Teleférico San Cristóbal)",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Acceso Parque",
    "lat": -33.419,
    "lng": -70.612,
    "aliases": [
      "teleferico",
      "pedro de valdivia norte"
    ]
  },
  {
    "id": "calle_prov_barrio_italia",
    "key": "calle_prov_barrio_italia",
    "name": "Barrio Italia (Av. Santa Isabel con Av. Italia)",
    "title": "Barrio Italia (Av. Santa Isabel con Av. Italia)",
    "commune": "Providencia",
    "region": "Región Metropolitana",
    "category": "Barrio Gastronómico",
    "lat": -33.447,
    "lng": -70.624,
    "aliases": [
      "barrio italia",
      "av italia"
    ]
  },
  {
    "id": "calle_nunoa_plaza",
    "key": "calle_nunoa_plaza",
    "name": "Plaza Ñuñoa (Av. Irarrázaval)",
    "title": "Plaza Ñuñoa (Av. Irarrázaval)",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Centro Cívico",
    "lat": -33.454,
    "lng": -70.598,
    "aliases": [
      "plaza nunoa",
      "irarrazaval"
    ]
  },
  {
    "id": "calle_nunoa_estadio_nacional",
    "key": "calle_nunoa_estadio_nacional",
    "name": "Estadio Nacional Julio Martínez",
    "title": "Estadio Nacional Julio Martínez",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Centro Deportivo",
    "lat": -33.465,
    "lng": -70.611,
    "aliases": [
      "estadio nacional",
      "grecia"
    ]
  },
  {
    "id": "calle_nunoa_irarrazaval_pedro",
    "key": "calle_nunoa_irarrazaval_pedro",
    "name": "Av. Irarrázaval con Pedro de Valdivia",
    "title": "Av. Irarrázaval con Pedro de Valdivia",
    "commune": "Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Intersección",
    "lat": -33.4545,
    "lng": -70.612,
    "aliases": [
      "irarrazaval pedro de valdivia"
    ]
  },
  {
    "id": "calle_reina_plaza_egana",
    "key": "calle_reina_plaza_egana",
    "name": "Plaza Egaña (Mall Plaza Egaña)",
    "title": "Plaza Egaña (Mall Plaza Egaña)",
    "commune": "La Reina / Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Centro Comercial",
    "lat": -33.4528,
    "lng": -70.5708,
    "aliases": [
      "plaza egana",
      "mall plaza egana"
    ]
  },
  {
    "id": "calle_pena_rotonda_grecia",
    "key": "calle_pena_rotonda_grecia",
    "name": "Rotonda Grecia con Américo Vespucio",
    "title": "Rotonda Grecia con Américo Vespucio",
    "commune": "Peñalolén / Ñuñoa",
    "region": "Región Metropolitana",
    "category": "Rotonda Troncal",
    "lat": -33.4686,
    "lng": -70.5822,
    "aliases": [
      "rotonda grecia",
      "grecia vespucio"
    ]
  },
  {
    "id": "calle_maipu_templo_votivo",
    "key": "calle_maipu_templo_votivo",
    "name": "Templo Votivo de Maipú",
    "title": "Templo Votivo de Maipú",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Monumento Nacional",
    "lat": -33.511,
    "lng": -70.757,
    "aliases": [
      "templo votivo",
      "santuario maipu"
    ]
  },
  {
    "id": "calle_maipu_mall_arauco",
    "key": "calle_maipu_mall_arauco",
    "name": "Mall Arauco Maipú",
    "title": "Mall Arauco Maipú",
    "commune": "Maipú",
    "region": "Región Metropolitana",
    "category": "Centro Comercial",
    "lat": -33.4886,
    "lng": -70.7444,
    "aliases": [
      "arauco maipu",
      "mall maipu"
    ]
  },
  {
    "id": "calle_florida_mall_plaza_vespucio",
    "key": "calle_florida_mall_plaza_vespucio",
    "name": "Mall Plaza Vespucio",
    "title": "Mall Plaza Vespucio",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Centro Comercial",
    "lat": -33.5222,
    "lng": -70.5986,
    "aliases": [
      "plaza vespucio",
      "la florida"
    ]
  },
  {
    "id": "calle_florida_mall_florida_center",
    "key": "calle_florida_mall_florida_center",
    "name": "Mall Florida Center",
    "title": "Mall Florida Center",
    "commune": "La Florida",
    "region": "Región Metropolitana",
    "category": "Centro Comercial",
    "lat": -33.5139,
    "lng": -70.6067,
    "aliases": [
      "florida center"
    ]
  },
  {
    "id": "calle_puente_alto_plaza",
    "key": "calle_puente_alto_plaza",
    "name": "Plaza de Puente Alto",
    "title": "Plaza de Puente Alto",
    "commune": "Puente Alto",
    "region": "Región Metropolitana",
    "category": "Centro Cívico",
    "lat": -33.6128,
    "lng": -70.5769,
    "aliases": [
      "plaza puente alto"
    ]
  },
  {
    "id": "calle_san_bernardo_plaza",
    "key": "calle_san_bernardo_plaza",
    "name": "Plaza de Armas de San Bernardo",
    "title": "Plaza de Armas de San Bernardo",
    "commune": "San Bernardo",
    "region": "Región Metropolitana",
    "category": "Centro Cívico",
    "lat": -33.593,
    "lng": -70.704,
    "aliases": [
      "plaza san bernardo"
    ]
  },
  {
    "id": "calle_aeropuerto_scl",
    "key": "calle_aeropuerto_scl",
    "name": "Aeropuerto Internacional Arturo Merino Benítez (SCL)",
    "title": "Aeropuerto Internacional Arturo Merino Benítez (SCL)",
    "commune": "Pudahuel",
    "region": "Región Metropolitana",
    "category": "Aeropuerto",
    "lat": -33.393,
    "lng": -70.7858,
    "aliases": [
      "aeropuerto santiago",
      "nuevo pudahuel",
      "vuelos"
    ]
  },
  {
    "id": "comuna_arica",
    "key": "comuna_arica",
    "name": "Comuna de Arica",
    "title": "Comuna de Arica",
    "commune": "Arica",
    "region": "Región de Arica y Parinacota",
    "category": "Comuna de Chile",
    "lat": -18.4783,
    "lng": -70.3126,
    "aliases": [
      "Arica",
      "Región de Arica y Parinacota",
      "chile"
    ]
  },
  {
    "id": "comuna_camarones",
    "key": "comuna_camarones",
    "name": "Comuna de Camarones",
    "title": "Comuna de Camarones",
    "commune": "Camarones",
    "region": "Región de Arica y Parinacota",
    "category": "Comuna de Chile",
    "lat": -19.0142,
    "lng": -69.8631,
    "aliases": [
      "Camarones",
      "Región de Arica y Parinacota",
      "chile"
    ]
  },
  {
    "id": "comuna_putre",
    "key": "comuna_putre",
    "name": "Comuna de Putre",
    "title": "Comuna de Putre",
    "commune": "Putre",
    "region": "Región de Arica y Parinacota",
    "category": "Comuna de Chile",
    "lat": -18.1964,
    "lng": -69.5594,
    "aliases": [
      "Putre",
      "Región de Arica y Parinacota",
      "chile"
    ]
  },
  {
    "id": "comuna_general_lagos",
    "key": "comuna_general_lagos",
    "name": "Comuna de General Lagos",
    "title": "Comuna de General Lagos",
    "commune": "General Lagos",
    "region": "Región de Arica y Parinacota",
    "category": "Comuna de Chile",
    "lat": -17.6569,
    "lng": -69.605,
    "aliases": [
      "General Lagos",
      "Región de Arica y Parinacota",
      "chile"
    ]
  },
  {
    "id": "comuna_iquique",
    "key": "comuna_iquique",
    "name": "Comuna de Iquique",
    "title": "Comuna de Iquique",
    "commune": "Iquique",
    "region": "Región de Tarapacá",
    "category": "Comuna de Chile",
    "lat": -20.2167,
    "lng": -70.1444,
    "aliases": [
      "Iquique",
      "Región de Tarapacá",
      "chile"
    ]
  },
  {
    "id": "comuna_alto_hospicio",
    "key": "comuna_alto_hospicio",
    "name": "Comuna de Alto Hospicio",
    "title": "Comuna de Alto Hospicio",
    "commune": "Alto Hospicio",
    "region": "Región de Tarapacá",
    "category": "Comuna de Chile",
    "lat": -20.2742,
    "lng": -70.1081,
    "aliases": [
      "Alto Hospicio",
      "Región de Tarapacá",
      "chile"
    ]
  },
  {
    "id": "comuna_pozo_almonte",
    "key": "comuna_pozo_almonte",
    "name": "Comuna de Pozo Almonte",
    "title": "Comuna de Pozo Almonte",
    "commune": "Pozo Almonte",
    "region": "Región de Tarapacá",
    "category": "Comuna de Chile",
    "lat": -20.2586,
    "lng": -69.7847,
    "aliases": [
      "Pozo Almonte",
      "Región de Tarapacá",
      "chile"
    ]
  },
  {
    "id": "comuna_pica",
    "key": "comuna_pica",
    "name": "Comuna de Pica",
    "title": "Comuna de Pica",
    "commune": "Pica",
    "region": "Región de Tarapacá",
    "category": "Comuna de Chile",
    "lat": -20.4897,
    "lng": -69.3292,
    "aliases": [
      "Pica",
      "Región de Tarapacá",
      "chile"
    ]
  },
  {
    "id": "comuna_huara",
    "key": "comuna_huara",
    "name": "Comuna de Huara",
    "title": "Comuna de Huara",
    "commune": "Huara",
    "region": "Región de Tarapacá",
    "category": "Comuna de Chile",
    "lat": -19.9958,
    "lng": -69.7711,
    "aliases": [
      "Huara",
      "Región de Tarapacá",
      "chile"
    ]
  },
  {
    "id": "comuna_camina",
    "key": "comuna_camina",
    "name": "Comuna de Camiña",
    "title": "Comuna de Camiña",
    "commune": "Camiña",
    "region": "Región de Tarapacá",
    "category": "Comuna de Chile",
    "lat": -19.3142,
    "lng": -69.4264,
    "aliases": [
      "Camiña",
      "Región de Tarapacá",
      "chile"
    ]
  },
  {
    "id": "comuna_colchane",
    "key": "comuna_colchane",
    "name": "Comuna de Colchane",
    "title": "Comuna de Colchane",
    "commune": "Colchane",
    "region": "Región de Tarapacá",
    "category": "Comuna de Chile",
    "lat": -19.2778,
    "lng": -68.6389,
    "aliases": [
      "Colchane",
      "Región de Tarapacá",
      "chile"
    ]
  },
  {
    "id": "comuna_antofagasta",
    "key": "comuna_antofagasta",
    "name": "Comuna de Antofagasta",
    "title": "Comuna de Antofagasta",
    "commune": "Antofagasta",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -23.65,
    "lng": -70.4,
    "aliases": [
      "Antofagasta",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_mejillones",
    "key": "comuna_mejillones",
    "name": "Comuna de Mejillones",
    "title": "Comuna de Mejillones",
    "commune": "Mejillones",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -23.1042,
    "lng": -70.4503,
    "aliases": [
      "Mejillones",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_sierra_gorda",
    "key": "comuna_sierra_gorda",
    "name": "Comuna de Sierra Gorda",
    "title": "Comuna de Sierra Gorda",
    "commune": "Sierra Gorda",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -22.8942,
    "lng": -69.3183,
    "aliases": [
      "Sierra Gorda",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_taltal",
    "key": "comuna_taltal",
    "name": "Comuna de Taltal",
    "title": "Comuna de Taltal",
    "commune": "Taltal",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -25.4072,
    "lng": -70.4819,
    "aliases": [
      "Taltal",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_calama",
    "key": "comuna_calama",
    "name": "Comuna de Calama",
    "title": "Comuna de Calama",
    "commune": "Calama",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -22.4544,
    "lng": -68.9294,
    "aliases": [
      "Calama",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_ollagüe",
    "key": "comuna_ollagüe",
    "name": "Comuna de Ollagüe",
    "title": "Comuna de Ollagüe",
    "commune": "Ollagüe",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -21.2222,
    "lng": -68.2528,
    "aliases": [
      "Ollagüe",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_san_pedro_de_atacama",
    "key": "comuna_san_pedro_de_atacama",
    "name": "Comuna de San Pedro de Atacama",
    "title": "Comuna de San Pedro de Atacama",
    "commune": "San Pedro de Atacama",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -22.9114,
    "lng": -68.1994,
    "aliases": [
      "San Pedro de Atacama",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_tocopilla",
    "key": "comuna_tocopilla",
    "name": "Comuna de Tocopilla",
    "title": "Comuna de Tocopilla",
    "commune": "Tocopilla",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -22.0919,
    "lng": -70.1978,
    "aliases": [
      "Tocopilla",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_maría_elena",
    "key": "comuna_maría_elena",
    "name": "Comuna de María Elena",
    "title": "Comuna de María Elena",
    "commune": "María Elena",
    "region": "Región de Antofagasta",
    "category": "Comuna de Chile",
    "lat": -22.3458,
    "lng": -69.6639,
    "aliases": [
      "María Elena",
      "Región de Antofagasta",
      "chile"
    ]
  },
  {
    "id": "comuna_copiapó",
    "key": "comuna_copiapó",
    "name": "Comuna de Copiapó",
    "title": "Comuna de Copiapó",
    "commune": "Copiapó",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -27.3667,
    "lng": -70.3333,
    "aliases": [
      "Copiapó",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_caldera",
    "key": "comuna_caldera",
    "name": "Comuna de Caldera",
    "title": "Comuna de Caldera",
    "commune": "Caldera",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -27.0678,
    "lng": -70.8208,
    "aliases": [
      "Caldera",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_tierra_amarilla",
    "key": "comuna_tierra_amarilla",
    "name": "Comuna de Tierra Amarilla",
    "title": "Comuna de Tierra Amarilla",
    "commune": "Tierra Amarilla",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -27.4819,
    "lng": -70.2647,
    "aliases": [
      "Tierra Amarilla",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_chanaral",
    "key": "comuna_chanaral",
    "name": "Comuna de Chañaral",
    "title": "Comuna de Chañaral",
    "commune": "Chañaral",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -26.3478,
    "lng": -70.6222,
    "aliases": [
      "Chañaral",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_diego_de_almagro",
    "key": "comuna_diego_de_almagro",
    "name": "Comuna de Diego de Almagro",
    "title": "Comuna de Diego de Almagro",
    "commune": "Diego de Almagro",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -26.3917,
    "lng": -70.0478,
    "aliases": [
      "Diego de Almagro",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_vallenar",
    "key": "comuna_vallenar",
    "name": "Comuna de Vallenar",
    "title": "Comuna de Vallenar",
    "commune": "Vallenar",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -28.575,
    "lng": -70.7583,
    "aliases": [
      "Vallenar",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_alto_del_carmen",
    "key": "comuna_alto_del_carmen",
    "name": "Comuna de Alto del Carmen",
    "title": "Comuna de Alto del Carmen",
    "commune": "Alto del Carmen",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -28.7589,
    "lng": -70.4861,
    "aliases": [
      "Alto del Carmen",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_freirina",
    "key": "comuna_freirina",
    "name": "Comuna de Freirina",
    "title": "Comuna de Freirina",
    "commune": "Freirina",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -28.5083,
    "lng": -71.0778,
    "aliases": [
      "Freirina",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_huasco",
    "key": "comuna_huasco",
    "name": "Comuna de Huasco",
    "title": "Comuna de Huasco",
    "commune": "Huasco",
    "region": "Región de Atacama",
    "category": "Comuna de Chile",
    "lat": -28.4681,
    "lng": -71.2197,
    "aliases": [
      "Huasco",
      "Región de Atacama",
      "chile"
    ]
  },
  {
    "id": "comuna_la_serena",
    "key": "comuna_la_serena",
    "name": "Comuna de La Serena",
    "title": "Comuna de La Serena",
    "commune": "La Serena",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -29.9027,
    "lng": -71.2519,
    "aliases": [
      "La Serena",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_coquimbo",
    "key": "comuna_coquimbo",
    "name": "Comuna de Coquimbo",
    "title": "Comuna de Coquimbo",
    "commune": "Coquimbo",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -29.9533,
    "lng": -71.3436,
    "aliases": [
      "Coquimbo",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_andacollo",
    "key": "comuna_andacollo",
    "name": "Comuna de Andacollo",
    "title": "Comuna de Andacollo",
    "commune": "Andacollo",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -30.2319,
    "lng": -71.085,
    "aliases": [
      "Andacollo",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_la_higuera",
    "key": "comuna_la_higuera",
    "name": "Comuna de La Higuera",
    "title": "Comuna de La Higuera",
    "commune": "La Higuera",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -29.5103,
    "lng": -71.1994,
    "aliases": [
      "La Higuera",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_paihuano",
    "key": "comuna_paihuano",
    "name": "Comuna de Paihuano",
    "title": "Comuna de Paihuano",
    "commune": "Paihuano",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -30.0306,
    "lng": -70.5222,
    "aliases": [
      "Paihuano",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_vicuna",
    "key": "comuna_vicuna",
    "name": "Comuna de Vicuña",
    "title": "Comuna de Vicuña",
    "commune": "Vicuña",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -30.0319,
    "lng": -70.7081,
    "aliases": [
      "Vicuña",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_ovalle",
    "key": "comuna_ovalle",
    "name": "Comuna de Ovalle",
    "title": "Comuna de Ovalle",
    "commune": "Ovalle",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -30.5983,
    "lng": -71.2003,
    "aliases": [
      "Ovalle",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_combarbalá",
    "key": "comuna_combarbalá",
    "name": "Comuna de Combarbalá",
    "title": "Comuna de Combarbalá",
    "commune": "Combarbalá",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -31.1794,
    "lng": -71.0028,
    "aliases": [
      "Combarbalá",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_monte_patria",
    "key": "comuna_monte_patria",
    "name": "Comuna de Monte Patria",
    "title": "Comuna de Monte Patria",
    "commune": "Monte Patria",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -30.6958,
    "lng": -70.9572,
    "aliases": [
      "Monte Patria",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_punitaqui",
    "key": "comuna_punitaqui",
    "name": "Comuna de Punitaqui",
    "title": "Comuna de Punitaqui",
    "commune": "Punitaqui",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -30.8294,
    "lng": -71.2569,
    "aliases": [
      "Punitaqui",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_río_hurtado",
    "key": "comuna_río_hurtado",
    "name": "Comuna de Río Hurtado",
    "title": "Comuna de Río Hurtado",
    "commune": "Río Hurtado",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -30.2778,
    "lng": -70.6722,
    "aliases": [
      "Río Hurtado",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_illapel",
    "key": "comuna_illapel",
    "name": "Comuna de Illapel",
    "title": "Comuna de Illapel",
    "commune": "Illapel",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -31.6308,
    "lng": -71.1653,
    "aliases": [
      "Illapel",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_canela",
    "key": "comuna_canela",
    "name": "Comuna de Canela",
    "title": "Comuna de Canela",
    "commune": "Canela",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -31.3986,
    "lng": -71.4586,
    "aliases": [
      "Canela",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_los_vilos",
    "key": "comuna_los_vilos",
    "name": "Comuna de Los Vilos",
    "title": "Comuna de Los Vilos",
    "commune": "Los Vilos",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -31.9136,
    "lng": -71.5136,
    "aliases": [
      "Los Vilos",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_salamanca",
    "key": "comuna_salamanca",
    "name": "Comuna de Salamanca",
    "title": "Comuna de Salamanca",
    "commune": "Salamanca",
    "region": "Región de Coquimbo",
    "category": "Comuna de Chile",
    "lat": -31.7789,
    "lng": -70.9639,
    "aliases": [
      "Salamanca",
      "Región de Coquimbo",
      "chile"
    ]
  },
  {
    "id": "comuna_valparaíso",
    "key": "comuna_valparaíso",
    "name": "Comuna de Valparaíso",
    "title": "Comuna de Valparaíso",
    "commune": "Valparaíso",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.0472,
    "lng": -71.6128,
    "aliases": [
      "Valparaíso",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_vina_del_mar",
    "key": "comuna_vina_del_mar",
    "name": "Comuna de Viña del Mar",
    "title": "Comuna de Viña del Mar",
    "commune": "Viña del Mar",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.0245,
    "lng": -71.5518,
    "aliases": [
      "Viña del Mar",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_concón",
    "key": "comuna_concón",
    "name": "Comuna de Concón",
    "title": "Comuna de Concón",
    "commune": "Concón",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.9228,
    "lng": -71.5178,
    "aliases": [
      "Concón",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_quilpué",
    "key": "comuna_quilpué",
    "name": "Comuna de Quilpué",
    "title": "Comuna de Quilpué",
    "commune": "Quilpué",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.0494,
    "lng": -71.4428,
    "aliases": [
      "Quilpué",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_villa_alemana",
    "key": "comuna_villa_alemana",
    "name": "Comuna de Villa Alemana",
    "title": "Comuna de Villa Alemana",
    "commune": "Villa Alemana",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.0428,
    "lng": -71.3736,
    "aliases": [
      "Villa Alemana",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_limache",
    "key": "comuna_limache",
    "name": "Comuna de Limache",
    "title": "Comuna de Limache",
    "commune": "Limache",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.9867,
    "lng": -71.2678,
    "aliases": [
      "Limache",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_olmué",
    "key": "comuna_olmué",
    "name": "Comuna de Olmué",
    "title": "Comuna de Olmué",
    "commune": "Olmué",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.9989,
    "lng": -71.1869,
    "aliases": [
      "Olmué",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_quillota",
    "key": "comuna_quillota",
    "name": "Comuna de Quillota",
    "title": "Comuna de Quillota",
    "commune": "Quillota",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.8803,
    "lng": -71.2486,
    "aliases": [
      "Quillota",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_la_calera",
    "key": "comuna_la_calera",
    "name": "Comuna de La Calera",
    "title": "Comuna de La Calera",
    "commune": "La Calera",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7878,
    "lng": -71.1917,
    "aliases": [
      "La Calera",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_nogales",
    "key": "comuna_nogales",
    "name": "Comuna de Nogales",
    "title": "Comuna de Nogales",
    "commune": "Nogales",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7369,
    "lng": -71.1994,
    "aliases": [
      "Nogales",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_hijuelas",
    "key": "comuna_hijuelas",
    "name": "Comuna de Hijuelas",
    "title": "Comuna de Hijuelas",
    "commune": "Hijuelas",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7958,
    "lng": -71.1444,
    "aliases": [
      "Hijuelas",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_la_cruz",
    "key": "comuna_la_cruz",
    "name": "Comuna de La Cruz",
    "title": "Comuna de La Cruz",
    "commune": "La Cruz",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.8278,
    "lng": -71.2289,
    "aliases": [
      "La Cruz",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_san_antonio",
    "key": "comuna_san_antonio",
    "name": "Comuna de San Antonio",
    "title": "Comuna de San Antonio",
    "commune": "San Antonio",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.5936,
    "lng": -71.6178,
    "aliases": [
      "San Antonio",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_cartagena",
    "key": "comuna_cartagena",
    "name": "Comuna de Cartagena",
    "title": "Comuna de Cartagena",
    "commune": "Cartagena",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.5539,
    "lng": -71.6083,
    "aliases": [
      "Cartagena",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_el_tabo",
    "key": "comuna_el_tabo",
    "name": "Comuna de El Tabo",
    "title": "Comuna de El Tabo",
    "commune": "El Tabo",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.4542,
    "lng": -71.6669,
    "aliases": [
      "El Tabo",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_el_quisco",
    "key": "comuna_el_quisco",
    "name": "Comuna de El Quisco",
    "title": "Comuna de El Quisco",
    "commune": "El Quisco",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.3986,
    "lng": -71.6978,
    "aliases": [
      "El Quisco",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_algarrobo",
    "key": "comuna_algarrobo",
    "name": "Comuna de Algarrobo",
    "title": "Comuna de Algarrobo",
    "commune": "Algarrobo",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.3686,
    "lng": -71.6681,
    "aliases": [
      "Algarrobo",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_santo_domingo",
    "key": "comuna_santo_domingo",
    "name": "Comuna de Santo Domingo",
    "title": "Comuna de Santo Domingo",
    "commune": "Santo Domingo",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.6369,
    "lng": -71.6289,
    "aliases": [
      "Santo Domingo",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_casablanca",
    "key": "comuna_casablanca",
    "name": "Comuna de Casablanca",
    "title": "Comuna de Casablanca",
    "commune": "Casablanca",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.3189,
    "lng": -71.4089,
    "aliases": [
      "Casablanca",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_san_felipe",
    "key": "comuna_san_felipe",
    "name": "Comuna de San Felipe",
    "title": "Comuna de San Felipe",
    "commune": "San Felipe",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7508,
    "lng": -70.7256,
    "aliases": [
      "San Felipe",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_llay-llay",
    "key": "comuna_llay-llay",
    "name": "Comuna de Llay-Llay",
    "title": "Comuna de Llay-Llay",
    "commune": "Llay-Llay",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.8428,
    "lng": -70.9572,
    "aliases": [
      "Llay-Llay",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_catemu",
    "key": "comuna_catemu",
    "name": "Comuna de Catemu",
    "title": "Comuna de Catemu",
    "commune": "Catemu",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7789,
    "lng": -70.9639,
    "aliases": [
      "Catemu",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_panquehue",
    "key": "comuna_panquehue",
    "name": "Comuna de Panquehue",
    "title": "Comuna de Panquehue",
    "commune": "Panquehue",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7667,
    "lng": -70.8333,
    "aliases": [
      "Panquehue",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_putaendo",
    "key": "comuna_putaendo",
    "name": "Comuna de Putaendo",
    "title": "Comuna de Putaendo",
    "commune": "Putaendo",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.6289,
    "lng": -70.7169,
    "aliases": [
      "Putaendo",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_santa_maría",
    "key": "comuna_santa_maría",
    "name": "Comuna de Santa María",
    "title": "Comuna de Santa María",
    "commune": "Santa María",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7489,
    "lng": -70.6578,
    "aliases": [
      "Santa María",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_los_andes",
    "key": "comuna_los_andes",
    "name": "Comuna de Los Andes",
    "title": "Comuna de Los Andes",
    "commune": "Los Andes",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.8339,
    "lng": -70.5983,
    "aliases": [
      "Los Andes",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_calle_larga",
    "key": "comuna_calle_larga",
    "name": "Comuna de Calle Larga",
    "title": "Comuna de Calle Larga",
    "commune": "Calle Larga",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.8572,
    "lng": -70.6267,
    "aliases": [
      "Calle Larga",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_rinconada",
    "key": "comuna_rinconada",
    "name": "Comuna de Rinconada",
    "title": "Comuna de Rinconada",
    "commune": "Rinconada",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.8689,
    "lng": -70.7028,
    "aliases": [
      "Rinconada",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_san_esteban",
    "key": "comuna_san_esteban",
    "name": "Comuna de San Esteban",
    "title": "Comuna de San Esteban",
    "commune": "San Esteban",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.8028,
    "lng": -70.5806,
    "aliases": [
      "San Esteban",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_la_ligua",
    "key": "comuna_la_ligua",
    "name": "Comuna de La Ligua",
    "title": "Comuna de La Ligua",
    "commune": "La Ligua",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.4519,
    "lng": -71.2319,
    "aliases": [
      "La Ligua",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_cabildo",
    "key": "comuna_cabildo",
    "name": "Comuna de Cabildo",
    "title": "Comuna de Cabildo",
    "commune": "Cabildo",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.4289,
    "lng": -71.0667,
    "aliases": [
      "Cabildo",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_papudo",
    "key": "comuna_papudo",
    "name": "Comuna de Papudo",
    "title": "Comuna de Papudo",
    "commune": "Papudo",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.5089,
    "lng": -71.4503,
    "aliases": [
      "Papudo",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_zapallar",
    "key": "comuna_zapallar",
    "name": "Comuna de Zapallar",
    "title": "Comuna de Zapallar",
    "commune": "Zapallar",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.5539,
    "lng": -71.4603,
    "aliases": [
      "Zapallar",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_puchuncaví",
    "key": "comuna_puchuncaví",
    "name": "Comuna de Puchuncaví",
    "title": "Comuna de Puchuncaví",
    "commune": "Puchuncaví",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7239,
    "lng": -71.415,
    "aliases": [
      "Puchuncaví",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_quintero",
    "key": "comuna_quintero",
    "name": "Comuna de Quintero",
    "title": "Comuna de Quintero",
    "commune": "Quintero",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.7842,
    "lng": -71.5328,
    "aliases": [
      "Quintero",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_petorca",
    "key": "comuna_petorca",
    "name": "Comuna de Petorca",
    "title": "Comuna de Petorca",
    "commune": "Petorca",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -32.2539,
    "lng": -70.9328,
    "aliases": [
      "Petorca",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_isla_de_pascua_rapa_nui",
    "key": "comuna_isla_de_pascua_rapa_nui",
    "name": "Comuna de Isla de Pascua (Rapa Nui)",
    "title": "Comuna de Isla de Pascua (Rapa Nui)",
    "commune": "Isla de Pascua (Rapa Nui)",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -27.1128,
    "lng": -109.3497,
    "aliases": [
      "Isla de Pascua (Rapa Nui)",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_juan_fernández",
    "key": "comuna_juan_fernández",
    "name": "Comuna de Juan Fernández",
    "title": "Comuna de Juan Fernández",
    "commune": "Juan Fernández",
    "region": "Región de Valparaíso",
    "category": "Comuna de Chile",
    "lat": -33.6361,
    "lng": -78.8319,
    "aliases": [
      "Juan Fernández",
      "Región de Valparaíso",
      "chile"
    ]
  },
  {
    "id": "comuna_rancagua",
    "key": "comuna_rancagua",
    "name": "Comuna de Rancagua",
    "title": "Comuna de Rancagua",
    "commune": "Rancagua",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.1708,
    "lng": -70.7444,
    "aliases": [
      "Rancagua",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_machalí",
    "key": "comuna_machalí",
    "name": "Comuna de Machalí",
    "title": "Comuna de Machalí",
    "commune": "Machalí",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.1819,
    "lng": -70.6517,
    "aliases": [
      "Machalí",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_graneros",
    "key": "comuna_graneros",
    "name": "Comuna de Graneros",
    "title": "Comuna de Graneros",
    "commune": "Graneros",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.0667,
    "lng": -70.725,
    "aliases": [
      "Graneros",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_mostazal",
    "key": "comuna_mostazal",
    "name": "Comuna de Mostazal",
    "title": "Comuna de Mostazal",
    "commune": "Mostazal",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -33.9897,
    "lng": -70.7081,
    "aliases": [
      "Mostazal",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_codegua",
    "key": "comuna_codegua",
    "name": "Comuna de Codegua",
    "title": "Comuna de Codegua",
    "commune": "Codegua",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.0369,
    "lng": -70.6694,
    "aliases": [
      "Codegua",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_donihue",
    "key": "comuna_donihue",
    "name": "Comuna de Doñihue",
    "title": "Comuna de Doñihue",
    "commune": "Doñihue",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.2278,
    "lng": -70.9639,
    "aliases": [
      "Doñihue",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_coltauco",
    "key": "comuna_coltauco",
    "name": "Comuna de Coltauco",
    "title": "Comuna de Coltauco",
    "commune": "Coltauco",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.2778,
    "lng": -71.0778,
    "aliases": [
      "Coltauco",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_rengo",
    "key": "comuna_rengo",
    "name": "Comuna de Rengo",
    "title": "Comuna de Rengo",
    "commune": "Rengo",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.4072,
    "lng": -70.8586,
    "aliases": [
      "Rengo",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_malloa",
    "key": "comuna_malloa",
    "name": "Comuna de Malloa",
    "title": "Comuna de Malloa",
    "commune": "Malloa",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.4444,
    "lng": -70.9444,
    "aliases": [
      "Malloa",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_quinta_de_tilcoco",
    "key": "comuna_quinta_de_tilcoco",
    "name": "Comuna de Quinta de Tilcoco",
    "title": "Comuna de Quinta de Tilcoco",
    "commune": "Quinta de Tilcoco",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.3542,
    "lng": -71.0569,
    "aliases": [
      "Quinta de Tilcoco",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_san_vicente_de_tagua_tagua",
    "key": "comuna_san_vicente_de_tagua_tagua",
    "name": "Comuna de San Vicente de Tagua Tagua",
    "title": "Comuna de San Vicente de Tagua Tagua",
    "commune": "San Vicente de Tagua Tagua",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.4397,
    "lng": -71.0767,
    "aliases": [
      "San Vicente de Tagua Tagua",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_pichidegua",
    "key": "comuna_pichidegua",
    "name": "Comuna de Pichidegua",
    "title": "Comuna de Pichidegua",
    "commune": "Pichidegua",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.3542,
    "lng": -71.2828,
    "aliases": [
      "Pichidegua",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_peumo",
    "key": "comuna_peumo",
    "name": "Comuna de Peumo",
    "title": "Comuna de Peumo",
    "commune": "Peumo",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.3942,
    "lng": -71.1686,
    "aliases": [
      "Peumo",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_las_cabras",
    "key": "comuna_las_cabras",
    "name": "Comuna de Las Cabras",
    "title": "Comuna de Las Cabras",
    "commune": "Las Cabras",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.2903,
    "lng": -71.3069,
    "aliases": [
      "Las Cabras",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_san_fernando",
    "key": "comuna_san_fernando",
    "name": "Comuna de San Fernando",
    "title": "Comuna de San Fernando",
    "commune": "San Fernando",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.5842,
    "lng": -70.9889,
    "aliases": [
      "San Fernando",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_chimbarongo",
    "key": "comuna_chimbarongo",
    "name": "Comuna de Chimbarongo",
    "title": "Comuna de Chimbarongo",
    "commune": "Chimbarongo",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.7083,
    "lng": -71.0417,
    "aliases": [
      "Chimbarongo",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_placilla",
    "key": "comuna_placilla",
    "name": "Comuna de Placilla",
    "title": "Comuna de Placilla",
    "commune": "Placilla",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.6369,
    "lng": -71.1219,
    "aliases": [
      "Placilla",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_nancagua",
    "key": "comuna_nancagua",
    "name": "Comuna de Nancagua",
    "title": "Comuna de Nancagua",
    "commune": "Nancagua",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.6667,
    "lng": -71.2,
    "aliases": [
      "Nancagua",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_chépica",
    "key": "comuna_chépica",
    "name": "Comuna de Chépica",
    "title": "Comuna de Chépica",
    "commune": "Chépica",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.7278,
    "lng": -71.2778,
    "aliases": [
      "Chépica",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_santa_cruz",
    "key": "comuna_santa_cruz",
    "name": "Comuna de Santa Cruz",
    "title": "Comuna de Santa Cruz",
    "commune": "Santa Cruz",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.6389,
    "lng": -71.3639,
    "aliases": [
      "Santa Cruz",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_lolol",
    "key": "comuna_lolol",
    "name": "Comuna de Lolol",
    "title": "Comuna de Lolol",
    "commune": "Lolol",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.7278,
    "lng": -71.6444,
    "aliases": [
      "Lolol",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_pumanque",
    "key": "comuna_pumanque",
    "name": "Comuna de Pumanque",
    "title": "Comuna de Pumanque",
    "commune": "Pumanque",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.5986,
    "lng": -71.6739,
    "aliases": [
      "Pumanque",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_palmilla",
    "key": "comuna_palmilla",
    "name": "Comuna de Palmilla",
    "title": "Comuna de Palmilla",
    "commune": "Palmilla",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.5986,
    "lng": -71.3542,
    "aliases": [
      "Palmilla",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_peralillo",
    "key": "comuna_peralillo",
    "name": "Comuna de Peralillo",
    "title": "Comuna de Peralillo",
    "commune": "Peralillo",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.4842,
    "lng": -71.4889,
    "aliases": [
      "Peralillo",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_pichilemu",
    "key": "comuna_pichilemu",
    "name": "Comuna de Pichilemu",
    "title": "Comuna de Pichilemu",
    "commune": "Pichilemu",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.3869,
    "lng": -72.0047,
    "aliases": [
      "Pichilemu",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_navidad",
    "key": "comuna_navidad",
    "name": "Comuna de Navidad",
    "title": "Comuna de Navidad",
    "commune": "Navidad",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -33.9539,
    "lng": -71.8319,
    "aliases": [
      "Navidad",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_litueche",
    "key": "comuna_litueche",
    "name": "Comuna de Litueche",
    "title": "Comuna de Litueche",
    "commune": "Litueche",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.1167,
    "lng": -71.7333,
    "aliases": [
      "Litueche",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_la_estrella",
    "key": "comuna_la_estrella",
    "name": "Comuna de La Estrella",
    "title": "Comuna de La Estrella",
    "commune": "La Estrella",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.2042,
    "lng": -71.6519,
    "aliases": [
      "La Estrella",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_marchigüe",
    "key": "comuna_marchigüe",
    "name": "Comuna de Marchigüe",
    "title": "Comuna de Marchigüe",
    "commune": "Marchigüe",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.3986,
    "lng": -71.6219,
    "aliases": [
      "Marchigüe",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_paredones",
    "key": "comuna_paredones",
    "name": "Comuna de Paredones",
    "title": "Comuna de Paredones",
    "commune": "Paredones",
    "region": "Región de O'Higgins",
    "category": "Comuna de Chile",
    "lat": -34.6508,
    "lng": -71.9028,
    "aliases": [
      "Paredones",
      "Región de O'Higgins",
      "chile"
    ]
  },
  {
    "id": "comuna_talca",
    "key": "comuna_talca",
    "name": "Comuna de Talca",
    "title": "Comuna de Talca",
    "commune": "Talca",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -35.4264,
    "lng": -71.6554,
    "aliases": [
      "Talca",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_constitución",
    "key": "comuna_constitución",
    "name": "Comuna de Constitución",
    "title": "Comuna de Constitución",
    "commune": "Constitución",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -35.3333,
    "lng": -72.4167,
    "aliases": [
      "Constitución",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_curicó",
    "key": "comuna_curicó",
    "name": "Comuna de Curicó",
    "title": "Comuna de Curicó",
    "commune": "Curicó",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -34.9833,
    "lng": -71.2333,
    "aliases": [
      "Curicó",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_linares",
    "key": "comuna_linares",
    "name": "Comuna de Linares",
    "title": "Comuna de Linares",
    "commune": "Linares",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -35.8458,
    "lng": -71.5978,
    "aliases": [
      "Linares",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_cauquenes",
    "key": "comuna_cauquenes",
    "name": "Comuna de Cauquenes",
    "title": "Comuna de Cauquenes",
    "commune": "Cauquenes",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -35.9678,
    "lng": -72.3158,
    "aliases": [
      "Cauquenes",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_molina",
    "key": "comuna_molina",
    "name": "Comuna de Molina",
    "title": "Comuna de Molina",
    "commune": "Molina",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -35.1142,
    "lng": -71.2828,
    "aliases": [
      "Molina",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_parral",
    "key": "comuna_parral",
    "name": "Comuna de Parral",
    "title": "Comuna de Parral",
    "commune": "Parral",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -36.1433,
    "lng": -71.8267,
    "aliases": [
      "Parral",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_san_javier",
    "key": "comuna_san_javier",
    "name": "Comuna de San Javier",
    "title": "Comuna de San Javier",
    "commune": "San Javier",
    "region": "Región del Maule",
    "category": "Comuna de Chile",
    "lat": -35.5942,
    "lng": -71.7333,
    "aliases": [
      "San Javier",
      "Región del Maule",
      "chile"
    ]
  },
  {
    "id": "comuna_chillán",
    "key": "comuna_chillán",
    "name": "Comuna de Chillán",
    "title": "Comuna de Chillán",
    "commune": "Chillán",
    "region": "Región de Ñuble",
    "category": "Comuna de Chile",
    "lat": -36.6067,
    "lng": -72.1033,
    "aliases": [
      "Chillán",
      "Región de Ñuble",
      "chile"
    ]
  },
  {
    "id": "comuna_chillán_viejo",
    "key": "comuna_chillán_viejo",
    "name": "Comuna de Chillán Viejo",
    "title": "Comuna de Chillán Viejo",
    "commune": "Chillán Viejo",
    "region": "Región de Ñuble",
    "category": "Comuna de Chile",
    "lat": -36.6267,
    "lng": -72.1333,
    "aliases": [
      "Chillán Viejo",
      "Región de Ñuble",
      "chile"
    ]
  },
  {
    "id": "comuna_san_carlos",
    "key": "comuna_san_carlos",
    "name": "Comuna de San Carlos",
    "title": "Comuna de San Carlos",
    "commune": "San Carlos",
    "region": "Región de Ñuble",
    "category": "Comuna de Chile",
    "lat": -36.4242,
    "lng": -71.9583,
    "aliases": [
      "San Carlos",
      "Región de Ñuble",
      "chile"
    ]
  },
  {
    "id": "comuna_bulnes",
    "key": "comuna_bulnes",
    "name": "Comuna de Bulnes",
    "title": "Comuna de Bulnes",
    "commune": "Bulnes",
    "region": "Región de Ñuble",
    "category": "Comuna de Chile",
    "lat": -36.7419,
    "lng": -72.2986,
    "aliases": [
      "Bulnes",
      "Región de Ñuble",
      "chile"
    ]
  },
  {
    "id": "comuna_quillón",
    "key": "comuna_quillón",
    "name": "Comuna de Quillón",
    "title": "Comuna de Quillón",
    "commune": "Quillón",
    "region": "Región de Ñuble",
    "category": "Comuna de Chile",
    "lat": -36.7444,
    "lng": -72.4778,
    "aliases": [
      "Quillón",
      "Región de Ñuble",
      "chile"
    ]
  },
  {
    "id": "comuna_cobquecura",
    "key": "comuna_cobquecura",
    "name": "Comuna de Cobquecura",
    "title": "Comuna de Cobquecura",
    "commune": "Cobquecura",
    "region": "Región de Ñuble",
    "category": "Comuna de Chile",
    "lat": -36.1333,
    "lng": -72.7833,
    "aliases": [
      "Cobquecura",
      "Región de Ñuble",
      "chile"
    ]
  },
  {
    "id": "comuna_concepción",
    "key": "comuna_concepción",
    "name": "Comuna de Concepción",
    "title": "Comuna de Concepción",
    "commune": "Concepción",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -36.827,
    "lng": -73.0503,
    "aliases": [
      "Concepción",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_talcahuano",
    "key": "comuna_talcahuano",
    "name": "Comuna de Talcahuano",
    "title": "Comuna de Talcahuano",
    "commune": "Talcahuano",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -36.7247,
    "lng": -73.1167,
    "aliases": [
      "Talcahuano",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_san_pedro_de_la_paz",
    "key": "comuna_san_pedro_de_la_paz",
    "name": "Comuna de San Pedro de la Paz",
    "title": "Comuna de San Pedro de la Paz",
    "commune": "San Pedro de la Paz",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -36.8428,
    "lng": -73.1042,
    "aliases": [
      "San Pedro de la Paz",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_chiguayante",
    "key": "comuna_chiguayante",
    "name": "Comuna de Chiguayante",
    "title": "Comuna de Chiguayante",
    "commune": "Chiguayante",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -36.9167,
    "lng": -73.0167,
    "aliases": [
      "Chiguayante",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_coronel",
    "key": "comuna_coronel",
    "name": "Comuna de Coronel",
    "title": "Comuna de Coronel",
    "commune": "Coronel",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -37.0167,
    "lng": -73.1333,
    "aliases": [
      "Coronel",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_lota",
    "key": "comuna_lota",
    "name": "Comuna de Lota",
    "title": "Comuna de Lota",
    "commune": "Lota",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -37.0897,
    "lng": -73.1583,
    "aliases": [
      "Lota",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_tomé",
    "key": "comuna_tomé",
    "name": "Comuna de Tomé",
    "title": "Comuna de Tomé",
    "commune": "Tomé",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -36.6178,
    "lng": -72.9569,
    "aliases": [
      "Tomé",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_hualpén",
    "key": "comuna_hualpén",
    "name": "Comuna de Hualpén",
    "title": "Comuna de Hualpén",
    "commune": "Hualpén",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -36.7978,
    "lng": -73.0986,
    "aliases": [
      "Hualpén",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_penco",
    "key": "comuna_penco",
    "name": "Comuna de Penco",
    "title": "Comuna de Penco",
    "commune": "Penco",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -36.7369,
    "lng": -72.9986,
    "aliases": [
      "Penco",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_los_ángeles",
    "key": "comuna_los_ángeles",
    "name": "Comuna de Los Ángeles",
    "title": "Comuna de Los Ángeles",
    "commune": "Los Ángeles",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -37.4697,
    "lng": -72.3536,
    "aliases": [
      "Los Ángeles",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_arauco",
    "key": "comuna_arauco",
    "name": "Comuna de Arauco",
    "title": "Comuna de Arauco",
    "commune": "Arauco",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -37.2467,
    "lng": -73.3178,
    "aliases": [
      "Arauco",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_lebu",
    "key": "comuna_lebu",
    "name": "Comuna de Lebu",
    "title": "Comuna de Lebu",
    "commune": "Lebu",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -37.6083,
    "lng": -73.6558,
    "aliases": [
      "Lebu",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_canete",
    "key": "comuna_canete",
    "name": "Comuna de Cañete",
    "title": "Comuna de Cañete",
    "commune": "Cañete",
    "region": "Región del Biobío",
    "category": "Comuna de Chile",
    "lat": -37.8019,
    "lng": -73.3967,
    "aliases": [
      "Cañete",
      "Región del Biobío",
      "chile"
    ]
  },
  {
    "id": "comuna_temuco",
    "key": "comuna_temuco",
    "name": "Comuna de Temuco",
    "title": "Comuna de Temuco",
    "commune": "Temuco",
    "region": "Región de la Araucanía",
    "category": "Comuna de Chile",
    "lat": -38.7369,
    "lng": -72.5903,
    "aliases": [
      "Temuco",
      "Región de la Araucanía",
      "chile"
    ]
  },
  {
    "id": "comuna_padre_las_casas",
    "key": "comuna_padre_las_casas",
    "name": "Comuna de Padre Las Casas",
    "title": "Comuna de Padre Las Casas",
    "commune": "Padre Las Casas",
    "region": "Región de la Araucanía",
    "category": "Comuna de Chile",
    "lat": -38.7619,
    "lng": -72.5978,
    "aliases": [
      "Padre Las Casas",
      "Región de la Araucanía",
      "chile"
    ]
  },
  {
    "id": "comuna_villarrica",
    "key": "comuna_villarrica",
    "name": "Comuna de Villarrica",
    "title": "Comuna de Villarrica",
    "commune": "Villarrica",
    "region": "Región de la Araucanía",
    "category": "Comuna de Chile",
    "lat": -39.2833,
    "lng": -72.2167,
    "aliases": [
      "Villarrica",
      "Región de la Araucanía",
      "chile"
    ]
  },
  {
    "id": "comuna_pucón",
    "key": "comuna_pucón",
    "name": "Comuna de Pucón",
    "title": "Comuna de Pucón",
    "commune": "Pucón",
    "region": "Región de la Araucanía",
    "category": "Comuna de Chile",
    "lat": -39.2778,
    "lng": -71.9778,
    "aliases": [
      "Pucón",
      "Región de la Araucanía",
      "chile"
    ]
  },
  {
    "id": "comuna_angol",
    "key": "comuna_angol",
    "name": "Comuna de Angol",
    "title": "Comuna de Angol",
    "commune": "Angol",
    "region": "Región de la Araucanía",
    "category": "Comuna de Chile",
    "lat": -37.7986,
    "lng": -72.7097,
    "aliases": [
      "Angol",
      "Región de la Araucanía",
      "chile"
    ]
  },
  {
    "id": "comuna_victoria",
    "key": "comuna_victoria",
    "name": "Comuna de Victoria",
    "title": "Comuna de Victoria",
    "commune": "Victoria",
    "region": "Región de la Araucanía",
    "category": "Comuna de Chile",
    "lat": -38.2333,
    "lng": -72.3333,
    "aliases": [
      "Victoria",
      "Región de la Araucanía",
      "chile"
    ]
  },
  {
    "id": "comuna_lautaro",
    "key": "comuna_lautaro",
    "name": "Comuna de Lautaro",
    "title": "Comuna de Lautaro",
    "commune": "Lautaro",
    "region": "Región de la Araucanía",
    "category": "Comuna de Chile",
    "lat": -38.5306,
    "lng": -72.4486,
    "aliases": [
      "Lautaro",
      "Región de la Araucanía",
      "chile"
    ]
  },
  {
    "id": "comuna_valdivia",
    "key": "comuna_valdivia",
    "name": "Comuna de Valdivia",
    "title": "Comuna de Valdivia",
    "commune": "Valdivia",
    "region": "Región de Los Ríos",
    "category": "Comuna de Chile",
    "lat": -39.8142,
    "lng": -73.2458,
    "aliases": [
      "Valdivia",
      "Región de Los Ríos",
      "chile"
    ]
  },
  {
    "id": "comuna_la_unión",
    "key": "comuna_la_unión",
    "name": "Comuna de La Unión",
    "title": "Comuna de La Unión",
    "commune": "La Unión",
    "region": "Región de Los Ríos",
    "category": "Comuna de Chile",
    "lat": -40.2936,
    "lng": -73.0819,
    "aliases": [
      "La Unión",
      "Región de Los Ríos",
      "chile"
    ]
  },
  {
    "id": "comuna_río_bueno",
    "key": "comuna_río_bueno",
    "name": "Comuna de Río Bueno",
    "title": "Comuna de Río Bueno",
    "commune": "Río Bueno",
    "region": "Región de Los Ríos",
    "category": "Comuna de Chile",
    "lat": -40.3333,
    "lng": -72.9583,
    "aliases": [
      "Río Bueno",
      "Región de Los Ríos",
      "chile"
    ]
  },
  {
    "id": "comuna_panguipulli",
    "key": "comuna_panguipulli",
    "name": "Comuna de Panguipulli",
    "title": "Comuna de Panguipulli",
    "commune": "Panguipulli",
    "region": "Región de Los Ríos",
    "category": "Comuna de Chile",
    "lat": -39.6444,
    "lng": -72.3333,
    "aliases": [
      "Panguipulli",
      "Región de Los Ríos",
      "chile"
    ]
  },
  {
    "id": "comuna_futrono",
    "key": "comuna_futrono",
    "name": "Comuna de Futrono",
    "title": "Comuna de Futrono",
    "commune": "Futrono",
    "region": "Región de Los Ríos",
    "category": "Comuna de Chile",
    "lat": -40.1333,
    "lng": -72.3986,
    "aliases": [
      "Futrono",
      "Región de Los Ríos",
      "chile"
    ]
  },
  {
    "id": "comuna_corral",
    "key": "comuna_corral",
    "name": "Comuna de Corral",
    "title": "Comuna de Corral",
    "commune": "Corral",
    "region": "Región de Los Ríos",
    "category": "Comuna de Chile",
    "lat": -39.8897,
    "lng": -73.4319,
    "aliases": [
      "Corral",
      "Región de Los Ríos",
      "chile"
    ]
  },
  {
    "id": "comuna_puerto_montt",
    "key": "comuna_puerto_montt",
    "name": "Comuna de Puerto Montt",
    "title": "Comuna de Puerto Montt",
    "commune": "Puerto Montt",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -41.4697,
    "lng": -72.9428,
    "aliases": [
      "Puerto Montt",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_puerto_varas",
    "key": "comuna_puerto_varas",
    "name": "Comuna de Puerto Varas",
    "title": "Comuna de Puerto Varas",
    "commune": "Puerto Varas",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -41.3197,
    "lng": -72.9856,
    "aliases": [
      "Puerto Varas",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_frutillar",
    "key": "comuna_frutillar",
    "name": "Comuna de Frutillar",
    "title": "Comuna de Frutillar",
    "commune": "Frutillar",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -41.1278,
    "lng": -73.0508,
    "aliases": [
      "Frutillar",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_llanquihue",
    "key": "comuna_llanquihue",
    "name": "Comuna de Llanquihue",
    "title": "Comuna de Llanquihue",
    "commune": "Llanquihue",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -41.2558,
    "lng": -73.0078,
    "aliases": [
      "Llanquihue",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_osorno",
    "key": "comuna_osorno",
    "name": "Comuna de Osorno",
    "title": "Comuna de Osorno",
    "commune": "Osorno",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -40.5744,
    "lng": -73.1328,
    "aliases": [
      "Osorno",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_castro",
    "key": "comuna_castro",
    "name": "Comuna de Castro",
    "title": "Comuna de Castro",
    "commune": "Castro",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -42.4722,
    "lng": -73.7731,
    "aliases": [
      "Castro",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_ancud",
    "key": "comuna_ancud",
    "name": "Comuna de Ancud",
    "title": "Comuna de Ancud",
    "commune": "Ancud",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -41.8667,
    "lng": -73.8333,
    "aliases": [
      "Ancud",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_quellón",
    "key": "comuna_quellón",
    "name": "Comuna de Quellón",
    "title": "Comuna de Quellón",
    "commune": "Quellón",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -43.1189,
    "lng": -73.6158,
    "aliases": [
      "Quellón",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_chaitén",
    "key": "comuna_chaitén",
    "name": "Comuna de Chaitén",
    "title": "Comuna de Chaitén",
    "commune": "Chaitén",
    "region": "Región de Los Lagos",
    "category": "Comuna de Chile",
    "lat": -42.9167,
    "lng": -72.7056,
    "aliases": [
      "Chaitén",
      "Región de Los Lagos",
      "chile"
    ]
  },
  {
    "id": "comuna_coyhaique",
    "key": "comuna_coyhaique",
    "name": "Comuna de Coyhaique",
    "title": "Comuna de Coyhaique",
    "commune": "Coyhaique",
    "region": "Región de Aysén",
    "category": "Comuna de Chile",
    "lat": -45.5752,
    "lng": -72.0662,
    "aliases": [
      "Coyhaique",
      "Región de Aysén",
      "chile"
    ]
  },
  {
    "id": "comuna_puerto_aysén",
    "key": "comuna_puerto_aysén",
    "name": "Comuna de Puerto Aysén",
    "title": "Comuna de Puerto Aysén",
    "commune": "Puerto Aysén",
    "region": "Región de Aysén",
    "category": "Comuna de Chile",
    "lat": -45.4058,
    "lng": -72.6978,
    "aliases": [
      "Puerto Aysén",
      "Región de Aysén",
      "chile"
    ]
  },
  {
    "id": "comuna_chile_chico",
    "key": "comuna_chile_chico",
    "name": "Comuna de Chile Chico",
    "title": "Comuna de Chile Chico",
    "commune": "Chile Chico",
    "region": "Región de Aysén",
    "category": "Comuna de Chile",
    "lat": -46.5419,
    "lng": -71.7228,
    "aliases": [
      "Chile Chico",
      "Región de Aysén",
      "chile"
    ]
  },
  {
    "id": "comuna_cochrane",
    "key": "comuna_cochrane",
    "name": "Comuna de Cochrane",
    "title": "Comuna de Cochrane",
    "commune": "Cochrane",
    "region": "Región de Aysén",
    "category": "Comuna de Chile",
    "lat": -47.2542,
    "lng": -72.5694,
    "aliases": [
      "Cochrane",
      "Región de Aysén",
      "chile"
    ]
  },
  {
    "id": "comuna_tortel_caleta_tortel",
    "key": "comuna_tortel_caleta_tortel",
    "name": "Comuna de Tortel (Caleta Tortel)",
    "title": "Comuna de Tortel (Caleta Tortel)",
    "commune": "Tortel (Caleta Tortel)",
    "region": "Región de Aysén",
    "category": "Comuna de Chile",
    "lat": -47.7967,
    "lng": -73.5333,
    "aliases": [
      "Tortel (Caleta Tortel)",
      "Región de Aysén",
      "chile"
    ]
  },
  {
    "id": "comuna_punta_arenas",
    "key": "comuna_punta_arenas",
    "name": "Comuna de Punta Arenas",
    "title": "Comuna de Punta Arenas",
    "commune": "Punta Arenas",
    "region": "Región de Magallanes",
    "category": "Comuna de Chile",
    "lat": -53.1638,
    "lng": -70.9171,
    "aliases": [
      "Punta Arenas",
      "Región de Magallanes",
      "chile"
    ]
  },
  {
    "id": "comuna_puerto_natales",
    "key": "comuna_puerto_natales",
    "name": "Comuna de Puerto Natales",
    "title": "Comuna de Puerto Natales",
    "commune": "Puerto Natales",
    "region": "Región de Magallanes",
    "category": "Comuna de Chile",
    "lat": -51.7269,
    "lng": -72.5069,
    "aliases": [
      "Puerto Natales",
      "Región de Magallanes",
      "chile"
    ]
  },
  {
    "id": "comuna_porvenir",
    "key": "comuna_porvenir",
    "name": "Comuna de Porvenir",
    "title": "Comuna de Porvenir",
    "commune": "Porvenir",
    "region": "Región de Magallanes",
    "category": "Comuna de Chile",
    "lat": -53.2986,
    "lng": -70.3689,
    "aliases": [
      "Porvenir",
      "Región de Magallanes",
      "chile"
    ]
  },
  {
    "id": "comuna_cabo_de_hornos_puerto_will",
    "key": "comuna_cabo_de_hornos_puerto_will",
    "name": "Comuna de Cabo de Hornos (Puerto Williams)",
    "title": "Comuna de Cabo de Hornos (Puerto Williams)",
    "commune": "Cabo de Hornos (Puerto Williams)",
    "region": "Región de Magallanes",
    "category": "Comuna de Chile",
    "lat": -54.9342,
    "lng": -67.6186,
    "aliases": [
      "Cabo de Hornos (Puerto Williams)",
      "Región de Magallanes",
      "chile"
    ]
  },
  {
    "id": "comuna_torres_del_paine",
    "key": "comuna_torres_del_paine",
    "name": "Comuna de Torres del Paine",
    "title": "Comuna de Torres del Paine",
    "commune": "Torres del Paine",
    "region": "Región de Magallanes",
    "category": "Comuna de Chile",
    "lat": -51.2589,
    "lng": -72.8847,
    "aliases": [
      "Torres del Paine",
      "Región de Magallanes",
      "chile"
    ]
  },
  {
    "id": "hito_reloj_flores",
    "key": "hito_reloj_flores",
    "name": "Reloj de Flores (Viña del Mar)",
    "title": "Reloj de Flores (Viña del Mar)",
    "commune": "Viña del Mar",
    "region": "Región de Valparaíso",
    "category": "Hito Turístico",
    "lat": -33.0289,
    "lng": -71.5678,
    "aliases": [
      "reloj de flores",
      "caleta abarca"
    ]
  },
  {
    "id": "hito_muelle_vergara",
    "key": "hito_muelle_vergara",
    "name": "Muelle Vergara (Viña del Mar)",
    "title": "Muelle Vergara (Viña del Mar)",
    "commune": "Viña del Mar",
    "region": "Región de Valparaíso",
    "category": "Paseo Costero",
    "lat": -33.0125,
    "lng": -71.5542,
    "aliases": [
      "muelle vergara",
      "playa acapulco"
    ]
  },
  {
    "id": "hito_renaca_sector5",
    "key": "hito_renaca_sector5",
    "name": "Playa Reñaca (Sector 5)",
    "title": "Playa Reñaca (Sector 5)",
    "commune": "Viña del Mar",
    "region": "Región de Valparaíso",
    "category": "Balneario",
    "lat": -32.973,
    "lng": -71.542,
    "aliases": [
      "renaca",
      "sector 5"
    ]
  },
  {
    "id": "hito_plaza_sotomayor",
    "key": "hito_plaza_sotomayor",
    "name": "Plaza Sotomayor (Puerto Valparaíso)",
    "title": "Plaza Sotomayor (Puerto Valparaíso)",
    "commune": "Valparaíso",
    "region": "Región de Valparaíso",
    "category": "Plaza Histórica",
    "lat": -33.0392,
    "lng": -71.6281,
    "aliases": [
      "sotomayor",
      "muelle prat"
    ]
  },
  {
    "id": "hito_roca_oceanica",
    "key": "hito_roca_oceanica",
    "name": "Roca Oceánica (Concón)",
    "title": "Roca Oceánica (Concón)",
    "commune": "Concón",
    "region": "Región de Valparaíso",
    "category": "Santuario Natural",
    "lat": -32.951,
    "lng": -71.549,
    "aliases": [
      "roca oceanica",
      "concon dunas"
    ]
  },
  {
    "id": "hito_faro_la_serena",
    "key": "hito_faro_la_serena",
    "name": "El Faro Monumental de La Serena",
    "title": "El Faro Monumental de La Serena",
    "commune": "La Serena",
    "region": "Región de Coquimbo",
    "category": "Monumento",
    "lat": -29.9019,
    "lng": -71.2789,
    "aliases": [
      "faro la serena",
      "av del mar"
    ]
  },
  {
    "id": "hito_cruz_tercer_milenio",
    "key": "hito_cruz_tercer_milenio",
    "name": "Cruz del Tercer Milenio",
    "title": "Cruz del Tercer Milenio",
    "commune": "Coquimbo",
    "region": "Región de Coquimbo",
    "category": "Monumento",
    "lat": -29.952,
    "lng": -71.348,
    "aliases": [
      "cruz coquimbo"
    ]
  },
  {
    "id": "hito_valle_elqui",
    "key": "hito_valle_elqui",
    "name": "Vicuña (Valle de Elqui)",
    "title": "Vicuña (Valle de Elqui)",
    "commune": "Vicuña",
    "region": "Región de Coquimbo",
    "category": "Turismo Astronómico",
    "lat": -30.0319,
    "lng": -70.7081,
    "aliases": [
      "valle de elqui",
      "vicuna"
    ]
  },
  {
    "id": "hito_portada_antofagasta",
    "key": "hito_portada_antofagasta",
    "name": "Monumento Natural La Portada",
    "title": "Monumento Natural La Portada",
    "commune": "Antofagasta",
    "region": "Región de Antofagasta",
    "category": "Monumento Natural",
    "lat": -23.5042,
    "lng": -70.4289,
    "aliases": [
      "la portada",
      "antofagasta"
    ]
  },
  {
    "id": "hito_san_pedro_atacama",
    "key": "hito_san_pedro_atacama",
    "name": "San Pedro de Atacama (Pueblo)",
    "title": "San Pedro de Atacama (Pueblo)",
    "commune": "San Pedro de Atacama",
    "region": "Región de Antofagasta",
    "category": "Turismo",
    "lat": -22.9114,
    "lng": -68.1994,
    "aliases": [
      "san pedro de atacama",
      "desierto"
    ]
  },
  {
    "id": "hito_cavancha_iquique",
    "key": "hito_cavancha_iquique",
    "name": "Playa Cavancha",
    "title": "Playa Cavancha",
    "commune": "Iquique",
    "region": "Región de Tarapacá",
    "category": "Balneario",
    "lat": -20.2289,
    "lng": -70.1472,
    "aliases": [
      "cavancha",
      "playa cavancha"
    ]
  },
  {
    "id": "hito_morro_arica",
    "key": "hito_morro_arica",
    "name": "Morro de Arica",
    "title": "Morro de Arica",
    "commune": "Arica",
    "region": "Región de Arica y Parinacota",
    "category": "Monumento Histórico",
    "lat": -18.4811,
    "lng": -70.3253,
    "aliases": [
      "morro de arica"
    ]
  },
  {
    "id": "hito_plaza_concepcion",
    "key": "hito_plaza_concepcion",
    "name": "Plaza de la Independencia (Concepción)",
    "title": "Plaza de la Independencia (Concepción)",
    "commune": "Concepción",
    "region": "Región del Biobío",
    "category": "Plaza Central",
    "lat": -36.827,
    "lng": -73.0503,
    "aliases": [
      "plaza concepcion"
    ]
  },
  {
    "id": "hito_campanil_udec",
    "key": "hito_campanil_udec",
    "name": "Universidad de Concepción (Campanil)",
    "title": "Universidad de Concepción (Campanil)",
    "commune": "Concepción",
    "region": "Región del Biobío",
    "category": "Universidad",
    "lat": -36.829,
    "lng": -73.039,
    "aliases": [
      "udec",
      "campanil concepcion"
    ]
  },
  {
    "id": "hito_huascar",
    "key": "hito_huascar",
    "name": "Monitor Huáscar (Talcahuano)",
    "title": "Monitor Huáscar (Talcahuano)",
    "commune": "Talcahuano",
    "region": "Región del Biobío",
    "category": "Museo Naval",
    "lat": -36.7119,
    "lng": -73.1119,
    "aliases": [
      "huascar",
      "talcahuano"
    ]
  },
  {
    "id": "hito_nielol_temuco",
    "key": "hito_nielol_temuco",
    "name": "Cerro Ñielol",
    "title": "Cerro Ñielol",
    "commune": "Temuco",
    "region": "Región de la Araucanía",
    "category": "Parque Natural",
    "lat": -38.725,
    "lng": -72.585,
    "aliases": [
      "cerro nielol"
    ]
  },
  {
    "id": "hito_volcan_villarrica",
    "key": "hito_volcan_villarrica",
    "name": "Volcán Villarrica (Pucón)",
    "title": "Volcán Villarrica (Pucón)",
    "commune": "Pucón",
    "region": "Región de la Araucanía",
    "category": "Naturaleza",
    "lat": -39.4203,
    "lng": -71.9397,
    "aliases": [
      "volcan villarrica",
      "pucon"
    ]
  },
  {
    "id": "hito_feria_fluvial",
    "key": "hito_feria_fluvial",
    "name": "Feria Fluvial de Valdivia (Río Calle-Calle)",
    "title": "Feria Fluvial de Valdivia (Río Calle-Calle)",
    "commune": "Valdivia",
    "region": "Región de Los Ríos",
    "category": "Mercado Fluvial",
    "lat": -39.813,
    "lng": -73.246,
    "aliases": [
      "feria fluvial",
      "valdivia"
    ]
  },
  {
    "id": "hito_costanera_pto_varas",
    "key": "hito_costanera_pto_varas",
    "name": "Costanera Lago Llanquihue (Puerto Varas)",
    "title": "Costanera Lago Llanquihue (Puerto Varas)",
    "commune": "Puerto Varas",
    "region": "Región de Los Lagos",
    "category": "Paseo Lacustre",
    "lat": -41.3197,
    "lng": -72.9856,
    "aliases": [
      "puerto varas costanera"
    ]
  },
  {
    "id": "hito_teatro_lago",
    "key": "hito_teatro_lago",
    "name": "Teatro del Lago (Frutillar)",
    "title": "Teatro del Lago (Frutillar)",
    "commune": "Frutillar",
    "region": "Región de Los Lagos",
    "category": "Cultura",
    "lat": -41.129,
    "lng": -73.048,
    "aliases": [
      "teatro del lago"
    ]
  },
  {
    "id": "hito_palafitos_castro",
    "key": "hito_palafitos_castro",
    "name": "Palafitos de Gamboa (Chiloé)",
    "title": "Palafitos de Gamboa (Chiloé)",
    "commune": "Castro",
    "region": "Región de Los Lagos",
    "category": "Patrimonio",
    "lat": -42.482,
    "lng": -73.769,
    "aliases": [
      "palafitos",
      "castro chiloe"
    ]
  },
  {
    "id": "hito_torres_paine",
    "key": "hito_torres_paine",
    "name": "Parque Nacional Torres del Paine",
    "title": "Parque Nacional Torres del Paine",
    "commune": "Torres del Paine",
    "region": "Región de Magallanes",
    "category": "Parque Nacional",
    "lat": -51.2589,
    "lng": -72.8847,
    "aliases": [
      "torres del paine"
    ]
  },
  {
    "id": "hito_plaza_punta_arenas",
    "key": "hito_plaza_punta_arenas",
    "name": "Plaza Muñoz Gamero (Punta Arenas)",
    "title": "Plaza Muñoz Gamero (Punta Arenas)",
    "commune": "Punta Arenas",
    "region": "Región de Magallanes",
    "category": "Plaza Central",
    "lat": -53.1638,
    "lng": -70.9171,
    "aliases": [
      "plaza punta arenas",
      "estrecho de magallanes"
    ]
  }
];


  function normalizeStr(s) {
    if (!s) return '';
    return s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[.,\-_/()']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function haversineDistKm(lat1, lon1, lat2, lon2) {
    const R = 6371.0;
    const dLat = (lat2 - lat1) * Math.PI / 180.0;
    const dLon = (lon2 - lon1) * Math.PI / 180.0;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180.0) * Math.cos(lat2 * Math.PI / 180.0) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  window.ChileGeo = {
    all: CHILE_DATABASE,
    
    getById: function(id) {
      if (!id) return null;
      return CHILE_DATABASE.find(item => item.id === id || item.key === id);
    },

    search: function(query, userLat, userLng) {
      if (!query || query.trim().length === 0) return [];
      const qNorm = normalizeStr(query);
      const qTokens = qNorm.split(' ').filter(t => t.length > 0);

      const uLat = (userLat !== undefined && userLat !== null) ? userLat : -33.4851;
      const uLng = (userLng !== undefined && userLng !== null) ? userLng : -70.6698;

      const matches = [];

      for (let i = 0; i < CHILE_DATABASE.length; i++) {
        const item = CHILE_DATABASE[i];
        const searchBlob = normalizeStr(
          item.name + ' ' +
          item.commune + ' ' +
          item.region + ' ' +
          item.category + ' ' +
          (item.aliases ? item.aliases.join(' ') : '')
        );

        // Cada palabra ingresada por el usuario debe coincidir
        let allMatch = true;
        for (let j = 0; j < qTokens.length; j++) {
          if (!searchBlob.includes(qTokens[j])) {
            allMatch = false;
            break;
          }
        }

        if (allMatch) {
          const dist = haversineDistKm(uLat, uLng, item.lat, item.lng);
          matches.push({
            key: item.id,
            id: item.id,
            node: item.id,
            name: item.name,
            title: item.name,
            commune: item.commune,
            region: item.region,
            detail: item.commune + (item.region ? ', ' + item.region : ''),
            category: item.category,
            lat: item.lat,
            lng: item.lng,
            distFromUserKm: parseFloat(dist.toFixed(1))
          });
        }
      }

      // Ordenar: coincidencias exactas al inicio, luego por distancia más cercana
      return matches.sort((a, b) => {
        const aStarts = normalizeStr(a.name).startsWith(qNorm);
        const bStarts = normalizeStr(b.name).startsWith(qNorm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.distFromUserKm - b.distFromUserKm;
      });
    }
  };

})(window);
