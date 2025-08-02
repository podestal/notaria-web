export const documentoJuridicaOptions = [
    { value: 0, label: 'Seleccione una opción' },
    { value: 1, label: 'R.U.C.' },
    { value: 2, label: 'Sin Documento'},
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
    { value: 8, label: 'Partida de Nacimiento' },
    { value: 9, label: 'Otro' }
]

export const ALL_DOCUMENTS_OPTIONS = [
    ...documentNaturalOptions,
    { value: 10, label: 'R.U.C.' },
]