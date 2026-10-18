import type { Dispatch, SetStateAction } from "react"
import useGetTipoKardexList from "../../../hooks/api/tipoKardex/useGetTipoKardexList"
import ExtraFiltersShell, {
    ExtraFilterField,
    ExtraFilterSearchButton,
    ExtraFilterSelectField,
    ExtraFilterTextField,
    EXTRA_FILTER_INPUT_CLASS,
} from "../extraprotocolares/ExtraFiltersShell"

interface Props {
    desacto: string
    setDesacto: Dispatch<SetStateAction<string>>
    idtipoacto: string
    setIdtipoacto: Dispatch<SetStateAction<string>>
    idtipkar: string
    setIdtipkar: Dispatch<SetStateAction<string>>
    onLimpiar: () => void
}

const ActoCondicionFilters = ({
    desacto,
    setDesacto,
    idtipoacto,
    setIdtipoacto,
    idtipkar,
    setIdtipkar,
    onLimpiar,
}: Props) => {
    const { data: tipoKardexList } = useGetTipoKardexList()
    const options = Array.isArray(tipoKardexList) ? tipoKardexList : []

    const kardexOptions = [
        { value: "", label: "Todos" },
        ...options.map((k) => ({
            value: String(k.idtipkar),
            label: `${k.idtipkar} — ${k.nomtipkar}`,
        })),
    ]

    return (
        <ExtraFiltersShell title="Búsqueda por:" columns={2}>
            <ExtraFilterTextField
                label="Descripción"
                value={desacto}
                onChange={setDesacto}
                placeholder="Buscar por desacto…"
                index={0}
            />
            <ExtraFilterField label="Id tipo acto" index={1}>
                <input
                    id="acto-idtipoacto"
                    type="text"
                    value={idtipoacto}
                    onChange={(e) => setIdtipoacto(e.target.value)}
                    placeholder="Ej. 039"
                    className={`${EXTRA_FILTER_INPUT_CLASS} font-mono`}
                />
            </ExtraFilterField>
            <ExtraFilterSelectField
                label="Tipo kardex"
                value={idtipkar}
                onChange={setIdtipkar}
                options={kardexOptions}
                index={2}
            />
            <ExtraFilterSearchButton
                type="button"
                variant="clear"
                label="Limpiar"
                onClick={onLimpiar}
                index={3}
                colSpan={1}
            />
        </ExtraFiltersShell>
    )
}

export default ActoCondicionFilters
