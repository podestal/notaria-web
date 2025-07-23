import APIClient from "../apiClient"

    // idlegalizacion = models.AutoField(db_column='idLegalizacion', primary_key=True)  # Field name made lowercase.
    // fechaingreso = models.DateField(db_column='fechaIngreso')  # Field name made lowercase.
    // direccioncertificado = models.CharField(db_column='direccionCertificado', max_length=250)  # Field name made lowercase.
    // documento = models.TextField()
    // dni = models.CharField(max_length=11, blank=True, null=True)

export interface LegalizacionPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Legalizacion[];
}

export interface Legalizacion {
    idlegalizacion: number;
    fechaingreso: string;
    direccioncertificado: string;
    documento: string;
    dni: string;
}

export type LegalizacionCreateUpdate = Omit<Legalizacion, 'idlegalizacion'>

interface Props {
    legalizacionId?: number;
}

const getLegalizacionService = ({ legalizacionId }: Props = {}) => {
    const endpoint = legalizacionId ? `/legalizacion/${legalizacionId}/` : '/legalizacion/';
    return new APIClient<LegalizacionPage, LegalizacionCreateUpdate>(endpoint);
}

export default getLegalizacionService;