import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import PersonasFilters from "./PersonasFilters"
import PersonasList from "./PersonasList"

const PersonasMain = () => {
    const [page, setPage] = useState(1)
    const [nombres, setNombres] = useState("")
    const [apellidoPaterno, setApellidoPaterno] = useState("")
    const [apellidoMaterno, setApellidoMaterno] = useState("")
    const [razonSocial, setRazonSocial] = useState("")
    const [numeroDocumento, setNumeroDocumento] = useState("")

    useEffect(() => {
        setPage(1)
    }, [nombres, apellidoPaterno, apellidoMaterno, razonSocial, numeroDocumento])

    const handleClearFilters = () => {
        setNombres("")
        setApellidoPaterno("")
        setApellidoMaterno("")
        setRazonSocial("")
        setNumeroDocumento("")
        setPage(1)
    }

    const hasFilters =
        nombres.trim() !== "" ||
        apellidoPaterno.trim() !== "" ||
        apellidoMaterno.trim() !== "" ||
        razonSocial.trim() !== "" ||
        numeroDocumento.trim() !== ""

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 flex items-start gap-3 border-b border-sky-100 pb-3">
                <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                    <Users className="h-5 w-5 text-sky-600" aria-hidden />
                </div>
                <div>
                    <h2 className="text-base font-semibold text-slate-800">Personas</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Clientes y contactos registrados para facturación.
                    </p>
                </div>
            </header>

            <PersonasFilters
                nombres={nombres}
                apellido_paterno={apellidoPaterno}
                apellido_materno={apellidoMaterno}
                razon_social={razonSocial}
                numero_documento={numeroDocumento}
                setNombres={setNombres}
                setApellidoPaterno={setApellidoPaterno}
                setApellidoMaterno={setApellidoMaterno}
                setRazonSocial={setRazonSocial}
                setNumeroDocumento={setNumeroDocumento}
                onClear={handleClearFilters}
            />

            <PersonasList
                page={page}
                setPage={setPage}
                nombres={nombres}
                apellido_paterno={apellidoPaterno}
                apellido_materno={apellidoMaterno}
                razon_social={razonSocial}
                numero_documento={numeroDocumento}
                hasFilters={hasFilters}
            />
        </section>
    )
}

export default PersonasMain
