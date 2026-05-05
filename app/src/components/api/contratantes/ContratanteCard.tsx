import { useState, useEffect, useMemo, useRef } from "react"
import { debounce, omit } from "lodash"
import { Contratante, type CreateUpdateContratante } from "../../../services/api/contratantesService"
import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"
import {
    digitsToDdMmYyyy,
    fechafirmaToDisplay,
    isValidCompleteDdMmYyyy,
} from "../../../utils/fechaFirmaDdMmYyyy"
import RemoveContratante from "./RemoveContratante"
import UpdateContratante from "./UpdateContratante"
import useUpdateContratante from "../../../hooks/api/contratantes/useUpdateContratante"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

interface Props {
    contratante: Contratante
    kardex: Kardex
}

const FECHAFIRMA_SAVE_DEBOUNCE_MS = 700

function toUpdatePayload(c: Contratante, fechafirma: string): CreateUpdateContratante {
    return {
        ...omit(c, ["idcontratante", "cliente", "cliente_id", "condicion_str"]),
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
    })
    const { setMessage, setShow, setType } = useNotificationsStore()

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
            key={contratante.idcontratante}
            className="grid grid-cols-9 text-xs text-black px-2 my-2 place-content-center border-b-2 border-gray-200"
        >
            <p className="col-span-2">{getTitleCase(contratante.cliente)}</p>
            <p className="col-span-2">{getTitleCase(contratante.condicion_str)}</p>
            <p className="pl-2">{contratante.firma === "1" ? "Si" : "No"}</p>
            {showFechaFirma ? (
                <input
                    className="rounded-xl py-1 px-2 bg-slate-100 mx-1 h-6 text-center"
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
                <p className="pl-2 text-slate-400" aria-hidden>
                    —
                </p>
            )}
            <p className="pl-2">{kardex.usuario ? getTitleCase(kardex.usuario) : ""}</p>
            <p></p>
            <div className="flex items-start justify-start gap-2 pl-4">
                <RemoveContratante contratanteId={contratante.idcontratante} kardex={contratante.kardex} />
                <p>|</p>
                <UpdateContratante
                    idtipoacto={kardex.codactos}
                    idtipkar={kardex.idtipkar}
                    kardex={kardex.kardex}
                    contratante={contratante}
                />
            </div>
        </div>
    )
}

export default ContratanteCard
