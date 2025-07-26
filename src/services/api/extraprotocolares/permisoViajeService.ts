import APIClient from "../apiClient"

export interface PermisoViajePage {
    count: number;
    next: string | null;
    previous: string | null;
    results: PermisoViaje[];
}

export interface PermisoViaje {
    id_viaje: number;
    num_kardex: string;
    asunto: string;
    fec_ingreso: string; // Date as string
    nom_recep: string;
    hora_recep: string;
    referencia: string;
    nom_comu: string;
    tel_comu: string;
    email_comu: string;
    documento: string;
    num_crono: string;
    fecha_crono: string; // Date as string
    num_formu: string;
    lugar_formu: string;
    observacion: string;
    swt_est: string;
    partida_e: string;
    sede_regis: string;
    qr: number;
    via: string;
    fecha_desde: Date;
    fecha_hasta: Date;
}

export type CreateUpdatePermisoViaje = Omit<PermisoViaje, 'id_viaje'>;

interface Props {
    permisoViajeId?: number;
}

const getPermisoViajeService = ({ permisoViajeId }: Props) => {
    let url = '/permi_viaje/';
    if (permisoViajeId) {
        url += `${permisoViajeId}/`;
    }
    return new APIClient<PermisoViajePage, CreateUpdatePermisoViaje>(url)
}

export default getPermisoViajeService;