import { useState } from "react"
import SimpleSelector from "../../ui/SimpleSelector"
import { TIPOS_BIENES, BIEN_ACTO_JURIDICO, SEDES_REGISTRALES } from "../../../data/patrimonialData"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import { DetalleBien } from "../../../services/api/detalleBienService"
import DateInput from "../../ui/DateInput"
import { Ubigeo } from "../../../services/api/ubigeoService"
// import useAuthStore from "../../../store/useAuthStore"

interface Props {
  kardex?: string
  idtipoacto?: string
  detalleBien?: DetalleBien
  ubigeos: Ubigeo[]
}

const DetalleBienForm = ({ kardex, idtipoacto, detalleBien, ubigeos }: Props) => {

    // const access = useAuthStore(s => s.access_token) || ''
    console.log('idtipoacto', idtipoacto);
    console.log('detalleBien', detalleBien);
    console.log('kardex', kardex);
    
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

  return (
    <form className="flex flex-col gap-4">
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
        <SearchableDropdownInput
            options={[...ubigeos.map(ubi => ({ id: ubi.coddis, label: `${ubi.nomdpto} - ${ubi.nomprov} - ${ubi.nomdis}` }))]}
            selected={ubigeo}
            setSelected={setUbigeo}
            placeholder="Buscar Ubigeo"
            required
        />
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
                    Guardar
                </button>
            </div>
        </div>
    </form>
  )
}

export default DetalleBienForm