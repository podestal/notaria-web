import APIClient from "../apiClient"

export interface ViajeContratante {
    id_viaje: number;
    id_contratante: number;
    c_codcontrat: string;
    c_descontrat: string;
    c_fircontrat: string;
    c_condicontrat: string;
    edad: string;
    condi_edad: string;
    codi_testigo: string;
    tip_incapacidad: string;
    codi_podera: string;
    partida_e: string;
    sede_regis: string;
    tipper?: string;
    idtipdoc?: number;
    numdoc?: string;
    apepat?: string;
    apemat?: string;
    prinom?: string;
    segnom?: string;
    nombre?: string;
    direccion?: string;
    idubigeo?: string;
    idestcivil?: number | null;
    sexo?: string;
    nacionalidad?: string;
    email?: string;
    telfijo?: string;
    telcel?: string;
    telofi?: string;
    idprofesion?: number | null;
    idcargoprofe?: number | null;
    detaprofesion?: string | null;
    cumpclie?: string;
    resedente?: string;
}

export type CreateUpdateViajeContratante = Omit<ViajeContratante, 'id_contratante'>;

interface Props {
    contratanteId?: number;
    byViaje?: boolean;
}

const getViajeContratanteService = ({ contratanteId, byViaje }: Props) => {
    let url = '/viaje_contratantes/';
    if (contratanteId) {
        url += `${contratanteId}/`;
    } else if (byViaje) {
        url += `by_viaje/`;
    }
    return new APIClient<ViajeContratante, CreateUpdateViajeContratante>(url);
}

export default getViajeContratanteService;