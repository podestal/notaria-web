import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import useAuthStore from "../../../../../store/useAuthStore"
import useUserInfoStore from "../../../../../hooks/store/useGetUserInfo"
import useGetPdtMisErrores from "../../../../../hooks/api/kardex/pdt/useGetPdtMisErrores"
import useGetPdtRankingErrores from "../../../../../hooks/api/kardex/pdt/useGetPdtRankingErrores"
import type { PdtMisError, PdtMisErrorUrgency } from "../../../../../services/api/pdtMisErrores"
import getTitleCase from "../../../../../utils/getTitleCase"
import ReportPageShell from "../../../../ui/ReportPageShell"
import ReportHeader from "../../../../ui/ReportHeader"
import LoadingState from "../../../../ui/LoadingState"
import TopModal from "../../../../ui/TopModal"
import PreKardexForm from "../../registrosUif/PreKardexForm"

const YEAR_START = 2021
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - YEAR_START + 1 }, (_, i) => currentYear - i)

const URGENCY_CLASS: Record<PdtMisErrorUrgency["tone"], string> = {
    red: "bg-red-600 text-white",
    tomato: "bg-red-400 text-white",
    yellow: "bg-yellow-300 text-slate-900",
    green: "bg-lime-300 text-green-800",
}

const MisErroresPdt = () => {
    const access = useAuthStore((s) => s.access_token) || ""
    const me = useUserInfoStore((s) => s.user)
    const [searchParams, setSearchParams] = useSearchParams()
    const [year, setYear] = useState(currentYear)
    const [openKardexId, setOpenKardexId] = useState<number | null>(null)

    const usuarioParam = (searchParams.get("usuario") || "").trim()
    const usuario = usuarioParam || me?.username || ""

    const { data, isLoading, isError, error } = useGetPdtMisErrores({
        access,
        year,
        usuario,
    })
    const rankingQuery = useGetPdtRankingErrores({ access, year })

    const rows = data?.list ?? []
    const viewingOther = Boolean(usuarioParam && me?.username && usuarioParam !== me.username)

    const yearSelect = (
        <label className="flex items-center gap-2 text-xs text-slate-200">
            <span>Año</span>
            <select
                className="cursor-pointer rounded-md border border-slate-500 bg-slate-800 px-2 py-1 text-xs text-white"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
            >
                {YEARS.map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>
        </label>
    )

    const subtitle = useMemo(() => {
        if (viewingOther) return `Errores de ${usuario} · ${year}`
        return "Tareas pendientes del PDT Notarios"
    }, [viewingOther, usuario, year])

    return (
        <ReportPageShell>
            <ReportHeader
                title="Mis errores en el PDT Notarios"
                subtitle={subtitle}
                actions={yearSelect}
            />

            <div className="grid gap-6 p-6 lg:grid-cols-[minmax(240px,320px)_1fr]">
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                    <h3 className="mb-3 text-sm font-semibold text-slate-800">
                        Ranking de trabajadores
                    </h3>
                    {rankingQuery.isLoading && (
                        <p className="text-xs text-slate-500">Cargando ranking…</p>
                    )}
                    {rankingQuery.isError && (
                        <p className="text-xs text-red-600">No se pudo cargar el ranking.</p>
                    )}
                    {rankingQuery.data && (
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                                    <th className="py-1.5 pr-2">N°</th>
                                    <th className="py-1.5 pr-2">Trabajador</th>
                                    <th className="py-1.5 text-right">Errores</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(rankingQuery.data.ranking ?? []).map((row, idx) => {
                                    const active = row.user.toLowerCase() === usuario.toLowerCase()
                                    return (
                                        <tr
                                            key={row.user}
                                            className={`cursor-pointer border-b border-slate-100 ${
                                                active ? "bg-indigo-50 font-semibold text-indigo-800" : "hover:bg-white"
                                            }`}
                                            onClick={() => setSearchParams({ usuario: row.user })}
                                        >
                                            <td className="py-1.5 pr-2 tabular-nums text-slate-400">{idx + 1}</td>
                                            <td className="max-w-[10rem] truncate py-1.5 pr-2" title={row.nombre}>
                                                {getTitleCase(row.nombre || row.user)}
                                            </td>
                                            <td className="py-1.5 text-right tabular-nums">{row.total}</td>
                                        </tr>
                                    )
                                })}
                                {(rankingQuery.data.ranking ?? []).length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-4 text-center text-slate-500">
                                            Sin errores este año
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                    {viewingOther && (
                        <button
                            type="button"
                            className="mt-3 cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            onClick={() => setSearchParams({})}
                        >
                            Ver mis errores
                        </button>
                    )}
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: 0.06 }}
                >
                    {isLoading && (
                        <LoadingState
                            message="Cargando errores PDT…"
                            description="Consultando renta, bienes, origen de fondos y conclusión"
                        />
                    )}
                    {isError && (
                        <p className="text-center text-sm text-red-600">{error?.message}</p>
                    )}
                    {data && (
                        <>
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                                    {data.total} error{data.total === 1 ? "" : "es"}
                                </span>
                                <span className="text-slate-500">Renta {data.counts.renta}</span>
                                <span className="text-slate-500">Bienes {data.counts.bien}</span>
                                <span className="text-slate-500">Fondos {data.counts.ofondo}</span>
                                <span className="text-slate-500">Conclusión {data.counts.conclusion}</span>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="min-w-full text-left text-xs">
                                    <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-600">
                                        <tr>
                                            <th className="px-3 py-2">N°</th>
                                            <th className="px-3 py-2">Kardex</th>
                                            <th className="px-3 py-2">Fecha</th>
                                            <th className="px-3 py-2">Acto</th>
                                            <th className="px-3 py-2">Descripción del error</th>
                                            <th className="px-3 py-2">Usuario</th>
                                            <th className="px-3 py-2">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row: PdtMisError, idx) => (
                                            <tr key={`${row.kind}-${row.idkardex}-${idx}`} className="border-t border-slate-100 transition-colors hover:bg-sky-50/70">
                                                <td className="px-3 py-2 tabular-nums text-slate-400">{row.idkardex}</td>
                                                <td className="px-3 py-2">
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer font-mono font-semibold text-sky-700 hover:text-sky-900"
                                                        onClick={() => setOpenKardexId(row.idkardex)}
                                                    >
                                                        {row.kardex}
                                                    </button>
                                                </td>
                                                <td className="px-3 py-2 tabular-nums text-slate-600">
                                                    {row.fechaescritura || "—"}
                                                </td>
                                                <td className="max-w-[14rem] px-3 py-2 text-slate-800">
                                                    {getTitleCase(row.contrato)}
                                                </td>
                                                <td className="px-3 py-2 text-slate-800">{row.error}</td>
                                                <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                                                    {row.responsable}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                                            URGENCY_CLASS[row.urgencia.tone]
                                                        }`}
                                                    >
                                                        {row.urgencia.level === "urgent" && (
                                                            <AlertTriangle className="h-3 w-3" />
                                                        )}
                                                        {row.urgencia.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {rows.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                                                    Sin errores PDT para este usuario en {year}.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </motion.section>
            </div>

            <TopModal isOpen={openKardexId != null} onClose={() => setOpenKardexId(null)} portal>
                {openKardexId != null && (
                    <PreKardexForm isOpen={openKardexId != null} kardexId={openKardexId} />
                )}
            </TopModal>
        </ReportPageShell>
    )
}

export default MisErroresPdt
