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
    { idoppago: 10, codoppago: '10', desoppago: 'VACIO' }
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

export const MEDIOS_PAGO = [
    { codmepag: 1, uif: '05', sunat: '001', desmpagos: 'DEPOSITO EN CUENTA', cod_sisgen: '001' },
    { codmepag: 2, uif: '03', sunat: '002', desmpagos: 'GIRO', cod_sisgen: '002' },
    { codmepag: 3, uif: '04', sunat: '003', desmpagos: 'TRANSFERENCIA DE FONDOS', cod_sisgen: '003' },
    { codmepag: 4, uif: '99', sunat: '004', desmpagos: 'ORDEN DE PAGO', cod_sisgen: '004' },
    { codmepag: 5, uif: '99', sunat: '005', desmpagos: 'TARJETA DE DEBITO', cod_sisgen: '005' },
    { codmepag: 6, uif: '06', sunat: '006', desmpagos: 'TARJETA DE CREDITO EMITIDA EN EL PAIS POR UNA EMPRESA DEL SISTEMA FINACIERO', cod_sisgen: '006' },
    { codmepag: 7, uif: '02', sunat: '007', desmpagos: 'CHEQUES CON CLAUSULA: NO NEGOCIABLES - INTRASFERIBLES - NO A LA ORDEN O SIMILAR', cod_sisgen: '007' },
    { codmepag: 8, uif: '01', sunat: '008', desmpagos: 'EFECTIVO - POR OPERACIONES DONDE NO EXISTE OBLIGACION DE UTILIZAR MEDIOS DE PAGO', cod_sisgen: '008' },
    { codmepag: 9, uif: '01', sunat: '009', desmpagos: 'EFECTIVO - EN LOS DEMAS CASOS', cod_sisgen: '009' },
    { codmepag: 10, uif: '99', sunat: '010', desmpagos: 'MEDIOS DE PAGO USADOS EN COMERCIO EXTERIOR', cod_sisgen: '010' },
    { codmepag: 11, uif: '99', sunat: '099', desmpagos: 'OTROS MEDIOS DE PAGO', cod_sisgen: '099' },
    { codmepag: 12, uif: '99', sunat: '011', desmpagos: 'DOCUMENTOS DE EDPYMES Y COOPERATIVAS DE AHORRO Y CREDITO', cod_sisgen: '011' },
    { codmepag: 13, uif: '06', sunat: '012', desmpagos: 'TARJETA DE CREDITO EMITIDA O NO EN EL PAIS POR ENTES AJENOS SISTEMA FINACIERO', cod_sisgen: '012' },
    { codmepag: 14, uif: '06', sunat: '013', desmpagos: 'TARJETA DE CREDITO EMITIDA EN EL EXTERIOR POR BANCOS O F. NO DOMICILIADAS', cod_sisgen: '013' },
    { codmepag: 15, uif: '07', sunat: '099', desmpagos: 'BIEN MUEBLE', cod_sisgen: '091' },
    { codmepag: 16, uif: '08', sunat: '099', desmpagos: 'BIEN INMUEBLE', cod_sisgen: '090' },
    { codmepag: 95, uif: '01', sunat: '009', desmpagos: 'UIF-EFECTIVO (NO EXHIBIO)', cod_sisgen: '095' },
    { codmepag: 96, uif: '02', sunat: '007', desmpagos: 'UIF-CHEQUE (NO EXHIBIO)', cod_sisgen: '096' },
    { codmepag: 98, uif: '05', sunat: '001', desmpagos: 'UIF-DEPOSITO (NO EXHIBIO)', cod_sisgen: '097' },
    { codmepag: 99, uif: '99', sunat: '099', desmpagos: 'UIF-OTROS (NO EXHIBIO)', cod_sisgen: '098' },
    { codmepag: 100, uif: '99', sunat: '099', desmpagos: 'VACIO', cod_sisgen: '' }
]  

