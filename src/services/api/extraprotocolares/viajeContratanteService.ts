import APIClient from "../apiClient"

// class ViajeContratantes(models.Model):
//     id_viaje = models.IntegerField(blank=True, null=True)
//     id_contratante = models.AutoField(primary_key=True)
//     c_codcontrat = models.CharField(max_length=30, blank=True, null=True)
//     c_descontrat = models.CharField(max_length=2000, blank=True, null=True)
//     c_fircontrat = models.CharField(max_length=20, blank=True, null=True)
//     c_condicontrat = models.CharField(max_length=30, blank=True, null=True)
//     edad = models.CharField(max_length=10, blank=True, null=True)
//     condi_edad = models.CharField(max_length=10, blank=True, null=True)
//     codi_testigo = models.CharField(max_length=2000, blank=True, null=True)
//     tip_incapacidad = models.CharField(max_length=2000, blank=True, null=True)
//     codi_podera = models.CharField(max_length=100, blank=True, null=True)
//     partida_e = models.CharField(max_length=2000, blank=True, null=True)
//     sede_regis = models.CharField(max_length=2000, blank=True, null=True)

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