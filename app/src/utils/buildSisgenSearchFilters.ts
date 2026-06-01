import moment from "moment"

export interface SisgenSearchFilters {
    fechaDesde: string
    fechaHasta: string
    tipoInstrumento: number
    estado: number
    codigoActo: number
}

interface BuildProps {
    instrumentType: number
    selectedFromDate: Date | undefined
    selectedToDate: Date | undefined
    selectedEstado: number
}

export type SisgenSearchFiltersResult =
    | { ok: true; filters: SisgenSearchFilters }
    | { ok: false; error: string }

export const buildSisgenSearchFilters = ({
    instrumentType,
    selectedFromDate,
    selectedToDate,
    selectedEstado,
}: BuildProps): SisgenSearchFiltersResult => {
    if (!selectedFromDate) {
        return { ok: false, error: "Por favor, seleccione una fecha de inicio." }
    }
    if (!selectedToDate) {
        return { ok: false, error: "Por favor, seleccione una fecha de fin." }
    }
    if (selectedFromDate > selectedToDate) {
        return {
            ok: false,
            error: "La fecha de inicio no puede ser posterior a la fecha de fin.",
        }
    }

    return {
        ok: true,
        filters: {
            fechaDesde: moment(selectedFromDate).format("YYYY-MM-DD"),
            fechaHasta: moment(selectedToDate).format("YYYY-MM-DD"),
            tipoInstrumento: instrumentType,
            estado: selectedEstado,
            codigoActo: 0,
        },
    }
}
