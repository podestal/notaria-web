import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Kardex } from "../../../services/api/kardexService"
import DateInput from "../../ui/DateInput"
import SimpleInput from "../../ui/SimpleInput"
import { UseMutationResult } from "@tanstack/react-query"
import { UpdateKardexData } from "../../../hooks/api/kardex/useUpdateKardex"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import moment from "moment"
import { ChevronDown, ChevronUp, DownloadCloud, Layers, Loader2, Save, Trash2 } from "lucide-react"
import { useCreateNotarizationReservation } from "../../../hooks/signatum/useCreateNotarizationReservation"
import type { NotarizationReservation } from "../../../services/signatum/notarizationReservationService"
import useGetSeriesNotariales from "../../../hooks/signatum/useGetSeriesNotariales"
import useKardexTypesStore from "../../../hooks/store/useKardexTypesStore"
import getTitleCase from "../../../utils/getTitleCase"
import {
    compareSerieNotarial,
    isValidSerieNotarialFormat,
    parseSerieNotarialToken,
    sanitizeSerieNotarialInput,
    SERIE_NOTARIAL_VTA_SUFFIX,
} from "../../../utils/serieNotarialFormat"
import TopModal from "../../ui/TopModal"
import ExplanationMessage from "../../ui/ExplanationMessage"
import SerieNotarialMain from "./serieNotarial/SerieNotarialMani"
import FechaConclusionGate from "./FechaConclusionGate"
import ReservationCountdown from "./ReservationCountdown"

interface Props {
    kardex: Kardex
    updateKardex: UseMutationResult<Kardex, Error, UpdateKardexData>
}


