import APIClient from "../apiClient"

// class Libros(models.Model):
//     numlibro = models.CharField(max_length=10)
//     ano = models.CharField(max_length=4)
//     fecing = models.DateField()
//     tipper = models.CharField(max_length=1, blank=True, null=True)
//     apepat = models.CharField(max_length=1000, blank=True, null=True)
//     apemat = models.CharField(max_length=1000, blank=True, null=True)
//     prinom = models.CharField(max_length=1000, blank=True, null=True)
//     segnom = models.CharField(max_length=1000, blank=True, null=True)
//     ruc = models.CharField(max_length=11, blank=True, null=True)
//     domicilio = models.CharField(max_length=2000, blank=True, null=True)
//     coddis = models.CharField(max_length=6, blank=True, null=True)
//     empresa = models.CharField(max_length=5000, blank=True, null=True)
//     domfiscal = models.CharField(max_length=3000, blank=True, null=True)
//     idtiplib = models.IntegerField(blank=True, null=True)
//     descritiplib = models.CharField(max_length=3000, blank=True, null=True)
//     idlegal = models.IntegerField(blank=True, null=True)
//     folio = models.CharField(max_length=20, blank=True, null=True)
//     idtipfol = models.IntegerField(blank=True, null=True)
//     detalle = models.CharField(max_length=3000, blank=True, null=True)
//     idnotario = models.IntegerField(blank=True, null=True)
//     solicitante = models.CharField(max_length=3000, blank=True, null=True)
//     comentario = models.CharField(max_length=3000, blank=True, null=True)
//     feclegal = models.CharField(max_length=12, blank=True, null=True)
//     comentario2 = models.CharField(max_length=3000, blank=True, null=True)
//     dni = models.CharField(max_length=11, blank=True, null=True)
//     idusuario = models.IntegerField(blank=True, null=True)
//     idnlibro = models.IntegerField(blank=True, null=True)
//     codclie = models.CharField(max_length=10, blank=True, null=True)
//     flag = models.IntegerField(blank=True, null=True)
//     numdoc_plantilla = models.CharField(max_length=11, blank=True, null=True)
//     estadosisgen = models.IntegerField(db_column='estadoSisgen', blank=True, null=True)  # Field name made lowercase.

export interface LibrosPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Libro[];
}

export interface Libro {
    id: number;
    numlibro: string;
    ano: string;
    fecing: string; // Date as string
    tipper: string | null;
    apepat: string | null;
    apemat: string | null;
    prinom: string | null;
    segnom: string | null;
    ruc: string | null;
    domicilio: string | null;
    coddis: string | null;
    empresa: string | null;
    domfiscal: string | null;
    idtiplib: number | null;
    descritiplib: string | null;
    idlegal: number | null;
    folio: string | null;
    idtipfol: number | null;
    detalle: string | null;
    idnotario: number | null;
    solicitante: string | null;
    comentario: string | null;
    feclegal: string | null; // Date as string
    comentario2: string | null;
    dni: string | null;
    idusuario: number | null;
    idnlibro: number | null;
    codclie: string | null;
    flag: number | null;
    numdoc_plantilla: string | null; // Assuming this is a document template ID
}

export type CreateUpdateLibro = Omit<Libro, 'id' | 'numlibro' | 'ano'>;

interface Props {
    libroId?: number;
}

export const getLibrosServiceSingle = ({ libroId }: Props) => {
    let url = '/libros/';
    if (libroId) {
        url += `${libroId}/`;
    }
    return new APIClient<Libro, CreateUpdateLibro>(url);
}

const getLibrosService = () => {
    return new APIClient<LibrosPage, CreateUpdateLibro>('/libros/');
}

export default getLibrosService;