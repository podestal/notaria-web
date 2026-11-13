import { useState, useEffect, useMemo, useRef } from "react"
import { debounce, omit } from "lodash"
import { Building2, UserRound } from "lucide-react"
import { Contratante, type CreateUpdateContratante } from "../../../services/api/contratantesService"
import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"
import {
    digitsToDdMmYyyy,
    fechafirmaToDisplay,
    isValidCompleteDdMmYyyy,
} from "../../../utils/fechaFirmaDdMmYyyy"
import { isEmpresaContratante } from "../../../utils/sortContratantesDisplay"
import RemoveContratante from "./RemoveContratante"
import UpdateContratante from "./UpdateContratante"
import useUpdateContratante from "../../../hooks/api/contratantes/useUpdateContratante"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { CONTRATANTES_GRID } from "./contratantesGrid"

interface Props {
    contratante: Contratante
    kardex: Kardex
}

const FECHAFIRMA_SAVE_DEBOUNCE_MS = 700

function toUpdatePayload(c: Contratante, fechafirma: string): CreateUpdateContratante {
    return {
        ...omit(c, [
            "idcontratante",
            "cliente",
            "cliente_id",
            "condicion_str",
            "tipper",
            "partes",
            "uif_roles",
        ]),
        fechafirma,
    }
}

const ContratanteCard = ({ contratante, kardex }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [fechafirma, setFechafirma] = useState(() => fechafirmaToDisplay(contratante.fechafirma))
    const [isUpdating, setIsUpdating] = useState(false)
    const updateContratante = useUpdateContratante({
        kardex: contratante.kardex,
        contratanteId: contratante.idcontratante,
        idkardex: kardex.idkardex,
    })
    const { setMessage, setShow, setType } = useNotificationsStore()
    const isEmpresa = isEmpresaContratante(contratante)

    const accessRef = useRef(access)
    const contratanteRef = useRef(contratante)
    const updateRef = useRef(updateContratante)
    const notifyRef = useRef({ setMessage, setShow, setType })

    accessRef.current = access
    contratanteRef.current = contratante
    updateRef.current = updateContratante
    notifyRef.current = { setMessage, setShow, setType }

    useEffect(() => {
        setFechafirma(fechafirmaToDisplay(contratante.fechafirma))
    }, [contratante.fechafirma])

    const debouncedUpdateFechafirma = useMemo(() => {
        const run = (value: string) => {
            if (value !== "" && !isValidCompleteDdMmYyyy(value)) {
                return
            }
            const update = updateRef.current
            const { setMessage: sm, setShow: ss, setType: st } = notifyRef.current

            setIsUpdating(true)
            update.mutate(
                {
                    access: accessRef.current,
                    contratante: toUpdatePayload(contratanteRef.current, value),
                },
                {
                    onSuccess: (res) => {
                        setFechafirma(fechafirmaToDisplay(res.fechafirma))
                        sm("Fecha de firma actualizada correctamente")
                        ss(true)
                        st("success")
                    },
                    onError: () => {
                        sm("Error al actualizar la fecha de firma")
                        ss(true)
                        st("error")
                    },
                    onSettled: () => {
                        setIsUpdating(false)
                    },
                }
            )
        }
        return debounce(run, FECHAFIRMA_SAVE_DEBOUNCE_MS)
    }, [])

    useEffect(
        () => () => {
            debouncedUpdateFechafirma.cancel()
        },
        [debouncedUpdateFechafirma]
    )

    const showFechaFirma = contratante.firma === "1"
    useEffect(() => {
        if (!showFechaFirma) debouncedUpdateFechafirma.cancel()
    }, [showFechaFirma, debouncedUpdateFechafirma])

    const handleChangeFechafirma = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = digitsToDdMmYyyy(e.target.value)
        setFechafirma(formatted)
        debouncedUpdateFechafirma(formatted)
    }

    const handleBlurFechafirma = () => {
        debouncedUpdateFechafirma.flush()
    }

    return (
        <div
            className="group grid items-center gap-3 px-4 py-3 text-xs text-slate-700 transition-colors hover:bg-sky-50/60"
            style={{ gridTemplateColumns: CONTRATANTES_GRID }}
        >
            <div className="min-w-0">
                <div className="flex items-start gap-2">
                    <span
                        className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
                            isEmpresa
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-sky-200 bg-sky-50 text-sky-700"
                        }`}
                    >
                        {isEmpresa ? (
                            <Building2 className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                            <UserRound className="h-3.5 w-3.5" aria-hidden />
                        )}
                    </span>
                    <div className="min-w-0">
                        <p
                            className="truncate font-medium leading-snug text-slate-800"
                            title={getTitleCase(contratante.cliente)}
                        >
                            {getTitleCase(contratante.cliente) || "—"}
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                            {isEmpresa ? "Persona jurídica" : "Persona natural"}
                        </p>
                    </div>
                </div>
            </div>

            <p
                className="line-clamp-2 leading-snug text-slate-600"
                title={getTitleCase(contratante.condicion_str)}
            >
                {getTitleCase(contratante.condicion_str) || "—"}
            </p>

            <div className="flex justify-center">
                <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        showFechaFirma
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                    }`}
                >
                    {showFechaFirma ? "Sí" : "No"}
                </span>
            </div>

            {showFechaFirma ? (
                <input
                    className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-center text-xs tabular-nums text-slate-800 shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100 disabled:opacity-60"
                    value={fechafirma}
                    onChange={handleChangeFechafirma}
                    onBlur={handleBlurFechafirma}
                    disabled={isUpdating}
                    placeholder="DD/MM/AAAA"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    title={`Se guarda solo, ${FECHAFIRMA_SAVE_DEBOUNCE_MS} ms después de dejar de escribir (o al salir del campo)`}
                    aria-label="Fecha de firma"
                />
            ) : (
                <p className="text-center text-slate-300" aria-hidden>
                    —
                </p>
            )}

            <p className="truncate text-slate-600" title={kardex.usuario ? getTitleCase(kardex.usuario) : undefined}>
                {kardex.usuario ? getTitleCase(kardex.usuario) : "—"}
            </p>

            <div className="flex items-center justify-center gap-1.5">
                <UpdateContratante
                    idtipoacto={kardex.codactos}
                    idtipkar={kardex.idtipkar}
                    kardex={kardex.kardex}
                    idkardex={kardex.idkardex}
                    contratante={contratante}
                />
                <RemoveContratante
                    contratanteId={contratante.idcontratante}
                    kardex={contratante.kardex}
                />
            </div>
        </div>
    )
}

export default ContratanteCard
