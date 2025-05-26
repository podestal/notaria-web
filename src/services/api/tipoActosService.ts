import APIClient from "./apiClient";

// "idtipoacto": "039",
// "actosunat": "14",
// "actouif": "015",
// "idtipkar": 1,
// "desacto": "CONTRATO DE COLABORACION EMPRESARIAL",
// "umbral": 2500,
// "impuestos": 0,
// "idcalnot": 0,
// "idecalreg": 0,
// "idmodelo": 0,
// "rol_part": "O",
// "cod_ancert": "0226",
// "tipoplantilla_default": null

export interface TipoActo {
    idtipoacto: string;
    actosunat: string;
    actouif: string;
    idtipkar: number;
    desacto: string;
    umbral: number;
    impuestos: number;
}

const getTipoActosService = () => {
    let url = '/tiposdeactos/'
    return new APIClient<TipoActo, TipoActo>(url);
}

export default getTipoActosService