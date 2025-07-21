import { useEffect, useState } from "react"
import SimpleSelector from "../../ui/SimpleSelector"
import { TIPOS_BIENES, BIEN_ACTO_JURIDICO, SEDES_REGISTRALES } from "../../../data/patrimonialData"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import { DetalleBien } from "../../../services/api/detalleBienService"
import DateInput from "../../ui/DateInput"
import { Ubigeo } from "../../../services/api/ubigeoService"
import { UseMutationResult } from "@tanstack/react-query"
import { DetalleBienCreateData } from "../../../hooks/api/detalleBien/useCreateDetalleBienes"
import useAuthStore from "../../../store/useAuthStore"
import SingleSelect from "../../ui/SingleSelect"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import TopModal from "../../ui/TopModal"
import DetalleBienPredioForm from "./DetalleBienPredioForm"
import { DetalleBienUpdateData } from "../../../hooks/api/detalleBien/useUpdateDetalleBien"
// import useAuthStore from "../../../store/useAuthStore"

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

    useEffect(() => {
        if (tipoBienJuridico === 4 && !detalleBien) {
            setOpenPredioForm(true)
        } else {
            setOpenPredioForm(false)
        }
    }, [tipoBienJuridico])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        createDetalleBien && createDetalleBien.mutate({
            access,
            detalleBien: {
                kardex,
                idtipacto: idtipoacto,
                tipob: tipoBien === 1 ? 'BIENES' : 'SERVICIOS',
                pregistral: partida,
                idtipbien: tipoBienJuridico,
                idsedereg: sedeRegistral,
                coddis: ubigeo ? ubigeo.id : '',
                fechaconst: fecha,
                itemmp,
                oespecific: otherSpecific,
                smaquiequipo: serieMaqEq,
                tpsm: tpsm,
                npsm: npsm
            }
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
            detalleBien: {
                kardex,
                idtipacto: idtipoacto,
                tipob: tipoBien === 1 ? 'BIENES' : 'SERVICIOS',
                pregistral: partida,
                idtipbien: tipoBienJuridico,
                idsedereg: sedeRegistral,
                coddis: ubigeo ? ubigeo.id : '',
                fechaconst: fecha,
                itemmp,
                oespecific: otherSpecific,
                smaquiequipo: serieMaqEq,
                tpsm: tpsm,
                npsm: npsm
            }
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
                setter={setTipoBienJuridico}
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
        {tipoBienJuridico === 5 && 
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput
                label="N° de Serie para Maquinaria y Equipos"
                value={serieMaqEq}
                setValue={setSerieMaqEq}
                horizontal
            />
        </div>}
        {tipoBienJuridico === 8 && 
        <div className="grid grid-cols-2 gap-4">
            <SingleSelect 
                options={[
                    { value: 'P', label: 'N° de Placa' },
                    { value: 'S', label: 'N° de Serie' },
                    { value: 'M', label: 'N° de Motor' }
                ]}
                selected={tpsm}
                onChange={setTpsm}
            />
            <SimpleInput
                label={tpsm === 'P' ? 'N° de Placa' : tpsm === 'S' ? 'N° de Serie' : 'N° de Motor'}
                value={npsm}
                setValue={setNpsm}
                horizontal
            />
        </div>}
        {tipoBienJuridico === 10 && 
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput
                label="Detalle del bien materia del acto juridico"
                value={otherSpecific}
                setValue={setOtherSpecific}
                horizontal
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
            
        />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <DateInput 
                label="Fecha de Inscripción"
                value={fecha}
                setValue={setFecha}
                horizontal
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
        <DetalleBienPredioForm />

    </TopModal>
    </>
  )
}

export default DetalleBienForm