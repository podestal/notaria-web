// +----------+-----------+-----------------------------------------------+-----------+-------+
// | idtipdoc | codtipdoc | destipdoc                                     | td_abrev  | sunat |
// +----------+-----------+-----------------------------------------------+-----------+-------+
// |        1 | 01        | DOCUMENTO NACIONAL DE IDENTIDAD               | DNI       |     1 |
// |        2 | 02        | CARNET DE EXTRANJERIA                         | CE        |     4 |
// |        3 | 03        | CARNET DE IDENTIDAD DE LAS FUERZAS POLICIALES | CEFP      |     0 |
// |        4 | 04        | CARNET DE IDENTIDAD DE LAS FUERZAS ARMADAS    | CEFA      |     0 |
// |        5 | 05        | PASAPORTE                                     | PASAPORTE |     7 |
// |        6 | 06        | CEDULA DE CIUDADANIA                          | CDC       |     0 |
// |        7 | 07        | CEDULA DIPLOMATICA DE IDENTIDAD               | CDI       |     0 |
// |        8 | 08        | R.U.C.                                        | R.U.C.    |     6 |
// |        9 | 09        | OTRO                                          | OTRO      |     0 |
// |       10 | 10        | SIN DOCUMENTO                                 | SD        |     0 |
// |       11 | 11        | PARTIDA DE NACIMIENTO                         | PN        |     1 |
// +----------+-----------+-----------------------------------------------+-----------+-------+

export const documentoJuridicaOptions = [
    { value: 0, label: 'Seleccione una opción' },
    { value: 8, label: 'R.U.C.' },
    { value: 10, label: 'Sin Documento'},
]

export const documentNaturalOptions = [
    { value: 0, label: 'Seleccione una opción' },
    { value: 1, label: 'Documento Nacional de Identidad' },
    { value: 2, label: 'Carnet de Extranjería' },
    { value: 3, label: 'Carnet de Identidad de las Fuerzas Armadas' },
    { value: 4, label: 'Carnet de Identidad de las Fuerzas Policiales' },
    { value: 5, label: 'Pasaporte' },
    { value: 6, label: 'Cédula de Ciudadanía' },
    { value: 7, label: 'Cédula Diplomática de Identidad'},
    { value: 11, label: 'Partida de Nacimiento' },
    { value: 9, label: 'Otro' }
]

export const ALL_DOCUMENTS_OPTIONS = [
    ...documentNaturalOptions,
    { value: 10, label: 'R.U.C.' },
]

export const ESTADO_CIVIL = [
    { value: 1, codestcivil: 'S', desestcivil: 'SOLTERO' },
    { value: 2, codestcivil: 'C', desestcivil: 'CASADO' },
    { value: 3, codestcivil: 'V', desestcivil: 'VIUDO' },
    { value: 4, codestcivil: 'D', desestcivil: 'DIVORCIADO' },
    { value: 5, codestcivil: 'O', desestcivil: 'CONVIVIENTE' }
]