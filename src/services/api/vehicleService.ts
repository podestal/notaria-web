import APIClient from "./apiClient"

export interface Vehicle {
    detveh: number;
    kardex: string;
    idtipacto: string;
    idplaca: string;
    numplaca: string;
    clase: string;
    marca: string;
    anofab: string;
    modelo: string;
    combustible: string;
    carroceria: string;
    fecinsc: string;
    color: string;
    motor: string;
    numcil: string;
    numserie: string;
    numrueda: string;
    idmon: string;
    precio: string;
    codmepag: string;
    pregistral: string; 
    idsedereg: string; 
}

export type CreateUpdateVEhicle = Omit<Vehicle,
    'detveh' >


interface Props {
    vehicleId?: number
    byKardex?: boolean
}

const getVehicleService = ({ vehicleId, byKardex }: Props) => {
    let url = '/detallevehicular/';
    if (vehicleId) {
        url += `${vehicleId}/`;
    } else if (byKardex) {
        url += 'by_kardex/';
    }
    return new APIClient<Vehicle, CreateUpdateVEhicle>(url);
}

export default getVehicleService;
