export const MONEDAS = [
    { idmon: 1, desmon: 'SOLES', simbolo: 'S/', codigo: 'PEN', codmon: '01' },
    { idmon: 2, desmon: 'DOLARES N.A.', simbolo: 'US$.', codigo: 'USD', codmon: '02' },
    { idmon: 3, desmon: 'EUROS', simbolo: '€', codigo: 'EUR', codmon: '03' },   
]

export const OPPORTUNIDADES_PAGO = [
    { idoppago: 1, codoppago: '01', desoppago: 'A LA FIRMA DEL CONTRATO/MINUTA' },
    { idoppago: 2, codoppago: '02', desoppago: 'A LA FIRMA DEL ACTA DE TRANSFERENCIA' },
    { idoppago: 3, codoppago: '03', desoppago: 'A LA FIRMA DEL INSTRUMENTO PUBLICO NOTARIAL PROTOCOLAR' },
    { idoppago: 4, codoppago: '04', desoppago: 'CONTRA LA INSCRIPCION DEL BLOQUEO REGISTRAL' },
    { idoppago: 5, codoppago: '05', desoppago: 'CONTRA LA INSCRIPCION DE LA HIPOTECA' },
    { idoppago: 6, codoppago: '06', desoppago: 'CON LA ENTREGA FISICA DEL BIEN' },
    { idoppago: 7, codoppago: '07', desoppago: 'CON ANTERIORIDAD A LA FIRMA DE LA MINUTA' },
    { idoppago: 8, codoppago: '99', desoppago: 'OTRO' },
    { idoppago: 10, codoppago: '', desoppago: 'VACIO' }
]

export const FORMAS_PAGO = [
    { id_fpago: '1', codigo: 'C', descripcion: 'AL CONTADO' },
    { id_fpago: '2', codigo: 'P', descripcion: 'A PLAZOS (MAS DE UNA CUOTA)' },
    { id_fpago: '3', codigo: 'S', descripcion: 'SALDO PENDIENTE DE PAGO (UNA CUOTA)' },
    { id_fpago: '4', codigo: 'D', descripcion: 'DONACIONES O ANTICIPOS' },
    { id_fpago: '5', codigo: 'N', descripcion: 'NO APLICA' }    
] 

export const VEHICLE_SEARCH_TYPES = [
    { id: '1', idPlaca:'P', descripcion: 'PLACA' },
    { id: '2', idPlaca:'L', descripcion: 'POLIZA' },
]

export const SEDES_REGISTRALES = [
    { idsedereg: '01', dessede: 'I - Piura', num_zona: 'I', zona_depar: 'TUMBES Y PIURA' },
    { idsedereg: '02', dessede: 'II - Chiclayo', num_zona: 'II', zona_depar: 'LAMBAYEQUE, CAJAMARCA Y AMAZONAS' },
    { idsedereg: '03', dessede: 'III - Moyobamba', num_zona: 'III', zona_depar: 'SAN MARTIN' },
    { idsedereg: '04', dessede: 'IV - Iquitos', num_zona: 'IV', zona_depar: 'LORETO' },
    { idsedereg: '05', dessede: 'V - Trujillo', num_zona: 'V', zona_depar: 'LA LIBERTAD' },
    { idsedereg: '06', dessede: 'VI - Pucallpa', num_zona: 'VI', zona_depar: 'UCAYALI' },
    { idsedereg: '07', dessede: 'VII - Huaraz', num_zona: 'VII', zona_depar: 'ANCASH' },
    { idsedereg: '08', dessede: 'VIII - Huancayo', num_zona: 'VIII', zona_depar: 'JUNIN, HUANUCO Y PASCO' },
    { idsedereg: '09', dessede: 'IX - Lima', num_zona: 'IX', zona_depar: 'LIMA Y PROVINCIA CONSTITUCIONAL DEL CALLAO' },
    { idsedereg: '10', dessede: 'X - Cusco', num_zona: 'X', zona_depar: 'CUSCO, APURIMAC Y MADRE DE DIOS' },
    { idsedereg: '11', dessede: 'XI - Ica', num_zona: 'XI', zona_depar: 'ICA, HUANCAVELICA Y APURIMAC' },
    { idsedereg: '12', dessede: 'XII - Arequipa', num_zona: 'XII', zona_depar: 'AREQUIPA' },
    { idsedereg: '13', dessede: 'XIII - Tacna', num_zona: 'XIII', zona_depar: 'MOQUEGUA, TACNA Y PUNO' },
    { idsedereg: '14', dessede: 'XIV - Ayacucho', num_zona: 'XIV', zona_depar: 'AYACUCHO' }
]

export const GIRO_NEGOCIO = [
    { coddivi: 'A', nombre: 'AGRICULTURA GANADERIA CAZA Y SILVICULTURA', codrevi: '1' },
    { coddivi: 'B', nombre: 'PESCA', codrevi: '1' },
    { coddivi: 'C', nombre: 'EXPLOTACION DE MINAS Y CANTERAS', codrevi: '1' },
    { coddivi: 'D', nombre: 'INDUSTRIAS MANUFACTURERAS', codrevi: '1' },
    { coddivi: 'E', nombre: 'SUMINISTRO DE ELECTRICIDAD, GAS Y AGUA', codrevi: '1' },
    { coddivi: 'F', nombre: 'CONSTRUCCION', codrevi: '1' },
    { coddivi: 'G', nombre: 'COMERCIO AL POR MAYOR Y MENOR, REPARACION DE VEHICULOS AUTOMOTORES, ART. DOMESTICOS', codrevi: '1' },
    { coddivi: 'H', nombre: 'HOTELES Y RESTAURANTES', codrevi: '1' },
    { coddivi: 'I', nombre: 'TRANSPORTE, ALMACENAMIENTO Y COMUNICACIONES', codrevi: '1' },
    { coddivi: 'J', nombre: 'INTERMEDIACION FINANCIERA', codrevi: '1' },
    { coddivi: 'K', nombre: 'ACTIVIDADES INMOBILIARIAS, EMPRESARIALES Y DE ALQUILER', codrevi: '1' },
    { coddivi: 'L', nombre: 'ADMINISTRACION PUBLICA Y DEFENSA, PLANES DE SEGURIDAD SOCIAL DE AFILIACION OBLIGATORIA', codrevi: '1' },
    { coddivi: 'M', nombre: 'ENSENANZA (PRIVADA)', codrevi: '1' },
    { coddivi: 'N', nombre: 'ACTIVIDADES DE SERVICIOS SOCIALES Y DE SALUD (PRIVADA)', codrevi: '1' },
    { coddivi: 'O', nombre: 'OTRAS ACTIV. DE SERVICIOS COMUNITARIAS, SOCIALES Y PERSONALES', codrevi: '1' },
    { coddivi: 'P', nombre: 'HOGARES PRIVADOS CON SERVICIO DOMESTICO', codrevi: '1' },
    { coddivi: 'Q', nombre: 'ORGANIZACIONES Y ORGANOS EXTRATERRITORIALES', codrevi: '1'}
]