import APIClient from "./apiClient"

// id = models.AutoField(primary_key=True)
// idcontratante = models.CharField(max_length=15, blank=True, null=True)
// kardex = models.CharField(max_length=15, blank=True, null=True)
// idtipoacto = models.CharField(max_length=15, blank=True, null=True)
// facultades = models.CharField(max_length=150, blank=True, null=True)
// inscrito = models.CharField(max_length=50, blank=True, null=True)
// sede_registral = models.CharField(max_length=15, blank=True, null=True)
// partida = models.CharField(max_length=50, blank=True, null=True)
// idcontratante_r = models.CharField(max_length=15, blank=True, null=True)
// id_ro_repre = models.CharField(max_length=50, blank=True, null=True)
// ido = models.CharField(db_column='idO', max_length=5, blank=True, null=True)  # Field name made lowercase.
// odb = models.CharField(

export interface Representante {
    id: number;
    idcontratante: string;
    kardex: string;
    idtipoacto: string | null;
    facultades: string;
    inscrito: string;
    sede_registral: string;
    partida: string;
    idcontratante_r: string;
    id_ro_repre: string | null;
    ido: string | null; 
    odb: string | null; 
}

export type CreateUpdateRepresentante = Omit<Representante, 'id'>

interface Props {
    representanteId?: string;
}

const getRepresentantesService = ({ representanteId }: Props) => {
    let url = '/representantes/';
    if (representanteId) {
        url = `/representantes/${representanteId}/`;
    }
    return new APIClient<Representante, CreateUpdateRepresentante>(url);
}
export default getRepresentantesService;