import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Kardex } from "../../../services/api/kardexService"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"
import ClientesCheck from "../clientes/ClientesCheck"
import ContratantesTableBody from "./ContratantesTableBody"
import ContratantesTableHeader from "./ContratantesTableHeader"

interface Props {
    kardex: Kardex
}

const ContratantesTable = ({ kardex }: Props) => {
    const { data: contratantes } = useGetContratantesByKardex({
        kardex: kardex.kardex,
    })
    const count = Array.isArray(contratantes) ? contratantes.length : 0

    return (
        <div className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600">
                        <Users className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Contratantes</p>
                        <p className="text-[11px] text-slate-500">
                            <motion.span
                                key={count}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block font-semibold text-slate-700"
                            >
                                {count}
                            </motion.span>{" "}
                            {count === 1 ? "registrado" : "registrados"}
                        </p>
                    </div>
                </div>
                <ClientesCheck
                    idtipoacto={kardex.codactos}
                    idtipkar={kardex.idtipkar}
                    kardex={kardex.kardex}
                    compact
                />
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                    <ContratantesTableHeader />
                    <ContratantesTableBody kardex={kardex} />
                </div>
            </div>
        </div>
    )
}

export default ContratantesTable
