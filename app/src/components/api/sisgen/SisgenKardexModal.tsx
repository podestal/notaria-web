import ComplianceKardexModal from "../kardex/kardexErrors/ComplianceKardexModal"
import useRefreshLastSisgenSearch from "../../../hooks/sisgen/useRefreshLastSisgenSearch"
import SisgenPointerStyles from "./SisgenPointerStyles"

interface Props {
    isOpen: boolean
    onClose: () => void
    idkardex: number
    kardex: string
    portal?: boolean
}

/** Same Errores / Historial chrome as PDT and UIF. */
const SisgenKardexModal = ({
    isOpen,
    onClose,
    idkardex,
    kardex,
    portal = false,
}: Props) => {
    const refreshLastSisgenSearch = useRefreshLastSisgenSearch()

    return (
        <ComplianceKardexModal
            isOpen={isOpen}
            onClose={onClose}
            idkardex={idkardex}
            kardex={kardex}
            portal={portal}
            beforeSide={<SisgenPointerStyles />}
            onErrorsRefreshed={refreshLastSisgenSearch}
        />
    )
}

export default SisgenKardexModal
