import { useState } from "react";
import { Cliente } from "../../../../../services/api/cliente1Service"
import { PODERES_CONDICIONES } from "../../../../../data/poderesFueraDeRegistro";
import SimpleInput from "../../../../ui/SimpleInput";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";
import useCreatePoderesContratante from "../../../../../hooks/api/extraprotocolares/ingresoPoderes/contratantes/useCreatePoderesContratante";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";

interface Props {
    cliente1: Cliente
    poderId: number
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ContratantesForm = ({ cliente1, poderId, setOpen }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()

    const [appePaterno, setAppePaterno] = useState(cliente1?.apepat || '');
    const [appeMaterno, setAppeMaterno] = useState(cliente1?.apemat || '');
    const [priNombre, setPriNombre] = useState(cliente1?.prinom || '');
    const [segNombre, setSegNombre] = useState(cliente1?.segnom || '');
    const [direccion, setDireccion] = useState(cliente1?.direccion || '');
    const [firma, setFirma] = useState('SI');
    const [condicion, setCondicion] = useState('0');
    const [loading, setLoading] = useState(false);

    const [condicionError, setCondicionError] = useState('');

    // mutation to create contratante
    const createContratanteNatural = useCreatePoderesContratante({poderId})

    const handleCreate = () => {

        if (condicion === '0') {
            setCondicionError('Debe seleccionar una condición');
            return;
        }

        setLoading(true);

        if (cliente1.tipper === 'N') {
            createContratanteNatural.mutate({
                ingresoPoderesContratante: {
                    id_poder: poderId,
                    c_codcontrat: cliente1.numdoc,
                    c_descontrat: `${appePaterno} ${appeMaterno} ${priNombre} ${segNombre}`,
                    c_fircontrat: firma,
                    c_condicontrat: condicion,
                    codi_asegurado: '',
                    codi_testigo: '',
                    tip_incapacidad: ''
                }, 
                access: localStorage.getItem('access') || ''
            }, {
                onSuccess: () => {
                    setMessage('Contratante creado exitosamente');
                    setShow(true);
                    setType('success');
                    setOpen(false);
                },
                onError: (error) => {
                    console.error(error);
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
       }
    }

  return (
    <div>
        <div className="grid grid-cols-2 gap-4 my-4">
           <SimpleInput 
                label="Apellido Paterno"
                value={appePaterno}
                setValue={setAppePaterno}
                horizontal
            />
            <SimpleInput 
                label="Apellido Materno"
                value={appeMaterno}
                setValue={setAppeMaterno}
                horizontal
            />
        </div> 
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Primer Nombre"
                value={priNombre}
                setValue={setPriNombre}
                horizontal
            />
            <SimpleInput 
                label="Segundo Nombre"
                value={segNombre}
                setValue={setSegNombre}
                horizontal
            />
        </div>
        <div className="grid grid-cols-1 gap-4 my-4">
            <SimpleInput 
                label="Dirección"
                value={direccion}
                setValue={setDireccion}
                horizontal
                fullWidth
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelectorStr 
                label="Firma"
                options={[
                    { value: 'SI', label: 'Si' },
                    { value: 'NO', label: 'No' }
                ]}
                setter={setFirma}
                defaultValue={firma}
            />
            <SimpleSelectorStr
                label="Condición"
                setter={setCondicion}
                options={[{ value: '0', label: 'Seleccionar condición' }, ...PODERES_CONDICIONES.map(
                    condicion => ({
                        value: condicion.id_condicion,
                        label: condicion.des_condicion
                    })
                )]}
                defaultValue={condicion}
                required
                error={condicionError}
                setError={setCondicionError}
            />
        </div>
        <div className="flex justify-end items-center">
            <button
                type="button"
                className="bg-blue-500 text-white text-xs px-4 py-2 my-6 rounded hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
                onClick={handleCreate}
            >{loading ? 'Cargando...' : 'Guardar'}
            </button>
        </div>
    </div>
  )
}

export default ContratantesForm