import { useEffect, useState } from "react"
import SimpleSelector from "../../ui/SimpleSelector"
import { TIPOS_BIENES, BIEN_ACTO_JURIDICO, SEDES_REGISTRALES } from "../../../data/patrimonialData"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import { DetalleBien } from "../../../services/api/detalleBienService"
import { Ubigeo } from "../../../services/api/ubigeoService"
import { UseMutationResult } from "@tanstack/react-query"
import { DetalleBienCreateData } from "../../../hooks/api/detalleBien/useCreateDetalleBienes"
import useAuthStore from "../../../store/useAuthStore"
import SingleSelect from "../../ui/SingleSelect"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import TopModal from "../../ui/TopModal"
import { DetalleBienUpdateData } from "../../../hooks/api/detalleBien/useUpdateDetalleBien"
import PrediosMain from "../predios/PrediosMain"
import {
    FOUR_DIGIT_YEAR_ERROR,
    isValidFourDigitYearOrEmpty,
    sanitizeFourDigitYearInput,
} from "../../../utils/fourDigitYear"

interface Props {
    kardex: string
    idtipoacto: string
    detalleBien?: DetalleBien
    ubigeos: Ubigeo[]
    itemmp: string
    createDetalleBien?: UseMutationResult<DetalleBien, Error, DetalleBienCreateData>
    updateDetalleBien?: UseMutationResult<DetalleBien, Error, DetalleBienUpdateData>
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DetalleBienForm = ({ 
    kardex, 
    idtipoacto, 
    detalleBien, 
    ubigeos, 
    itemmp, 
    createDetalleBien, 
    updateDetalleBien, 
    setOpen }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [openPredioForm, setOpenPredioForm] = useState(false)

    const [tipoBien, setTipoBien] = useState(detalleBien ? (detalleBien.tipob === 'BIENES' ? 1 : 2) : 0)
    const [partida, setPartida] = useState(detalleBien ? detalleBien.pregistral : '')
    const [tipoBienJuridico, setTipoBienJuridico] = useState(detalleBien ? detalleBien.idtipbien : 0)
    const [sedeRegistral, setSedeRegistral] = useState(detalleBien ? detalleBien.idsedereg : '')
    const [ubigeo, setUbigeo] = useState<{ id: string; label: string } | null>(() => {
        if (detalleBien && detalleBien.coddis) {
          const match = ubigeos.find(ubi => ubi.coddis === detalleBien.coddis);
          if (match) {
            return {
              id: match.coddis,
              label: `${match.nomdpto} - ${match.nomprov} - ${match.nomdis}`,
            };
          }
        }
        return null;
      });
    const [fecha, setFecha] = useState(detalleBien ? detalleBien.fechaconst : '')
    
    // CONDITIONAL FIELDS
    const [serieMaqEq, setSerieMaqEq] = useState(detalleBien ? detalleBien.smaquiequipo : '')
    const [tpsm, setTpsm] = useState(detalleBien ? detalleBien.tpsm : '')
    const [npsm, setNpsm] = useState(detalleBien ? detalleBien.npsm : '')
    const [otherSpecific, setOtherSpecific] = useState(detalleBien ? detalleBien.oespecific : '')

    const [loading, setLoading] = useState(false)
    const [tipoBienError, setTipoBienError] = useState('')
    const [tipoBienJuridicoError, setTipoBienJuridicoError] = useState('')
    const [ubigeoError, setUbigeoError] = useState('')
    const [serieMaqEqError, setSerieMaqEqError] = useState('')
    const [tpsmError, setTpsmError] = useState('')
    const [npsmError, setNpsmError] = useState('')
    const [otherSpecificError, setOtherSpecificError] = useState('')
    const [fechaError, setFechaError] = useState('')

    useEffect(() => {
        if (tipoBienJuridico === 4 && !detalleBien) {
            setOpenPredioForm(true)
        } else {
            setOpenPredioForm(false)
        }
    }, [tipoBienJuridico])

    const validateForm = () => {
        let hasError = false
        let firstMessage = ''

        const setFirst = (msg: string) => {
            if (!firstMessage) firstMessage = msg
        }

        if (!tipoBien || (tipoBien !== 1 && tipoBien !== 2)) {
            setTipoBienError('Debe seleccionar un tipo de bien')
            setFirst('Debe seleccionar un tipo de bien')
            hasError = true
        } else {
            setTipoBienError('')
        }

        if (!tipoBienJuridico) {
            setTipoBienJuridicoError('Debe seleccionar un bien acto jurídico')
            setFirst('Debe seleccionar un bien acto jurídico')
            hasError = true
        } else {
            setTipoBienJuridicoError('')
        }

        if (!ubigeo?.id) {
            setUbigeoError('Debe seleccionar un ubigeo')
            setFirst('Debe seleccionar un ubigeo')
            hasError = true
        } else {
            setUbigeoError('')
        }

        if (tipoBienJuridico === 5 && !serieMaqEq.trim()) {
            setSerieMaqEqError('Debe ingresar el N° de serie para maquinaria y equipos')
            setFirst('Debe ingresar el N° de serie para maquinaria y equipos')
            hasError = true
        } else {
            setSerieMaqEqError('')
        }

        if (tipoBienJuridico === 8) {
            if (!tpsm || !['P', 'S', 'M'].includes(tpsm)) {
                setTpsmError('Debe seleccionar placa, serie o motor')
                setFirst('Debe seleccionar placa, serie o motor')
                hasError = true
            } else {
                setTpsmError('')
            }
            if (!npsm.trim()) {
                setNpsmError(
                    tpsm === 'P'
                        ? 'Debe ingresar el N° de placa'
                        : tpsm === 'S'
                          ? 'Debe ingresar el N° de serie'
                          : 'Debe ingresar el N° de motor',
                )
                setFirst('Debe completar el identificador del vehículo')
                hasError = true
            } else {
                setNpsmError('')
            }
        } else {
            setTpsmError('')
            setNpsmError('')
        }

        if (tipoBienJuridico === 10 && !otherSpecific.trim()) {
            setOtherSpecificError('Debe detallar el bien materia del acto jurídico')
            setFirst('Debe detallar el bien materia del acto jurídico')
            hasError = true
        } else {
            setOtherSpecificError('')
        }

        if (!isValidFourDigitYearOrEmpty(fecha)) {
            setFechaError(FOUR_DIGIT_YEAR_ERROR)
            setFirst(FOUR_DIGIT_YEAR_ERROR)
            hasError = true
        } else {
            setFechaError('')
        }

        if (hasError) {
            setMessage(firstMessage)
            setShow(true)
            setType('error')
        }

        return !hasError
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return

        setLoading(true)

        const payload = {
            kardex,
            idtipacto: idtipoacto,
            tipob: tipoBien === 1 ? 'BIENES' : 'SERVICIOS',
            pregistral: partida,
            idtipbien: tipoBienJuridico,
            idsedereg: sedeRegistral,
            coddis: ubigeo ? ubigeo.id : '',
            fechaconst: fecha,
            itemmp,
            oespecific: tipoBienJuridico === 10 ? otherSpecific : '',
            smaquiequipo: tipoBienJuridico === 5 ? serieMaqEq : '',
            tpsm: tipoBienJuridico === 8 ? tpsm : '',
            npsm: tipoBienJuridico === 8 ? npsm : '',
        }

        createDetalleBien && createDetalleBien.mutate({
            access,
            detalleBien: payload,
        }, {
            onSuccess: () => {
                setMessage('Detalle de Bien creado correctamente')
                setShow(true)
                setType('success')
                setOpen(false)
            },
            onError: (error) => {
                setMessage(error.message)
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })

        updateDetalleBien && updateDetalleBien.mutate({
            access,
            detalleBien: payload,
        }, {
            onSuccess: () => {
                setMessage('Detalle de Bien actualizado correctamente')
                setShow(true)
                setType('success')
                setOpen(false)
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

  return (
    <>
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center mt-2 mb-6">{detalleBien ? 'Editar Detalle de Bien' : 'Agregar Detalle de Bien'}</h2>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelector 
                label="Tipo de Bien"
                options={[{ value: 0, label: 'Seleccione un tipo de bien' }, ...TIPOS_BIENES.map((item) => ({
                    value: item.id_tipbien,
                    label: item.des_tipbien
                }))]}
                defaultValue={tipoBien}
                setter={setTipoBien}
                required
                error={tipoBienError}
                setError={setTipoBienError}
            />
            <SimpleInput 
                label="Partida Registral"
                value={partida}
                setValue={setPartida}
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelector
                label="Bien Acto Jurídico"
                options={[{ value: 0, label: 'Seleccione un tipo de bien jurídico' }, ...BIEN_ACTO_JURIDICO.map((item) => ({
                    value: item.idtipbien,
                    label: item.desestcivil
                }))]}
                defaultValue={tipoBienJuridico}
                setter={(value) => {
                    setTipoBienJuridico(value)
                    setSerieMaqEqError('')
                    setTpsmError('')
                    setNpsmError('')
                    setOtherSpecificError('')
                }}
                required
                error={tipoBienJuridicoError}
                setError={setTipoBienJuridicoError}
            />
            <SimpleSelectorStr
                label="Sede Registral"
                options={[{ value: '', label: 'Seleccione una sede' }, ...SEDES_REGISTRALES.map((item) => ({
                    value: item.idsedereg,
                    label: item.dessede
                }))]}
                defaultValue={sedeRegistral}
                setter={setSedeRegistral}
            />
        </div>
        {tipoBienJuridico === 4 && 
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => setOpenPredioForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-100 cursor-pointer"
                >
                    {detalleBien ? 'Mostrar Detalle del Predio' : 'Agregar Detalle del Predio'}
                </button>
            </div>
        </div>}
        {tipoBienJuridico === 5 && 
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput
                label="N° de Serie para Maquinaria y Equipos"
                value={serieMaqEq}
                setValue={(value) => {
                    setSerieMaqEqError('')
                    setSerieMaqEq(value)
                }}
                horizontal
                required
                error={serieMaqEqError}
                setError={setSerieMaqEqError}
            />
        </div>}
        {tipoBienJuridico === 8 && 
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
                <SingleSelect 
                    options={[
                        { value: 'P', label: 'N° de Placa' },
                        { value: 'S', label: 'N° de Serie' },
                        { value: 'M', label: 'N° de Motor' }
                    ]}
                    selected={tpsm}
                    onChange={(value) => {
                        setTpsmError('')
                        setTpsm(value)
                    }}
                />
                {tpsmError && (
                    <p className="text-xs text-red-500 px-2">{tpsmError}</p>
                )}
            </div>
            <SimpleInput
                label={tpsm === 'P' ? 'N° de Placa' : tpsm === 'S' ? 'N° de Serie' : 'N° de Motor'}
                value={npsm}
                setValue={(value) => {
                    setNpsmError('')
                    setNpsm(value)
                }}
                horizontal
                required
                error={npsmError}
                setError={setNpsmError}
            />
        </div>}
        {tipoBienJuridico === 10 && 
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput
                label="Detalle del bien materia del acto juridico"
                value={otherSpecific}
                setValue={(value) => {
                    setOtherSpecificError('')
                    setOtherSpecific(value)
                }}
                horizontal
                required
                error={otherSpecificError}
                setError={setOtherSpecificError}
            />
        </div>}
        <div className="flex items-center justify-start gap-4 px-2">
        <p>Ubigeo</p>
        <SearchableDropdownInput
            options={[...ubigeos.map(ubi => ({ id: ubi.coddis, label: `${ubi.nomdpto} - ${ubi.nomprov} - ${ubi.nomdis}` }))]}
            selected={ubigeo}
            setSelected={setUbigeo}
            placeholder="Buscar Ubigeo"
            required
            error={ubigeoError}
            setError={setUbigeoError}
        />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                label="Fecha de Inscripción"
                value={fecha}
                setValue={(value) => {
                    setFechaError('')
                    setFecha(sanitizeFourDigitYearInput(value))
                }}
                horizontal
                error={fechaError}
                setError={setFechaError}
            />
            <div className="flex items-center justify-center">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                    {loading ? 'Guardando...' : detalleBien ? 'Actualizar Detalle' : 'Crear Detalle'}
                </button>
            </div>
        </div>
    </form>
    <TopModal
        isOpen={openPredioForm}
        onClose={() => setOpenPredioForm(false)}
    >
        <PrediosMain 
            kardex={kardex}
        />

    </TopModal>
    </>
  )
}

export default DetalleBienForm