import APIClient from "../apiClient";

// id_poder = models.IntegerField(blank=True, null=True)
// id_pension = models.AutoField(primary_key=True)
// p_crono = models.CharField(max_length=50, blank=True, null=True)
// p_fecha = models.CharField(max_length=30, blank=True, null=True)
// p_numformu = models.CharField(max_length=30, blank=True, null=True)
// p_domicilio = models.CharField(max_length=500, blank=True, null=True)
// p_pension = models.CharField(max_length=500, blank=True, null=True)
// p_mespension = models.CharField(max_length=500, blank=True, null=True)
// p_anopension = models.CharField(max_length=500, blank=True, null=True)
// p_plazopoder = models.CharField(max_length=500, blank=True, null=True)
// p_fecotor = models.CharField(max_length=30, blank=True, null=True)
// p_fecvcto = models.CharField(max_length=30, blank=True, null=True)
// p_presauto = models.CharField(max_length=1000, blank=True, null=True)
// p_observ = models.TextField(blank=True, null=True)

export interface PoderPension {
    id_poder: number;
    id_pension: number;
    p_crono: string;
    p_fecha: string;
    p_numformu: string;
    p_domicilio: string;
    p_pension: string;
    p_mespension: string;
    p_anopension: string;
    p_plazopoder: string;
    p_fecotor: string;
    p_fecvcto: string;
    p_presauto: string;
    p_observ: string;
}

export type CreateUpdatePoderPension = Omit<PoderPension, "id_pension">;

interface Props {
    idPoderPension?: number;
    byPoder?: boolean;
}

const getPoderPensionService = ({ idPoderPension, byPoder }: Props) => {
    let url = '/poderes_pension/'
    if (idPoderPension) {
        url += `${idPoderPension}/`
    }
    if (byPoder) {
        url += 'by_poder/'
    }
    return new APIClient<PoderPension, CreateUpdatePoderPension>(url)
}

export default getPoderPensionService