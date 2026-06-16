import {
    DEFAULT_BOLETA_SERIE,
    DEFAULT_SERIE,
} from "../controlInterno/ingresoFormShared"

export const DEFAULT_FACTURA_SERIE = "F001"
export const DEFAULT_NOTA_CREDITO_SERIE = "FC01"
export const DEFAULT_NOTA_DEBITO_SERIE = "FD01"

export type EmisionFormVariant =
    | "ingreso"
    | "boleta"
    | "factura"
    | "nota_credito"
    | "nota_debito"

export interface EmisionFormVariantConfig {
    defaultSerie: string
    isRecibo: boolean
    entityLabel: string
    createSuccessMessage: string
    createSubmitLabel: string
}

export const EMISION_FORM_VARIANT_CONFIG: Record<
    EmisionFormVariant,
    EmisionFormVariantConfig
> = {
    ingreso: {
        defaultSerie: DEFAULT_SERIE,
        isRecibo: false,
        entityLabel: "el ingreso",
        createSuccessMessage: "Ingreso creado correctamente",
        createSubmitLabel: "Crear ingreso",
    },
    boleta: {
        defaultSerie: DEFAULT_BOLETA_SERIE,
        isRecibo: true,
        entityLabel: "la boleta",
        createSuccessMessage: "Boleta creada correctamente",
        createSubmitLabel: "Crear boleta",
    },
    factura: {
        defaultSerie: DEFAULT_FACTURA_SERIE,
        isRecibo: true,
        entityLabel: "la factura",
        createSuccessMessage: "Factura creada correctamente",
        createSubmitLabel: "Crear factura",
    },
    nota_credito: {
        defaultSerie: DEFAULT_NOTA_CREDITO_SERIE,
        isRecibo: true,
        entityLabel: "la nota de crédito",
        createSuccessMessage: "Nota de crédito creada correctamente",
        createSubmitLabel: "Crear nota de crédito",
    },
    nota_debito: {
        defaultSerie: DEFAULT_NOTA_DEBITO_SERIE,
        isRecibo: true,
        entityLabel: "la nota de débito",
        createSuccessMessage: "Nota de débito creada correctamente",
        createSubmitLabel: "Crear nota de débito",
    },
}
