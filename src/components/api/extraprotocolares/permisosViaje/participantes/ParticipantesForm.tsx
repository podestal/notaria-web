import { useState } from "react";
import { documentNaturalOptions } from "../../../../../data/clienteData";
import { PERMISO_VIAJE_CONDICIONES } from "../../../../../data/permisoViajeData";
import Selector from "../../../../ui/Selector";
import axios from "axios";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import SimpleInput from "../../../../ui/SimpleInput";
import { UseMutationResult } from "@tanstack/react-query";
import { CreateContratanteData } from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useCreateContratante";
import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";

interface Props {
    contratanteViaje?: ViajeContratante;
    createContratante?: UseMutationResult<ViajeContratante, Error, CreateContratanteData>
    idViaje: number
}

const ParticipantesForm = ({ contratanteViaje, createContratante, idViaje }: Props) => {

    const access = useAuthStore(s => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()

    // Cliente lookup 
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(1);
    const [document, setDocument] = useState('');
    const [loading, setLoading] = useState(false);

    // Contratante Viaje
    const [selectedCondicion, setSelectedCondicion] = useState(contratanteViaje ? contratanteViaje.c_condicontrat : '');
    const [firma, setFirma] = useState(contratanteViaje ? contratanteViaje.c_fircontrat : '');
    const [appePaterno, setAppePaterno] = useState('');
    const [appeMaterno, setAppeMaterno] = useState('');
    const [priNombre, setPriNombre] = useState('');
    const [segNombre, setSegNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [selectedUbigeo, setSelectedUbigeo] = useState('');
    const [estadoCivil, setEstadoCivil] = useState('');
    const [genero, setGenero] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');

    const handleClienteLookup = () => {
        setLoading(true);
        // Simulate an API call
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`
        ).then(response => {
            if (response.data.idcliente) {
                console.log('Cliente encontrado:', response.data);
                setAppePaterno(response.data.apepat || '');
                setAppeMaterno(response.data.apemat || '');
                setPriNombre(response.data.prinom || '');
                setSegNombre(response.data.segnom || '');
                setDireccion(response.data.direccion || '');
                setSelectedUbigeo(response.data.idubigeo || '');
                setEstadoCivil(response.data.idestcivil.toString() || '');
                setGenero(response.data.sexo || '');
                setNacionalidad(response.data.nacionalidad || '');
                // setCliente1(response.data)
                // setShowContratanteForm(true)
                // setShowClienteForm(false)
            } else {
                console.log('Cliente no encontrado, creando nuevo cliente')
                // setCliente1(null)
                // setShowContratanteForm(false)
                // setShowClienteForm(true)
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleCreateContratante = () => {

        console.log(idViaje, 'idViaje');
        

        if (!selectedCondicion) {
            setMessage('Debe seleccionar una condición');
            setShow(true);
            setType('error');
            return;
        }

        if (!firma) {
            setMessage('Debe seleccionar una firma');
            setShow(true);
            setType('error');
            return;
        }

        setLoading(true);

        if (createContratante) {
            createContratante.mutate({
                contratante: {
                    id_viaje: idViaje, // This will be set by the backend
                    c_codcontrat: document, // This can be generated or set as needed
                    c_descontrat: `${appePaterno} ${appeMaterno}, ${priNombre} ${segNombre}`,
                    c_fircontrat: firma,
                    c_condicontrat: selectedCondicion,
                    edad: '', // Set as needed
                    condi_edad: '', // Set as needed
                    codi_testigo: '', // Set as needed
                    tip_incapacidad: '', // Set as needed
                    codi_podera: '', // Set as needed
                    partida_e: '', // Set as needed
                    sede_regis: '' // Set as needed
                },
                access
            }, {
                onSuccess: (res) => {
                    setMessage('Contratante creado exitosamente');
                    setShow(true);
                    setType('success');
                    console.log('Contratante creado exitosamente:', res);
                },
                onError: (error) => {
                    setMessage('Error al crear el contratante');
                    setShow(true);
                    setType('error');
                    console.error('Error al crear el contratante:', error);
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
        }
    }

  return (
    <div>
        <div className="grid grid-cols-5 gap-4">
            <div className="w-full col-span-2">
                <Selector 
                    label="Tipo de documento"
                    options={documentNaturalOptions}
                    setter={setSelectedTipoDocumento}
                    defaultValue={selectedTipoDocumento}
                />
            </div>
            {selectedTipoDocumento > 0 && 
            <div className="flex flex-col gap-2 col-span-2">
                <p className="text-md font-bold py-2">{documentNaturalOptions.find(document => document.value === selectedTipoDocumento)?.label}</p>
                <input 
                    type="text"
                    value={document}
                    onChange={e => setDocument(e.target.value)}
                    placeholder={documentNaturalOptions.find(document => document.value === selectedTipoDocumento)?.label || ''}
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
            </div>}
            {selectedTipoDocumento > 0 && 
            <div className="flex justify-center items-center">
                <button 
                    onClick={handleClienteLookup}
                    disabled={document.length === 0 || loading}
                    className={`w-[60%] mx-auto bg-blue-600 text-white rounded-md py-2 mt-4 transition-colors duration-300 ${loading && 'animate-pulse'} ${document.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
                    type="submit">
                    {loading ? '...' : 'Buscar'}
                </button>
            </div>
            }
        </div>
        <div>
            <div className="grid grid-cols-2 gap-4 my-4">
                <SimpleSelectorStr 
                    label="Condiciones"
                    options={ [{ value: '', label: 'Seleccionar condición' }, ...PERMISO_VIAJE_CONDICIONES.map(condicion => ({
                        value: condicion.id_condicion,
                        label: condicion.des_condicion
                    }))]}
                    setter={setSelectedCondicion}
                    defaultValue={selectedCondicion}
                    required
                />
                <SimpleSelectorStr 
                    label="Firma"
                    options={[
                        { value: '', label: 'Seleccionar firma' },
                        { value: 'si', label: 'Si' },
                        { value: 'no', label: 'No' }
                    ]}
                    setter={setFirma}
                    defaultValue={firma}
                    required
                />
            </div>    
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
            <SimpleInput 
                label="Dirección"
                value={direccion}
                setValue={setDireccion}
                horizontal
                fullWidth
            />
            <div className="my-4"></div>
            <SimpleInput 
                label="Ubigeo"
                value={selectedUbigeo}
                setValue={setSelectedUbigeo}
                horizontal
                fullWidth
            />
            <div className="grid grid-cols-2 gap-4 my-4">
                <SimpleInput 
                    label="Estado Civil"
                    value={estadoCivil}
                    setValue={setEstadoCivil}
                    horizontal
                />
                <SimpleInput 
                    label="Género"
                    value={genero}
                    setValue={setGenero}
                    horizontal
                />
            </div>
            <div className="grid grid-cols-2 gap-4 my-4">
                <SimpleInput 
                    label="Nacionalidad"
                    value={nacionalidad}
                    setValue={setNacionalidad}
                    horizontal
                />
            </div>
            <button
                onClick={handleCreateContratante}
                type="button"
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {loading ? 'Creando...' : 'Guardar'}
            </button>
        </div>
    </div>
  )
}

export default ParticipantesForm