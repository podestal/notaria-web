import { useEffect, useState } from "react"
import ActoCondicionFilters from "./ActoCondicionFilters"
import ActoCondicionList from "./ActoCondicionList"

const ActoCondicionMain = () => {
    const [desacto, setDesacto] = useState("")
    const [idtipoacto, setIdtipoacto] = useState("")
    const [idtipkar, setIdtipkar] = useState("")
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(1)
    }, [desacto, idtipoacto, idtipkar])

    const limpiar = () => {
        setDesacto("")
        setIdtipoacto("")
        setIdtipkar("")
        setPage(1)
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Acto / condición</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Consulte tipos de acto filtrando por descripción, código de tipo de acto o tipo de kardex.
                </p>
            </header>

            <ActoCondicionFilters
                desacto={desacto}
                setDesacto={setDesacto}
                idtipoacto={idtipoacto}
                setIdtipoacto={setIdtipoacto}
                idtipkar={idtipkar}
                setIdtipkar={setIdtipkar}
                onLimpiar={limpiar}
            />

            <ActoCondicionList
                desacto={desacto}
                idtipoacto={idtipoacto}
                idtipkar={idtipkar}
                page={page}
                setPage={setPage}
            />
        </div>
    )
}

export default ActoCondicionMain
