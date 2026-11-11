import { useState } from 'react'
import { motion } from 'framer-motion'
import { PdtError } from '../../../../../services/api/pdtKardexErrors'
import TopModal from '../../../../ui/TopModal'
import PreKardexForm from '../../registrosUif/PreKardexForm'
import getTitleCase from '../../../../../utils/getTitleCase'
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from '../../../extraprotocolares/ExtraTableShell'
import { rowMotionProps } from '../../../extraprotocolares/rowMotion'
import useUserInfoStore from '../../../../../hooks/store/useGetUserInfo'
import useAuthStore from '../../../../../store/useAuthStore'
import useGetComplianceKardexErrors from '../../../../../hooks/compliance/useGetComplianceKardexErrors'
import ComplianceKardexErrorsPanel from '../../../kardex/kardexErrors/ComplianceKardexErrorsPanel'

export const PDT_KARDEX_GRID =
    "auto minmax(110px,1fr) minmax(160px,1.6fr) minmax(200px,2.2fr) minmax(56px,0.6fr)"

interface Props {
    error: PdtError
    index?: number
    selected: boolean
    onToggle: (selected: boolean) => void
}

const ArchivosPdtKardexCard = ({ error, index = 0, selected, onToggle }: Props) => {
    const [open, setOpen] = useState(false)
    const correctable = Number(error.isCorrectable) === 1
    const user = useUserInfoStore((s) => s.user)
    const isSuperuser = Number(user?.is_superuser) !== 0
    const access = useAuthStore((s) => s.access_token) || ""

    const {
        data,
        isLoading,
        isError,
        error: loadError,
        refetch,
        isFetching,
    } = useGetComplianceKardexErrors({
        access,
        kardex: error.kardex,
        enabled: open && isSuperuser,
    })
    const isRefreshing = isFetching && !isLoading

    return (
    <>
    <motion.div
        {...rowMotionProps(index)}
        className={`${EXTRA_ROW_CLASS} items-center`}
        style={{ gridTemplateColumns: PDT_KARDEX_GRID }}
    >
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <input
                type="checkbox"
                className="h-3.5 w-3.5 cursor-pointer accent-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                checked={correctable && selected}
                disabled={!correctable}
                title={correctable ? "Marcar para subsanar" : "Este error no es autocorregible"}
                onChange={(e) => onToggle(e.target.checked)}
            />
        </div>
        <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setOpen(true)
                }
            }}
            className="cursor-pointer"
        >
            <span className={EXTRA_ID_BADGE_CLASS}>{error.kardex}</span>
        </div>
        <p
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            className="cursor-pointer leading-snug text-slate-800"
        >
            {getTitleCase(error.act || '') || '—'}
        </p>
        <p
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            className="cursor-pointer leading-snug text-slate-600"
        >
            {error.errorItem || '—'}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {error.fileType || '—'}
        </p>
    </motion.div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
        portal
        wide={isSuperuser}
    >
        {isSuperuser ? (
            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-0">
                <div className="flex max-h-[32vh] shrink-0 flex-col lg:max-h-none lg:w-72">
                    {isLoading && (
                        <aside className="flex h-full min-h-[8rem] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 lg:rounded-none lg:border-r lg:border-y-0">
                            Cargando errores...
                        </aside>
                    )}
                    {isError && !data && (
                        <aside className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700 lg:rounded-none lg:border-r lg:border-y-0">
                            <p className="text-center">
                                {loadError?.message || "No se pudieron cargar los errores."}
                            </p>
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="cursor-pointer rounded-lg border border-red-300 bg-white px-2 py-1 text-[10px] font-semibold hover:bg-red-50"
                            >
                                Reintentar
                            </button>
                        </aside>
                    )}
                    {data && (
                        <ComplianceKardexErrorsPanel
                            data={data}
                            className="h-full lg:max-h-none"
                            onRefresh={() => refetch()}
                            isRefreshing={isRefreshing}
                        />
                    )}
                </div>
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto lg:pl-4">
                    <PreKardexForm isOpen={open} kardexId={error.idKardex} />
                </main>
            </div>
        ) : (
            <PreKardexForm isOpen={open} kardexId={error.idKardex} />
        )}
    </TopModal>
    </>
  )
}

export default ArchivosPdtKardexCard