export const BANCOS = [
    { idbancos: 1, codbancos: '02', desbanco: 'DE CREDITO DEL PERU' },
    { idbancos: 2, codbancos: '03', desbanco: 'INTERBANK' },
    { idbancos: 3, codbancos: '05', desbanco: 'LATINO' },
    { idbancos: 4, codbancos: '07', desbanco: 'CITYBANCK N.A.' },
    { idbancos: 5, codbancos: '08', desbanco: 'STANDARD CHARTERED' },
    { idbancos: 6, codbancos: '09', desbanco: 'SCOTIABANK' },
    { idbancos: 7, codbancos: '11', desbanco: 'CONTINENTAL' },
    { idbancos: 8, codbancos: '12', desbanco: 'DE LIMA' },
    { idbancos: 9, codbancos: '16', desbanco: 'MERCANTIL' },
    { idbancos: 10, codbancos: '18', desbanco: 'NACION' },
    { idbancos: 11, codbancos: '22', desbanco: 'SANTANDER CENTRAL HISPANO - PERU' },
    { idbancos: 12, codbancos: '23', desbanco: 'DE COMERCIO' },
    { idbancos: 13, codbancos: '25', desbanco: 'REPUBLICA' },
    { idbancos: 14, codbancos: '26', desbanco: 'NBK BANK' },
    { idbancos: 15, codbancos: '29', desbanco: 'BANCO SUR' },
    { idbancos: 16, codbancos: '35', desbanco: 'FINANCIERO DEL PERU' },
    { idbancos: 17, codbancos: '37', desbanco: 'DEL PROGRESO' },
    { idbancos: 18, codbancos: '38', desbanco: 'INTERAMERICANO FINANZAS' },
    { idbancos: 19, codbancos: '39', desbanco: 'BANEX' },
    { idbancos: 20, codbancos: '40', desbanco: 'NUEVO MUNDO' },
    { idbancos: 21, codbancos: '41', desbanco: 'SUD AMERICANO' },
    { idbancos: 22, codbancos: '42', desbanco: 'DEL LIBERTADOR' },
    { idbancos: 23, codbancos: '43', desbanco: 'DEL TRABAJO' },
    { idbancos: 24, codbancos: '44', desbanco: 'SOLVENTA' },
    { idbancos: 25, codbancos: '45', desbanco: 'SERBANCO' },
    { idbancos: 26, codbancos: '46', desbanco: 'BANK BOSTON' },
    { idbancos: 27, codbancos: '47', desbanco: 'ORION' },
    { idbancos: 28, codbancos: '48', desbanco: 'DEL PAIS' },
    { idbancos: 29, codbancos: '49', desbanco: 'MI BANCO' },
    { idbancos: 30, codbancos: '50', desbanco: 'DE PARIS' },
    { idbancos: 31, codbancos: '99', desbanco: 'OTROS' },
    { idbancos: 32, codbancos: '51', desbanco: 'AGROBANCO' },
    { idbancos: 33, codbancos: '53', desbanco: 'HSBC BANK PERU S.A.' },
    { idbancos: 34, codbancos: '54', desbanco: 'BANCO FALLABELLA PERU' },
    { idbancos: 35, codbancos: '55', desbanco: 'BANCO RIPLEY' },
    { idbancos: 36, codbancos: '56', desbanco: 'BANCO SANTANDER PERU S.A.' },
    { idbancos: 37, codbancos: '58', desbanco: 'BANCO AZTECA DEL PERU' },
    { idbancos: 38, codbancos: '59', desbanco: 'NINGUNO' },
    { idbancos: 39, codbancos: '99', desbanco: 'CAJA CUSCO' },
    { idbancos: 40, codbancos: '99', desbanco: 'CAJA HUANCAYO' },
    { idbancos: 41, codbancos: '99', desbanco: 'CAJA AREQUIPA' },
    { idbancos: 42, codbancos: '99', desbanco: 'BANBIF' },
    { idbancos: 43, codbancos: '99', desbanco: 'CAJA PIURA' },
    { idbancos: 44, codbancos: '99', desbanco: 'CAJA TACNA' },
    { idbancos: 45, codbancos: '99', desbanco: 'CAJA SULLANA' },
    { idbancos: 46, codbancos: '99', desbanco: 'FINANCIERA CONFIANZA' },
    { idbancos: 47, codbancos: '99', desbanco: 'BANCO PICHINCHA' },
    { idbancos: 48, codbancos: '99', desbanco: 'CAJA RURAL DE AHORRO Y CREDITO RAIZ S.A.A.' },
    { idbancos: 49, codbancos: '99', desbanco: 'CAJA LOS ANDES' },
    { idbancos: 50, codbancos: '99', desbanco: 'CAJA TRUJILLO' }
]

export const TIPOS_BIENES = [
    { id_tipbien: 1, des_tipbien: 'BIENES' },
    { id_tipbien: 2, des_tipbien: 'ACCIONES Y DERECHOS' },
]

export const BIEN_ACTO_JURIDICO = [
    { idtipbien: 1, codbien: '01', uif: 1, desestcivil: 'AERONAVES' },
    { idtipbien: 2, codbien: '02', uif: 0, desestcivil: 'CONCESIONES' },
    { idtipbien: 3, codbien: '03', uif: 0, desestcivil: 'DERECHOS DE PROPIEDAD INTELECTUAL' },
    { idtipbien: 4, codbien: '04', uif: 0, desestcivil: 'PREDIOS' },
    { idtipbien: 5, codbien: '05', uif: 2, desestcivil: 'MAQUINARIAS Y EQUIPOS' },
    { idtipbien: 6, codbien: '06', uif: 0, desestcivil: 'MINAS / CANTERAS Y DEPOSITOS DE HIDROCARBUROS' },
    { idtipbien: 7, codbien: '07', uif: 1, desestcivil: 'NAVES' },
    { idtipbien: 8, codbien: '09', uif: 1, desestcivil: 'VEHICULOS TERRESTRES' },
    { idtipbien: 9, codbien: '11', uif: 0, desestcivil: 'CREDITOS' },
    { idtipbien: 10, codbien: '99', uif: 3, desestcivil: 'OTROS NO ESPECIFICADOS' }
]
