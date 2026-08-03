import TaxesClient from "./taxesCliente"
import { normalizeTaxesList } from "./normalizeTaxesList"

export interface TipoNotaCredito {
    id_tipo_nota_credito: number
    codigo: string
    descripcion: string
}

export interface TipoNotaDebito {
    id_tipo_nota_debito: number
    codigo: string
    descripcion: string
}

export const tiposNotaCreditoService = new TaxesClient<TipoNotaCredito[]>(
    "/tipos-nota-credito/",
)

export const tiposNotaDebitoService = new TaxesClient<TipoNotaDebito[]>(
    "/tipos-nota-debito/",
)

export const getTiposNotaCredito = async (
    access: string,
): Promise<TipoNotaCredito[]> =>
    normalizeTaxesList(await tiposNotaCreditoService.get(access))

export const getTiposNotaDebito = async (
    access: string,
): Promise<TipoNotaDebito[]> =>
    normalizeTaxesList(await tiposNotaDebitoService.get(access))
