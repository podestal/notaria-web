import { useState } from "react"
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore"
import { Profesion } from "../../../../../services/api/profesionesService"
import { Ubigeo } from "../../../../../services/api/ubigeoService"
import { Nacionalidad } from "../../../../../services/api/nacionalidadesService"
import { Cargo } from "../../../../../services/api/cargosService"
import SimpleInput from "../../../../ui/SimpleInput"
import SearchableDropdownInput from "../../../../ui/SearchableDropdownInput"
import DateInput from "../../../../ui/DateInput"
import SimpleSelector from "../../../../ui/SimpleSelector"
import axios from "axios"

interface Props {
    ubigeos: Ubigeo[]
    nacionalidades: Nacionalidad[]
    profesiones: Profesion[]
    cargos: Cargo[]
    dni: string
}


const civilStatusOptions = [
    { value: 0, label: 'Seleccionar Estado Civil' },
    { value: 1, label: 'Soltero' },
    { value: 2, label: 'Casado' },
    { value: 3, label: 'Divorciado' },
    { value: 4, label: 'Viudo' },
    { value: 5, label: 'Conviviente' },
]

const sexOptions = [
    { value: 0, label: 'Seleccionar Sexo' },
    { value: 1, label: 'Masculino' },
    { value: 2, label: 'Femenino' },
]


