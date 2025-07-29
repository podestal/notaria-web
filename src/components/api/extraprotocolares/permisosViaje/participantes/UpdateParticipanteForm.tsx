import { useState } from "react";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import SimpleInput from "../../../../ui/SimpleInput";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";
import { PERMISO_VIAJE_CONDICIONES } from "../../../../../data/permisoViajeData";

interface Props {
    contratanteViaje?: ViajeContratante;
}

const UpdateParticipanteForm = ({ contratanteViaje }: Props) => {

    const [documento, setDocumento] = useState(contratanteViaje?.c_codcontrat || '');
    const [nombres, setNombres] = useState(contratanteViaje?.c_descontrat || '');
    const [firma, setFirma] = useState(contratanteViaje?.c_fircontrat?.toLocaleLowerCase() || '0');
    const [condicion, setCondicion] = useState(contratanteViaje?.c_condicontrat || '0');

  return (
    <div className="p-4">
        <h2 className="text-lg text-center mb-6 font-semibold">Actualizar Participante</h2>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Documento"
                value={documento}
                setValue={setDocumento}
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Nombres y Apellidos"
                value={nombres}
                setValue={setNombres}
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelectorStr
                options={[{ value: '0', label: 'Seleccione una condición' }, ...PERMISO_VIAJE_CONDICIONES.map(condicion => ({
                    value: condicion.id_condicion.toString(),
                    label: condicion.des_condicion
                }))]}
                defaultValue={condicion}
                setter={setCondicion}
                label="Condición"
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelectorStr
                options={[{ value: '0', label: 'Seleccione una opción' }, { value: 'si', label: 'Si' }, { value: 'no', label: 'No' }]}
                defaultValue={firma}
                setter={setFirma}
                label="Firma"
            />
        </div>
        <div className="flex justify-center items-center gap-12 mt-6">
            <button
                className=" bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer px-4 py-2"
            >
                Guardar
            </button>
            <button
                className=" bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors cursor-pointer px-4 py-2"
            >
                Cancelar
            </button>
        </div>
    </div>
  )
}

export default UpdateParticipanteForm