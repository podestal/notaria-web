import { useState } from "react";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import SimpleInput from "../../../../ui/SimpleInput";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";
import { PERMISO_VIAJE_CONDICIONES } from "../../../../../data/permisoViajeData";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";
import useAuthStore from "../../../../../store/useAuthStore";
import { UseMutationResult } from "@tanstack/react-query";
import { UpdateContratanteData } from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useUpdateContratante";

interface Props {
    contratanteViaje: ViajeContratante;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    updateContratante: UseMutationResult<ViajeContratante, Error, UpdateContratanteData>
}

const UpdateParticipanteForm = ({ contratanteViaje, setOpen, updateContratante }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const access = useAuthStore(s => s.access_token) || "";
    const [loading, setLoading] = useState(false);

    const [documento, setDocumento] = useState(contratanteViaje?.c_codcontrat || '');
    const [nombres, setNombres] = useState(contratanteViaje?.c_descontrat || '');
    const [firma, setFirma] = useState(contratanteViaje?.c_fircontrat?.toLocaleLowerCase() || '0');
    const [condicion, setCondicion] = useState(contratanteViaje?.c_condicontrat || '0');

    const handleUpdate = () => {
        setLoading(true);
        updateContratante.mutate({
            contratante: {
                    id_viaje: contratanteViaje.id_viaje, 
                    c_codcontrat: documento, 
                    c_descontrat: nombres,
                    c_fircontrat: firma,
                    c_condicontrat: condicion,
                    edad: contratanteViaje.edad, 
                    condi_edad: contratanteViaje.condi_edad, 
                    codi_testigo: contratanteViaje.codi_testigo, 
                    tip_incapacidad: contratanteViaje.tip_incapacidad, 
                    codi_podera: contratanteViaje.codi_podera, 
                    partida_e: contratanteViaje.partida_e, 
                    sede_regis: contratanteViaje.sede_regis
            },
            access
        }, {
            onSuccess: () => {
                setType('success');
                setMessage('Participante actualizado correctamente.');
                setShow(true);
                setOpen(false);
            },
            onError: (error) => {
                setType('error');
                setMessage(`Error al actualizar el participante: ${error.message}`);
                setShow(true);
            },
            onSettled: () => {
                setLoading(false);
            }
        });
    }

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
                onClick={handleUpdate}
                type="button"
                disabled={loading}
                className={` ${loading ? 'opacity-50 cursor-not-allowed' : ''} bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer px-4 py-2`}
            >
                {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
                onClick={() => setOpen(false)}
                type="button"
                className=" bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors cursor-pointer px-4 py-2"
            >
                Cancelar
            </button>
        </div>
    </div>
  )
}

export default UpdateParticipanteForm