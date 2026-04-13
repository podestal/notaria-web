import { useState } from "react";
import { Cliente } from "../../../../../services/api/cliente1Service";
import SimpleInput from "../../../../ui/SimpleInput";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";
import { PODERES_CONDICIONES } from "../../../../../data/poderesFueraDeRegistro";
import useCreatePoderesContratante from "../../../../../hooks/api/extraprotocolares/ingresoPoderes/contratantes/useCreatePoderesContratante";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";

interface Props {
    cliente1: Cliente
    poderId: number
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ContratanteFormJuridica = ({ cliente1, poderId, setOpen }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const [razonSocial, setRazonSocial] = useState(cliente1?.razonsocial || '');
    const [domFiscal, setDomFiscal] = useState(cliente1?.domfiscal || '');
    const [condicion, setCondicion] = useState('0');

    const [condicionError, setCondicionError] = useState('');

    const [loading, setLoading] = useState(false);

    const createContratante = useCreatePoderesContratante({ poderId });

    const handleCreate = async () => {

        if (condicion === '0') {
            setCondicionError('Debe seleccionar una condición');
            return;
        }

        setLoading(true);

        createContratante.mutate({
                ingresoPoderesContratante: {
                    id_poder: poderId,
                    c_codcontrat: cliente1.numdoc,
                    c_descontrat: razonSocial,
                    c_fircontrat: 'NO',
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

  return (
    <div>
        <div className="my-4"></div>
        <SimpleInput 
            label="Razón Social"
            value={razonSocial}
            setValue={setRazonSocial}
            horizontal
            fullWidth
        />
        <div className="my-4"></div>
        <SimpleInput 
            label="Domicilio Fiscal"
            value={domFiscal}
            setValue={setDomFiscal}
            horizontal
            fullWidth
        />
        <div className="grid grid-cols-2 gap-4 my-4">
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

export default ContratanteFormJuridica