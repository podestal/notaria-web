import { useState } from "react";
import { Cliente } from "../../../../../services/api/cliente1Service"
import PreClientForm from "../../../clientes/PreClientForm"
import { PODERES_CONDICIONES } from "../../../../../data/poderesFueraDeRegistro";
import SimpleInput from "../../../../ui/SimpleInput";
import SimpleSelector from "../../../../ui/SimpleSelector";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";

interface Props {
    cliente1: Cliente
}


const ContratantesForm = ({ cliente1 }: Props) => {

    const [appePaterno, setAppePaterno] = useState(cliente1?.apepat || '');
    const [appeMaterno, setAppeMaterno] = useState(cliente1?.apemat || '');
    const [priNombre, setPriNombre] = useState(cliente1?.prinom || '');
    const [segNombre, setSegNombre] = useState(cliente1?.segnom || '');
    const [direccion, setDireccion] = useState(cliente1?.direccion || '');
    const [firma, setFirma] = useState('0');
    const [condicion, setCondicion] = useState('0');
    const [loading, setLoading] = useState(false);

    const [firmaError, setFirmaError] = useState('');
    const [condicionError, setCondicionError] = useState('');

    const handleCreate = () => {

        if (firma === '0') {
            setFirmaError('Debe seleccionar una firma');
            return;
        }

        if (condicion === '0') {
            setCondicionError('Debe seleccionar una condición');
            return;
        }

        setLoading(true);

        // Aquí se puede agregar la lógica para crear el contratante

        setTimeout(() => {
            setLoading(false);

        }, 1000);
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
                    { value: '0', label: 'Seleccionar firma' },
                    { value: 'si', label: 'Si' },
                    { value: 'no', label: 'No' }
                ]}
                setter={setFirma}
                defaultValue={firma}
                required
                error={firmaError}
                setError={setFirmaError}
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
            >Guardar
            </button>
        </div>
    </div>
  )
}

export default ContratantesForm