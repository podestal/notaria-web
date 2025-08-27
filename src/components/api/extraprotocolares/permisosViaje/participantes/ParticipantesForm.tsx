import { useEffect, useState } from "react";
import { PERMISO_VIAJE_CONDICIONES } from "../../../../../data/permisoViajeData";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import SimpleInput from "../../../../ui/SimpleInput";
import { UseMutationResult } from "@tanstack/react-query";
import { CreateContratanteData } from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useCreateContratante";
import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";
import { Ubigeo } from "../../../../../services/api/ubigeoService";
import { Nacionalidad } from "../../../../../services/api/nacionalidadesService";
import { ESTADO_CIVIL } from "../../../../../data/clienteData";
import SearchableDropdownInput from "../../../../ui/SearchableDropdownInput";

interface Props {
    contratanteViaje?: ViajeContratante;
    createContratante?: UseMutationResult<ViajeContratante, Error, CreateContratanteData>
    idViaje: number
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    ubigeos: Ubigeo[]
    nacionalidades: Nacionalidad[]
    contratanteInfo: {
        apePaterno: string;
        apeMaterno: string;
        priNombre: string;
        segNombre: string;
        direccion: string;
        ubigeo: string | null;
        estadoCivil: number;
        genero: string;
        nacionalidad: string;
    }
    document: string
}

const ParticipantesForm = ({ contratanteViaje, createContratante, idViaje, setOpen, ubigeos, nacionalidades, contratanteInfo, document }: Props) => {

    console.log('contratanteInfo ->',contratanteInfo);
    

    const access = useAuthStore(s => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [loading, setLoading] = useState(false);

    // Contratante Viaje
    const [selectedCondicion, setSelectedCondicion] = useState(contratanteViaje ? contratanteViaje.c_condicontrat : '');
    const [firma, setFirma] = useState(contratanteViaje ? contratanteViaje.c_fircontrat : '');
    const [appePaterno, setAppePaterno] = useState(contratanteInfo.apePaterno || '');
    const [appeMaterno, setAppeMaterno] = useState(contratanteInfo.apeMaterno || '');
    const [priNombre, setPriNombre] = useState(contratanteInfo.priNombre || '');
    const [segNombre, setSegNombre] = useState(contratanteInfo.segNombre || '');
    const [direccion, setDireccion] = useState(contratanteInfo.direccion || '');
    const [selectedUbigeo, setSelectedUbigeo] = useState<{ id: string; label: string } | null>(() => {
        if (contratanteInfo.ubigeo) {
          const match = ubigeos.find(ubi => ubi.coddis === contratanteInfo.ubigeo);
          if (match) {
            return {
              id: match.coddis,
              label: `${match.nomdpto} - ${match.nomprov} - ${match.nomdis}`,
            };
          }
        }
        return null;
      })
    const [estadoCivil, setEstadoCivil] = useState(contratanteInfo.estadoCivil || '');
    const [genero, setGenero] = useState(contratanteInfo.genero || '');
    const [nacionalidad, setNacionalidad] = useState(contratanteInfo ? nacionalidades.find(nacionalidad => (nacionalidad.idnacionalidad).toString() === contratanteInfo.nacionalidad)?.descripcion || '' : '');

    useEffect(() => {
        setAppePaterno(contratanteInfo.apePaterno || '');
        setAppeMaterno(contratanteInfo.apeMaterno || '');
        setPriNombre(contratanteInfo.priNombre || '');
        setSegNombre(contratanteInfo.segNombre || '');
        setDireccion(contratanteInfo.direccion || '');
        setSelectedUbigeo(contratanteInfo.ubigeo ? { id: contratanteInfo.ubigeo, label: `${ubigeos.find(ubi => ubi.coddis === contratanteInfo.ubigeo)?.nomdpto} - ${ubigeos.find(ubi => ubi.coddis === contratanteInfo.ubigeo)?.nomprov} - ${ubigeos.find(ubi => ubi.coddis === contratanteInfo.ubigeo)?.nomdis}` } : null);
        setEstadoCivil(contratanteInfo ? ESTADO_CIVIL.find(estado => (estado.value) === contratanteInfo.estadoCivil)?.desestcivil || '' : '');
        setGenero(contratanteInfo ? contratanteInfo.genero === 'M' ? 'Masculino' : 'Femenino' : '');
        setNacionalidad(contratanteInfo ? nacionalidades.find(nacionalidad => (nacionalidad.idnacionalidad).toString() === contratanteInfo.nacionalidad)?.descripcion || '' : '');
    }, [contratanteInfo]);

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

        console.log('document ->', document);
        

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
                    setOpen(false);
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
        <div>
            <>{console.log('selectedUbigeo ->', selectedUbigeo)}</>
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
            <div className="w-full flex justify-center items-center gap-4 col-span-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Ubigeo</p>
                <SearchableDropdownInput
                    options={[...ubigeos.map(ubi => ({ id: ubi.coddis, label: `${ubi.nomdpto} - ${ubi.nomprov} - ${ubi.nomdis}` }))]}
                    selected={selectedUbigeo}
                    setSelected={setSelectedUbigeo}
                    placeholder="Buscar Ubigeo"
                />
            </div>
               
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