const NuevoClienteForm = ({
    ubigeos,
    nacionalidades,
    profesiones,
    cargos,
    dni
}: Props) => {
    const { setMessage, setShow, setType } = useNotificationsStore()

    // NATURAL PERSON

    const [apepat, setApepat] = useState( '')
    const [apemat, setApemat] = useState( '')
    const [prinom, setPrinom] = useState( '')
    const [segnom, setSegnom] = useState( '')
    const [direccion, setDireccion] = useState( '')
    const [nombre, setNombre] = useState( '')
    const [ubigeo, setUbigeo] = useState<{ id: string; label: string } | null>(null);
      
    const [naturalFrom, setNaturalFrom] = useState('')

    const [civilStatus, setCivilStatus] = useState(0)
    const [gender, setGender] = useState(0)
    const [nationality, setNationality] = useState<{ id: string; label: string } | null>(null);
    const [birthdate, setBirthdate] = useState('')
    const [resident, setResident] = useState(1)

    const [profesion, setProfesion] = useState<{ id: string; label: string } | null>(null);
    const [cargo, setCargo] = useState<{ id: string; label: string } | null>(null);

    const [celphone, setCellphone] = useState('')
    const [officePhone, setOfficePhone] = useState('')
    const [fixedPhone, setFixedPhone] = useState('')
    const [email, setEmail] = useState('')

    // Error handling states
    const [apepatError, setApepatError] = useState('')
    const [apematError, setApematError] = useState('')
    const [prinomError, setPrinomError] = useState('') 
    const [direccionError, setDireccionError] = useState('')
    const [ubigeoError, setUbigeoError] = useState('')
    const [civilStatusError, setCivilStatusError] = useState('')
    const [genderError, setGenderError] = useState('')
    const [nationalityError, setNationalityError] = useState('')
    const [birthdateError, setBirthdateError] = useState('')
    const [profesionError, setProfesionError] = useState('')
    const [cargoError, setCargoError] = useState('')


    const handleReniec = () => {
        console.log('Consulta RENIEC')
        axios.get(`${import.meta.env.VITE_PERUDEVS_DNI_URL}document=${dni}&key=${import.meta.env.VITE_PERUDEVS_TOKEN}`
        ).then(response => {
            console.log('response', response.data)
            setApepat(response.data.resultado.apellido_paterno || '')
            setApemat(response.data.resultado.apellido_materno || '')
            setPrinom(response.data.resultado.nombres.split(' ')[0] || '')
            setBirthdate(response.data.resultado.fecha_nacimiento || '')
            // setDireccion('Avis Luz y Fuerza D-8')
            if (response.data.resultado.genero === 'M') {
                setGender(1) // Masculino
            }
            else if (response.data.resultado.genero === 'F') {
                setGender(2) // Femenino
            }

        }).catch(error => {
            console.error('Error al consultar RENIEC:', error)
        });
    }
  return (
    <>
    <div className="grid grid-cols-3 items-center gap-6 mb-10">
            <div></div>
            <h2 className="text-xl font-bold text-center text-black">Nuevo Cliente</h2>
            <button
                type="button"
                onClick={handleReniec}
                className="bg-gray-50 text-black px-2 py-1 w-[60%] text-sm h-full transition duration-300 border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex justify-center items-center gap-1"
            >Consulta Reniec</button>
        </div>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Apellido Paterno"
                value={apepat}
                setValue={setApepat}
                horizontal={true}
                required={true}
                error={apepatError}
                setError={setApepatError}
            />
            <SimpleInput 
                label="Apellido Materno"
                value={apemat}
                setValue={setApemat}
                horizontal={true}
                required={true}
                error={apematError}
                setError={setApematError}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleInput 
                label="Primer Nombre"
                value={prinom}
                setValue={setPrinom}
                horizontal={true}
                required
                error={prinomError}
                setError={setPrinomError}
            />
            <SimpleInput 
                label="Segundo Nombre"
                value={segnom}
                setValue={setSegnom}
                horizontal={true}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Dirección"
                value={direccion}
                setValue={setDireccion}
                horizontal={true}
                required
                error={direccionError}
                setError={setDireccionError}
            />
            <div className="w-full flex justify-center items-center gap-4 col-span-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Ubigeo</p>
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

        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleSelector 
                label="Estado Civil"
                setter={setCivilStatus}
                options={civilStatusOptions}
                horizontal={true}
                required
                error={civilStatusError}
                setError={setCivilStatusError}
                defaultValue={civilStatus}
            />
            <SimpleSelector 
                label="Sexo"
                setter={setGender}
                defaultValue={gender}
                options={sexOptions}
                horizontal={true}
                required
                error={genderError}
                setError={setGenderError}
            />
        </div>
        <div className="grid grid-cols-3 items-center gap-6 mb-6">
            <div className="w-full flex justify-center items-center gap-4 col-span-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Nacionalidad</p>
                <SearchableDropdownInput
                    options={[...nacionalidades.map(nat => ({ id: (nat.idnacionalidad).toString(), label: nat.descripcion }))]}
                    selected={nationality}
                    setSelected={setNationality}
                    placeholder="Buscar nacionalidad"
                    required
                    error={nationalityError}
                    setError={setNationalityError}
                />
            </div>
            <SimpleSelector 
                label="Residente"
                setter={setResident}
                defaultValue={resident}
                options={[
                    { value: 1, label: 'Sí' },
                    { value: 0, label: 'No' }
                ]}
                horizontal={true}
                required
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleInput 
                label="Natural de"
                value={naturalFrom}
                setValue={setNaturalFrom}
                horizontal={true}
            />
            <DateInput 
                label="Fecha de Nacimiento"
                value={birthdate}
                setValue={setBirthdate}
                required
                error={birthdateError}
                setError={setBirthdateError}
                horizontal
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <div className="w-full flex justify-center items-center gap-4 col-span-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Profesión</p>
                <SearchableDropdownInput
                    options={[...profesiones.map(prof => ({ id: (prof.idprofesion).toString(), label: prof.desprofesion }))]}
                    selected={profesion}
                    setSelected={setProfesion}
                    placeholder="Buscar Profesión"
                    required
                    error={profesionError}
                    setError={setProfesionError}
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4 col-span-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Cargo</p>
                <SearchableDropdownInput
                    options={[...cargos
                        .map(car => ({ id: (car.idcargoprofe).toString(), label: car.descripcrapro }))]}
                    selected={cargo}
                    setSelected={setCargo}
                    placeholder="Buscar Cargo"
                    required
                    error={cargoError}
                    setError={setCargoError}
                />
            </div>
            {/* <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Seleccionar</button> */}
        </div>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Teléfono Celular"
                value={celphone}
                setValue={setCellphone}
                horizontal={true}
            />
            <SimpleInput 
                label="Teléfono Oficina"
                value={officePhone}
                setValue={setOfficePhone}
                horizontal={true}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Teléfono Fijo"
                value={fixedPhone}
                setValue={setFixedPhone}
                horizontal={true}
            />
            <SimpleInput 
                label="Email"
                value={email}
                setValue={setEmail}
                horizontal={true}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-4">
            <button 
                type="submit"
                className="mt-8 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                Crear Cliente
            </button>
        </div>
    </>
  )
}

export default NuevoClienteForm