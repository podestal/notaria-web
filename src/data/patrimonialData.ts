// export const MONEDAS = {
//     1: {'desmon': 'SOLES', 'simbolo': 'S/', 'codigo': 'PEN', 'codmon': '01'},
//     2: {'desmon': 'DOLARES N.A.', 'simbolo': 'US$.', 'codigo': 'USD', 'codmon': '02'},
//     3: {'desmon': 'EUROS', 'simbolo': '€', 'codigo': 'EUR', 'codmon': '03'},
// }

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
    { idtipoacto: 'C', des_idtipoacto: 'AL CONTADO' },
    { idtipoacto: 'P', des_idtipoacto: 'A PLAZOS (MAS DE UNA CUOTA)' },
    { idtipoacto: 'S', des_idtipoacto: 'SALDO PENDIENTE DE PAGO (UNA CUOTA)' },
    { idtipoacto: 'D', des_idtipoacto: 'DONACIONES O ANTICIPOS' },
    { idtipoacto: 'N', des_idtipoacto: 'NO APLICA' }    
] 