const formatReservationDateForInput = (value: string | undefined): string => {
    if (!value) return ''
    const trimmed = value.trim()
    const parsed = moment(trimmed, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss.SSSZ'], true)
    if (parsed.isValid()) return parsed.format('DD/MM/YYYY')
    if (trimmed.includes('/')) return trimmed.slice(0, 10)
    return trimmed
}

const incrementFolioSerieValue = (value: string): string => {
    const p = parseSerieNotarialToken(value)
    if (!p || Number.isNaN(p.n)) return value
    const pad = (x: number) => String(x).padStart(p.width, "0")
    if (p.hasVta) return pad(p.n + 1)
    return `${pad(p.n)}${SERIE_NOTARIAL_VTA_SUFFIX}`
}

const decrementFolioSerieValue = (value: string): string => {
    const p = parseSerieNotarialToken(value)
    if (!p || Number.isNaN(p.n)) return value
    const pad = (x: number) => String(Math.max(0, x)).padStart(p.width, "0")
    if (p.hasVta) return pad(p.n)
    const prev = p.n - 1
    if (prev < 0) return value
    return `${pad(prev)}${SERIE_NOTARIAL_VTA_SUFFIX}`
}

const decrementFolioSerieValueWithMin = (value: string, minValue: string): string => {
    const next = decrementFolioSerieValue(value)
    const cmp = compareSerieNotarial(next, minValue)
    if (cmp == null) return next
    return cmp < 0 ? minValue : next
}

const getFolioSeriePageCount = (from: string, to: string): number => {
    const pf = parseSerieNotarialToken(from)
    const pt = parseSerieNotarialToken(to)
    if (!pf || !pt) return 0
    const startPos = pf.n * 2 + (pf.hasVta ? 1 : 0)
    const endPos = pt.n * 2 + (pt.hasVta ? 1 : 0)
    if (endPos < startPos) return 0
    return endPos - startPos + 1
}

/** Última página permitida del rango: `papel_fin` en cara VTA (ej. "10015 VTA"). */
const maxSerieTokenFromPapelFin = (papelFin: string): string | null => {
    const p = parseSerieNotarialToken(papelFin.trim())
    if (!p || Number.isNaN(p.n)) return null
    const pad = (n: number) => String(n).padStart(p.width, "0")
    return `${pad(p.n)}${SERIE_NOTARIAL_VTA_SUFFIX}`
}

const exceedsSerieNotarialCeiling = (value: string, ceiling: string | null): boolean => {
    if (!ceiling || !value.trim()) return false
    const cmp = compareSerieNotarial(value.trim(), ceiling)
    return cmp != null && cmp > 0
}

const clampSerieNotarialToCeiling = (value: string, ceiling: string | null): string => {
    if (!ceiling || !value.trim()) return value
    return exceedsSerieNotarialCeiling(value, ceiling) ? ceiling : value
}

const formatKardexFechaForDateInput = (value: string | undefined): string => {
    if (!value) return ''
    const m = moment(value.trim(), [moment.ISO_8601, 'YYYY-MM-DD', 'DD/MM/YYYY'], true)
    if (m.isValid()) return m.format('DD/MM/YYYY')
    if (value.includes('/')) return value.trim().slice(0, 10)
    return value.trim()
}

const dateInputToApiYmd = (ddmmyyyy: string): string => {
    const m = moment(ddmmyyyy.trim(), 'DD/MM/YYYY', true)
    return m.isValid() ? m.format('YYYY-MM-DD') : ''
}

interface SectionProps {
    title: string
    description?: string
    actions?: ReactNode
    children: ReactNode
}

const EscrituracionSection = ({ title, description, actions, children }: SectionProps) => (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
            <div className="min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</h3>
                {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
        <div className="grid gap-x-6 gap-y-4 p-5 sm:grid-cols-2">{children}</div>
    </section>
)

const PageCountBadge = ({ label, count }: { label: string; count: number }) =>
    count > 0 ? (
        <span
            className={`rounded-md px-2 py-1 text-[11px] font-semibold ring-1 ${
                count > 10 ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-sky-50 text-sky-700 ring-sky-100"
            }`}
        >
            {label}: {count} {count === 1 ? "página" : "páginas"}
        </span>
    ) : null

const FolioSerieIncDec = ({ onInc, onDec }: { onInc: () => void; onDec: () => void }) => (
    <div className="flex shrink-0 flex-col rounded border border-slate-200 bg-slate-50/90 p-px shadow-sm">
        <button
            type="button"
            aria-label="Incrementar"
            onClick={onInc}
            className="rounded-sm px-0.5 py-0 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
        >
            <ChevronUp className="h-3 w-3" strokeWidth={2.25} />
        </button>
        <button
            type="button"
            aria-label="Decrementar"
            onClick={onDec}
            className="rounded-sm px-0.5 py-0 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
        >
            <ChevronDown className="h-3 w-3" strokeWidth={2.25} />
        </button>
    </div>
)

const applyReservationToForm = (
    data: NotarizationReservation,
    idtipkar: number,
    setters: {
        setNumMinuta: (v: string) => void
        setNumEscritura: (v: string) => void
        setNumActa: (v: string) => void
        setFolioIni: (v: string) => void
        setFolioFin: (v: string) => void
        setSerieNotarialIni: (v: string) => void
        setSerieNotarialFin: (v: string) => void
        setFechaActa: (v: string) => void
        setFechaEscritura?: (v: string) => void
        setFechaMinuta: (v: string) => void
    }
) => {
    const { setNumEscritura, setNumActa, setFolioIni, setFolioFin, setSerieNotarialIni, setSerieNotarialFin, setFechaActa, setFechaEscritura, setFechaMinuta } =
        setters
    if (data.num_escritura != null && data.num_escritura !== '') {
        setNumEscritura(String(data.num_escritura))
        if (idtipkar === 3) setNumActa(String(data.num_escritura))
    }
    if (data.folio_ini != null && data.folio_ini !== '') setFolioIni(String(data.folio_ini))
    if (data.folio_fin != null && data.folio_fin !== '') setFolioFin(String(data.folio_fin))
    if (data.papel_ini != null && data.papel_ini !== '') setSerieNotarialIni(String(data.papel_ini))
    if (data.papel_fin != null && data.papel_fin !== '') setSerieNotarialFin(String(data.papel_fin))
    if (data.fecha_escritura) {
        const fe = formatReservationDateForInput(data.fecha_escritura)
        setFechaActa(fe)
        setFechaEscritura?.(fe)
    }
    const minutaSource = data.fecha_conclusion || data.fecha_escritura
    if (minutaSource) setFechaMinuta(formatReservationDateForInput(minutaSource))
}

const EscrituracionForm = ({ kardex, updateKardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const kardexTypes = useKardexTypesStore(s => s.kardexTypes)
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createNotarizationReservation = useCreateNotarizationReservation()
    const { data: seriesNotariales } = useGetSeriesNotariales({
        access,
        idtipkar: kardex.idtipkar,
    })

    const [numMinuta, setNumMinuta] = useState(kardex.numminuta || '')
    const [numEscritura, setNumEscritura] = useState(kardex.numescritura || '')
    const [fechaMinuta, setFechaMinuta] = useState(() => formatKardexFechaForDateInput(kardex.fechaminuta))
    const [numActa, setNumActa] = useState(kardex.numescritura || '')
    const [follioIni, setFolioIni] = useState(kardex.folioini || '')
    const [folioFin, setFolioFin] = useState(kardex.foliofin || '')
    const [serieNotarialIni, setSerieNotarialIni] = useState(kardex.papelini || '')
    const [serieNotarialFin, setSerieNotarialFin] = useState(kardex.papelfin || '')
    const fmtEsc = formatKardexFechaForDateInput(kardex.fechaescritura)
    const [fechaEscritura, setFechaEscritura] = useState(() =>
        kardex.idtipkar === 1 || kardex.idtipkar === 5 ? fmtEsc : ''
    )
    const [fechaActa, setFechaActa] = useState(() => fmtEsc)

    const [tomo, setTomo] = useState(kardex.txa_minuta || '')
    const [registro, setRegistro] = useState(kardex.numinstrmento || '')

    const [papelTraslNotarialIni, setPapelTraslNotarialIni] = useState(kardex.papeltrasladoini || '')
    const [papelTraslNotarialFin, setPapelTraslNotarialFin] = useState(kardex.papeltrasladofin || '')

    const [loading, setLoading] = useState(false)
    const [signatumReservationId, setSignatumReservationId] = useState<number | undefined>(undefined)
    const [reservationExpiresAt, setReservationExpiresAt] = useState<number | null>(null)
    const [reservationExpired, setReservationExpired] = useState(false)
    const [openSerieNotarial, setOpenSerieNotarial] = useState(false)

    useEffect(() => {
        if (reservationExpiresAt === null) {
            setReservationExpired(false)
            return
        }
        const remaining = reservationExpiresAt - Date.now()
        if (remaining <= 0) {
            setReservationExpired(true)
            return
        }
        setReservationExpired(false)
        const timeout = setTimeout(() => setReservationExpired(true), remaining)
        return () => clearTimeout(timeout)
    }, [reservationExpiresAt])
    const [openClearConfirm, setOpenClearConfirm] = useState(false)


    // ERRORS
    const [errorNumActa, setErrorNumActa] = useState('')
    const [errorFechaActa, setErrorFechaActa] = useState('')
    const [errorFechaEscritura, setErrorFechaEscritura] = useState('')
    const [errorFechaMinuta, setErrorFechaMinuta] = useState('')
    const folioPageCount = useMemo(() => getFolioSeriePageCount(follioIni, folioFin), [follioIni, folioFin])
    const seriePageCount = useMemo(() => getFolioSeriePageCount(serieNotarialIni, serieNotarialFin), [serieNotarialIni, serieNotarialFin])
    const exceedsPageLimit = folioPageCount > 10 || seriePageCount > 10
    const kardexTypeLabel = useMemo(() => {
        const match = kardexTypes.find(type => type.idtipkar === kardex.idtipkar)
        return match ? getTitleCase(match.nomtipkar) : `tipo ${kardex.idtipkar}`
    }, [kardex.idtipkar, kardexTypes])
    const activeSeriesForCurrentType = useMemo(
        () => (seriesNotariales || []).filter(serie => serie.activo && serie.idtipkar === kardex.idtipkar),
        [kardex.idtipkar, seriesNotariales]
    )
    const noActiveSeriesForCurrentType = activeSeriesForCurrentType.length === 0
    const lowActiveSeriesForCurrentType = useMemo(
        () =>
            !noActiveSeriesForCurrentType &&
            activeSeriesForCurrentType.some(serie => getFolioSeriePageCount(serie.papel_ini, serie.papel_fin) > 0 && getFolioSeriePageCount(serie.papel_ini, serie.papel_fin) <= 20),
        [activeSeriesForCurrentType, noActiveSeriesForCurrentType]
    )

    /** Última serie activa (más reciente por `created_at` o `id`) — su `papel_fin` define el tope en VTA. */
    const lastActiveSerieNotarial = useMemo(() => {
        const list = activeSeriesForCurrentType
        if (!list.length) return null
        return [...list].sort((a, b) => {
            const tb = b.created_at ? new Date(b.created_at).getTime() : 0
            const ta = a.created_at ? new Date(a.created_at).getTime() : 0
            if (tb !== ta) return tb - ta
            return (b.id ?? 0) - (a.id ?? 0)
        })[0]
    }, [activeSeriesForCurrentType])

    const serieNotarialCeiling = useMemo(
        () =>
            lastActiveSerieNotarial?.papel_fin
                ? maxSerieTokenFromPapelFin(lastActiveSerieNotarial.papel_fin)
                : null,
        [lastActiveSerieNotarial]
    )

    const notifySerieNotarialLimit = () => {
        if (!serieNotarialCeiling) return
        setMessage(`En serie notarial no puede ir más allá de ${serieNotarialCeiling.trim()}.`)
        setType("error")
        setShow(true)
    }

    const setSerieNotarialIniGuarded = (v: string) => {
        const cleaned = sanitizeSerieNotarialInput(v)
        if (serieNotarialCeiling && exceedsSerieNotarialCeiling(cleaned, serieNotarialCeiling)) {
            setSerieNotarialIni(serieNotarialCeiling)
            notifySerieNotarialLimit()
            return
        }
        setSerieNotarialIni(cleaned)
    }

    const setSerieNotarialFinGuarded = (v: string) => {
        const cleaned = sanitizeSerieNotarialInput(v)
        if (serieNotarialCeiling && exceedsSerieNotarialCeiling(cleaned, serieNotarialCeiling)) {
            setSerieNotarialFin(serieNotarialCeiling)
            notifySerieNotarialLimit()
            return
        }
        setSerieNotarialFin(cleaned)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (reservationExpiresAt !== null && Date.now() >= reservationExpiresAt) {
            setReservationExpired(true)
            setMessage('La reserva expiró. Vuelva a obtener datos antes de guardar.')
            setType('error')
            setShow(true)
            return
        }

        const isTip15 = kardex.idtipkar === 1 || kardex.idtipkar === 5
        if (isTip15) {
            if (!fechaEscritura.trim()) {
                setErrorFechaEscritura('La fecha de escritura es requerida')
                setErrorFechaActa('')
                return
            }
        } else if (!fechaActa.trim()) {
            setErrorFechaActa('La fecha es requerida')
            return
        }

        if (
            serieNotarialCeiling &&
            (exceedsSerieNotarialCeiling(serieNotarialIni, serieNotarialCeiling) ||
                exceedsSerieNotarialCeiling(serieNotarialFin, serieNotarialCeiling))
        ) {
            notifySerieNotarialLimit()
            return
        }

        const snIni = serieNotarialIni.trim()
        const snFin = serieNotarialFin.trim()
        if ((snIni && !isValidSerieNotarialFormat(snIni)) || (snFin && !isValidSerieNotarialFormat(snFin))) {
            setMessage(
                'Serie notarial: solo números o números seguidos de " VTA" (ej.: 10100 o 10100 VTA). No use otros caracteres.'
            )
            setType("error")
            setShow(true)
            return
        }

        setLoading(true)

        const fechaMinutaStr = dateInputToApiYmd(fechaMinuta)
        const fechaEscrituraStr = isTip15 ? fechaEscritura.trim() : fechaActa.trim()

        updateKardex.mutate({
            kardex: {
                idtipkar: kardex.idtipkar,
                fechaingreso:kardex.fechaingreso,
                referencia: kardex.referencia || '',
                codactos: kardex.codactos,
                idusuario: kardex.idusuario,
                responsable: kardex.responsable,
                retenido: 0,
                desistido: 0,
                autorizado: 0,
                idrecogio: 0,
                pagado: 0,
                visita: 0,
                idnotario: 1,
                contrato: kardex.contrato, 
                numescritura: kardex.idtipkar === 3 ? numActa : numEscritura,
                numminuta: numMinuta,
                fktemplate: kardex.fktemplate,
                papelini: serieNotarialIni,
                papelfin: serieNotarialFin,
                folioini: follioIni,
                foliofin: folioFin,
                fechaescritura: fechaEscrituraStr,
                txa_minuta: tomo,
                numinstrmento: registro,
                papeltrasladoini: papelTraslNotarialIni,
                papeltrasladofin: papelTraslNotarialFin,
                estado_sisgen: 0,
                fechaminuta: fechaMinutaStr,
                nc: '',
            },
            access,
            signatumReservationId
        }, {
            onSuccess: () => {
                if (signatumReservationId !== undefined) setReservationExpiresAt(null)
                setMessage('Escrituración actualizada correctamente')
                setShow(true)
                setType('success')
            },
            onError: (err) => {
                setMessage(err.message)
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })
    }

    const handleClearEscrituracion = () => {
        if (loading) return

        setOpenClearConfirm(false)
        setLoading(true)

        updateKardex.mutate({
            kardex: {
                idtipkar: kardex.idtipkar,
                fechaingreso:kardex.fechaingreso,
                referencia: kardex.referencia || '',
                codactos: kardex.codactos,
                idusuario: kardex.idusuario,
                responsable: kardex.responsable,
                retenido: 0,
                desistido: 0,
                autorizado: 0,
                idrecogio: 0,
                pagado: 0,
                visita: 0,
                idnotario: 1,
                contrato: kardex.contrato,
                numescritura: '',
                numminuta: '',
                fktemplate: kardex.fktemplate,
                papelini: '',
                papelfin: '',
                folioini: '',
                foliofin: '',
                fechaescritura: '',
                txa_minuta: '',
                numinstrmento: '',
                papeltrasladoini: '',
                papeltrasladofin: '',
                estado_sisgen: 0,
                fechaminuta: '',
                nc: '',
            },
            access
        }, {
            onSuccess: () => {
                setNumMinuta('')
                setNumEscritura('')
                setFechaMinuta('')
                setNumActa('')
                setFolioIni('')
                setFolioFin('')
                setSerieNotarialIni('')
                setSerieNotarialFin('')
                setFechaEscritura('')
                setFechaActa('')
                setTomo('')
                setRegistro('')
                setPapelTraslNotarialIni('')
                setPapelTraslNotarialFin('')
                setErrorNumActa('')
                setErrorFechaActa('')
                setErrorFechaEscritura('')
                setErrorFechaMinuta('')
                setReservationExpiresAt(null)

                setMessage('Datos de escrituracion borrados correctamente')
                setShow(true)
                setType('success')
            },
            onError: (err) => {
                setMessage(err.message)
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })
    }

    const handleFetchNotarizationReservation = () => {
        if (!access) {
            setMessage('No hay sesión activa')
            setShow(true)
            setType('error')
            return
        }
        createNotarizationReservation.mutate(
            {
                access,
                notarizationReservation: {
                    kardex: kardex.kardex,
                    idtipkar: kardex.idtipkar,
                },
            },
            {
                onSuccess: (data) => {
                    setSignatumReservationId(data.id)
                    const expiresAt = data.expires_at ? Date.parse(data.expires_at) : NaN
                    setReservationExpiresAt(Number.isNaN(expiresAt) ? null : expiresAt)
                    applyReservationToForm(data, kardex.idtipkar, {
                        setNumMinuta,
                        setNumEscritura,
                        setNumActa,
                        setFolioIni,
                        setFolioFin,
                        setSerieNotarialIni,
                        setSerieNotarialFin,
                        setFechaActa,
                        setFechaEscritura,
                        setFechaMinuta,
                    })
                    if (serieNotarialCeiling) {
                        setSerieNotarialIni((prev) => clampSerieNotarialToCeiling(prev, serieNotarialCeiling))
                        setSerieNotarialFin((prev) => clampSerieNotarialToCeiling(prev, serieNotarialCeiling))
                    }
                    setErrorFechaActa('')
                    setErrorFechaEscritura('')
                    setErrorFechaMinuta('')
                    setErrorNumActa('')
                    setMessage('Datos de reserva cargados correctamente')
                    setShow(true)
                    setType('success')
                },
                onError: (err) => {
                    setMessage(err.message || 'No se pudo obtener la reserva de notarización')
                    setShow(true)
                    setType('error')
                },
            }
        )
    }

    const isEscrituraType = kardex.idtipkar === 1 || kardex.idtipkar === 5

    const fechaField = isEscrituraType ? (
        <DateInput
            label="Fecha de escritura"
            value={fechaEscritura}
            setValue={(v) => {
                setFechaEscritura(v)
                setFechaActa(v)
                setErrorFechaEscritura('')
                setErrorFechaActa('')
            }}
            required
            fullWidth
            error={errorFechaEscritura}
            setError={setErrorFechaEscritura}
        />
    ) : (
        <DateInput
            label="Fecha"
            value={fechaActa}
            setValue={(v) => {
                setFechaActa(v)
                setErrorFechaActa('')
            }}
            required
            fullWidth
            error={errorFechaActa}
            setError={setErrorFechaActa}
        />
    )

    const fechaMinutaField = (
        <DateInput
            label="Fecha minuta"
            value={fechaMinuta}
            setValue={(v) => {
                setFechaMinuta(v)
                setErrorFechaMinuta('')
            }}
            fullWidth
            error={errorFechaMinuta}
            setError={setErrorFechaMinuta}
        />
    )

  return (
    <form onSubmit={handleSubmit} className="mx-auto my-6 w-full max-w-5xl space-y-5 text-black">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {kardexTypeLabel}
                </p>
                <h2 className="mt-0.5 text-lg font-semibold text-slate-900">Escrituración</h2>
                <p className="text-xs text-slate-500">Kardex {kardex.kardex}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
            {reservationExpiresAt !== null && <ReservationCountdown expiresAt={reservationExpiresAt} />}
            <button
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
                type="button"
                onClick={handleFetchNotarizationReservation}
                disabled={createNotarizationReservation.isPending}
            >
                {createNotarizationReservation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                    <DownloadCloud className="h-4 w-4" aria-hidden />
                )}
                Obtener datos
            </button>
            </div>
        </header>

        {noActiveSeriesForCurrentType && (
            <div className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-xs text-slate-700">
                No hay series notariales activas para {kardexTypeLabel}.
            </div>
        )}
        {reservationExpired && (
            <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-xs text-rose-800">
                La reserva expiró y estos datos pueden haber sido asignados a otro usuario. Haga clic en
                <span className="font-semibold"> Obtener datos</span> para obtener una nueva reserva antes de guardar.
            </div>
        )}
        <FechaConclusionGate kardex={kardex} />
        {exceedsPageLimit && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                Recuerde: más de 10 páginas es una cantidad alta. Verifique cuidadosamente el rango antes de guardar.
            </div>
        )}

        <EscrituracionSection title="Instrumento" description="Numeración y fechas del documento">
            {isEscrituraType && (
                <>
                    <SimpleInput setValue={setNumMinuta} value={numMinuta} label="N° de Minuta" fullWidth />
                    <SimpleInput setValue={setNumEscritura} value={numEscritura} label="N° de Escritura" required fullWidth />
                    {fechaField}
                </>
            )}
            {kardex.idtipkar === 2 && (
                <>
                    <SimpleInput setValue={setNumMinuta} value={numMinuta} label="N° de minuta/sol" fullWidth />
                    <SimpleInput setValue={setNumEscritura} value={numEscritura} label="N° instrumento" required fullWidth />
                    {fechaMinutaField}
                    {fechaField}
                </>
            )}
            {kardex.idtipkar === 3 && (
                <>
                    <SimpleInput
                        setValue={setNumActa}
                        value={numActa}
                        label="N° de Acta"
                        required
                        fullWidth
                        error={errorNumActa}
                        setError={setErrorNumActa}
                    />
                    {fechaField}
                </>
            )}
            {kardex.idtipkar === 4 && (
                <>
                    <SimpleInput setValue={setNumEscritura} value={numEscritura} label="N° Acta" required fullWidth />
                    {fechaMinutaField}
                    {fechaField}
                </>
            )}
        </EscrituracionSection>

        <EscrituracionSection
            title="Folios y serie notarial"
            actions={
                <>
                    <PageCountBadge label="Folios" count={folioPageCount} />
                    <PageCountBadge label="Serie" count={seriePageCount} />
                    <button
                        type="button"
                        onClick={() => setOpenSerieNotarial(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                    >
                        <Layers className="h-3.5 w-3.5" aria-hidden />
                        Gestionar serie notarial
                    </button>
                </>
            }
        >
            <SimpleInput setValue={setFolioIni} value={follioIni} label="N° de Folio del" fullWidth />
            <SimpleInput
                setValue={setFolioFin}
                value={folioFin}
                label="Al"
                fullWidth
                suffix={
                    <FolioSerieIncDec
                        onInc={() => setFolioFin(incrementFolioSerieValue(folioFin))}
                        onDec={() => setFolioFin(decrementFolioSerieValueWithMin(folioFin, follioIni))}
                    />
                }
            />
            <SimpleInput setValue={setSerieNotarialIniGuarded} value={serieNotarialIni} label="Serie Notarial del" fullWidth />
            <SimpleInput
                setValue={setSerieNotarialFinGuarded}
                value={serieNotarialFin}
                label="Al"
                fullWidth
                suffix={
                    <FolioSerieIncDec
                        onInc={() => {
                            const next = incrementFolioSerieValue(serieNotarialFin)
                            if (serieNotarialCeiling && exceedsSerieNotarialCeiling(next, serieNotarialCeiling)) {
                                notifySerieNotarialLimit()
                                return
                            }
                            setSerieNotarialFin(next)
                        }}
                        onDec={() => setSerieNotarialFin(decrementFolioSerieValueWithMin(serieNotarialFin, serieNotarialIni))}
                    />
                }
            />
        </EscrituracionSection>

        <EscrituracionSection title="Registro y traslado">
            <SimpleInput setValue={setTomo} value={tomo} label="Tomo" fullWidth />
            <SimpleInput setValue={setRegistro} value={registro} label="Registro" fullWidth />
            <SimpleInput setValue={setPapelTraslNotarialIni} value={papelTraslNotarialIni} label="Papel de traslado notarial del" fullWidth />
            <SimpleInput setValue={setPapelTraslNotarialFin} value={papelTraslNotarialFin} label="Al" fullWidth />
        </EscrituracionSection>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
                type="button"
                onClick={() => {
                    if (!loading) setOpenClearConfirm(true)
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
            >
                <Trash2 className="h-4 w-4" aria-hidden />
                Borrar
            </button>
            <button
                type="submit"
                className="inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || reservationExpired}
                title={reservationExpired ? 'La reserva expiró. Vuelva a obtener datos.' : undefined}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
                {loading ? 'Guardando…' : 'Guardar'}
            </button>
        </footer>

        <TopModal isOpen={openSerieNotarial} onClose={() => setOpenSerieNotarial(false)}>
            <SerieNotarialMain />
        </TopModal>

        <TopModal isOpen={openClearConfirm} onClose={() => setOpenClearConfirm(false)} portal>
            <ExplanationMessage
                message="¿Está seguro de que desea borrar los datos de escrituración? Esta acción limpiará escritura, minuta, folios y series notariales."
                onClick={() => setOpenClearConfirm(false)}
                onClickMessage="Cancelar"
                onClickSecondary={handleClearEscrituracion}
                onClickSecondaryMessage="Borrar"
            />
        </TopModal>
    </form>
  )
}

export default EscrituracionForm