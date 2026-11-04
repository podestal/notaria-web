import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, FileSearch, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { PdtError } from '../../../../../services/api/pdtKardexErrors'
import ArchivosPdtKardexCard, { PDT_KARDEX_GRID } from './ArchivosPdtKardexCard'
import ExtraTableShell, { EXTRA_HEADER_CLASS } from '../../../extraprotocolares/ExtraTableShell'
import { emptyMotionProps } from '../../../extraprotocolares/rowMotion'
import useAuthStore from '../../../../../store/useAuthStore'
import postPdtCorrectErrors, { toPdtCorrectionItem } from '../../../../../services/api/pdtCorrectErrors'

interface Props {
    errors: PdtError[]
    onCorrected?: () => void
}

const rowKey = (error: PdtError, index: number) =>
    `${error.kardex}-${error.fileType}-${error.categoryCorrect}-${error.typeOfCorrection}-${error.idContractor}-${error.itemMp}-${index}`

const ArchivosPdtKardexBody = ({ errors, onCorrected }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ''
    const [selected, setSelected] = useState<Record<string, boolean>>({})
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [resultMsg, setResultMsg] = useState<string | null>(null)

    useEffect(() => {
        setSelected({})
    }, [errors])

    const correctableKeys = useMemo(
        () =>
            errors
                .map((e, i) => ({ e, i, key: rowKey(e, i) }))
                .filter(({ e }) => Number(e.isCorrectable) === 1),
        [errors]
    )

    const selectedItems = useMemo(
        () => correctableKeys.filter(({ key }) => selected[key]),
        [correctableKeys, selected]
    )

    const allCorrectableSelected =
        correctableKeys.length > 0 &&
        correctableKeys.every(({ key }) => selected[key])

    const toggleAll = (checked: boolean) => {
        if (!checked) {
            setSelected({})
            return
        }
        const next: Record<string, boolean> = {}
        correctableKeys.forEach(({ key }) => {
            next[key] = true
        })
        setSelected(next)
    }

    const handleSubsanar = async () => {
        if (!selectedItems.length || submitting) return
        setSubmitting(true)
        setResultMsg(null)
        try {
            const corrections = selectedItems.map(({ e, i }) => toPdtCorrectionItem(e, i + 1))
            const res = await postPdtCorrectErrors(access, corrections)
            setResultMsg(res.errorDescription || 'Se afectaron registros.')
            setSelected({})
            onCorrected?.()
        } catch (err: any) {
            setResultMsg(err?.message || 'No se pudieron autocorregir los errores.')
        } finally {
            setSubmitting(false)
        }
    }

  return (
    <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-emerald-600"
                    checked={allCorrectableSelected}
                    disabled={correctableKeys.length === 0}
                    onChange={(e) => toggleAll(e.target.checked)}
                />
                TODOS
                <span className="font-normal text-slate-400">
                    ({correctableKeys.length} autocorregibles)
                </span>
            </label>
            <button
                type="button"
                disabled={selectedItems.length === 0 || submitting}
                onClick={() => {
                    setResultMsg(null)
                    setConfirmOpen(true)
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <CheckCircle2 className="h-3.5 w-3.5" />
                ({selectedItems.length}) Subsanar
            </button>
        </div>

        {resultMsg && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                {resultMsg}
            </p>
        )}

    <ExtraTableShell
        count={errors.length}
        label={errors.length === 1 ? "error encontrado" : "errores encontrados"}
        hint="Marque errores autocorregibles y use Subsanar"
        minWidth="780px"
    >
        <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: PDT_KARDEX_GRID }}>
            <p></p>
            <p>Kardex</p>
            <p>Acto</p>
            <p>Descripción del error</p>
            <p>Archivo</p>
        </div>
        {errors.length === 0 ? (
            <motion.div
                {...emptyMotionProps}
                className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
            >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <FileSearch className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-medium text-slate-600">Sin errores PDT en este rango</p>
                <p className="text-xs text-slate-400">Puede descargar los archivos planos.</p>
            </motion.div>
        ) : (
            <div className="divide-y divide-slate-100">
                {errors.map((error, index) => {
                    const key = rowKey(error, index)
                    return (
                        <ArchivosPdtKardexCard
                            key={key}
                            error={error}
                            index={index}
                            selected={Boolean(selected[key])}
                            onToggle={(checked) =>
                                setSelected((prev) => {
                                    const next = { ...prev }
                                    if (checked) next[key] = true
                                    else delete next[key]
                                    return next
                                })
                            }
                        />
                    )
                })}
            </div>
        )}
    </ExtraTableShell>

        {confirmOpen && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4">
                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
                    <h3 className="text-sm font-semibold text-slate-800">MENSAJE AL USUARIO</h3>
                    {!submitting && !resultMsg && (
                        <>
                            <p className="mt-3 text-sm text-slate-600">
                                ¿Estas seguro que deseas autocorregir los{" "}
                                <span className="font-semibold">{selectedItems.length}</span> errores?
                            </p>
                            <div className="mt-5 flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    onClick={() => setConfirmOpen(false)}
                                >
                                    NO
                                </button>
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                    onClick={async () => {
                                        await handleSubsanar()
                                    }}
                                >
                                    SI
                                </button>
                            </div>
                        </>
                    )}
                    {submitting && (
                        <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Autocorrigiendo lista de errores ...
                        </p>
                    )}
                    {!submitting && resultMsg && (
                        <>
                            <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                                {resultMsg}
                            </p>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                                    onClick={() => setConfirmOpen(false)}
                                >
                                    OK
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}
    </div>
  )
}

export default ArchivosPdtKardexBody
