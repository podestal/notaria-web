const getTipoActoIdArray = (codactos: string) => {
    if (!codactos) return []
    const tipoActoIdArray = []
    let i = 0
    while (i < codactos.length) {
        tipoActoIdArray.push(codactos.substring(i, i + 3))
        i += 3
    }
    return tipoActoIdArray
}

export default getTipoActoIdArray