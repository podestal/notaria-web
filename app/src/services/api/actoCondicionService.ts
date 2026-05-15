import APIClient from "./apiClient"

// idcondicion = models.CharField(primary_key=True, max_length=3)
// idtipoacto = models.CharField(max_length=6)
// condicion = models.CharField(max_length=100)
// parte = models.CharField(max_length=20, blank=True, null=True)
// uif = models.CharField(max_length=20, blank=True, null=True)
// formulario = models.CharField(max_length=20, blank=True, null=True)
// montop = models.CharField(max_length=20, blank=True, null=True)
// totorgante = models.CharField(max_length=2, blank=True, null=True)
// condicionsisgen = models.CharField(max_length=100, blank=True, null=True)
// codconsisgen = models.CharField(max_length=5, blank=True, null=True)
// parte_generacion = models.CharField(max_length=1, blank=True, null=True)

export interface ActoCondicion {
    idcondicion: string | number;
    idtipoacto: string;
    condicion: string;
    parte?: string;
    uif?: string;
    formulario?: string;
    montop?: string;
    totorgante?: string;
    condicionsisgen?: string;
    codconsisgen?: string;
    parte_generacion?: string;
}

/** Alta: `idcondicion` lo asigna el backend. */
export type CreateActoCondicionPayload = Omit<ActoCondicion, "idcondicion"> & {
    idcondicion?: string;
}

interface Props {
    byTipoActo?: boolean;
}

const getActoCondicionService = ({ byTipoActo }: Props) => {
    let url = '/actocondicion/'
    if (byTipoActo) {
        url += 'by_tipoacto/'
    }

    return new APIClient<ActoCondicion>(url)
}

/** POST crear condición en la colección principal. */
export const getActoCondicionWriteClient = () => {
    return new APIClient<ActoCondicion, CreateActoCondicionPayload>("/actocondicion/")
}

export type UpdateActoCondicionPayload = Partial<Omit<ActoCondicion, "idcondicion">>

/** PATCH / DELETE por `idcondicion` (clave primaria). */
export const getActoCondicionDetailClient = (idcondicion: string | number) => {
    const id = encodeURIComponent(String(idcondicion ?? "").trim())
    return new APIClient<ActoCondicion, UpdateActoCondicionPayload>(`/actocondicion/${id}/`)
}

export default getActoCondicionService
