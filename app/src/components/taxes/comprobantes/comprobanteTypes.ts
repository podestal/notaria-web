import type { Ingreso } from "../../../services/taxes/ingresosService"
import type { Recibo } from "../../../services/taxes/recibosService"

export type ComprobanteVariant = "ingreso" | "recibo"

export type ComprobanteItem = Ingreso | Recibo

export const isIngreso = (item: ComprobanteItem): item is Ingreso =>
    "id_ingreso" in item

export const isRecibo = (item: ComprobanteItem): item is Recibo =>
    "id_recibo" in item

export const getComprobanteItemId = (item: ComprobanteItem): number =>
    isIngreso(item) ? item.id_ingreso : item.id_recibo

export const getComprobanteSerieNumero = (item: ComprobanteItem) =>
    `${item.serie || "—"}-${item.numero ?? "—"}`
