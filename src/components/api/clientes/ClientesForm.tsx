import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import useGetNacionalidades from "../../../hooks/api/nacionalidades/useGetNacionalidades"
import useGetProfesiones from "../../../hooks/api/profesiones/useGetProfesiones"
import useGetCargos from "../../../hooks/api/cargos/useGetCargos"
import axios from "axios"
import useGetUbigeos from "../../../hooks/api/ubigeo/useGetUbigeos"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import DateInput from "../../ui/DateInput"


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

const ClientesForm = () => {

    const { setMessage, setShow, setType } = useNotificationsStore()

    const [dni, setDni] = useState('47067139')
    const [apepat, setApepat] = useState('')
    const [apemat, setApemat] = useState('')
    const [prinom, setPrinom] = useState('')
    const [segnom, setSegnom] = useState('')
    const [direccion, setDireccion] = useState('')
    const [nombre, setNombre] = useState('')
    const [ubigeo, setUbigeo] = useState<{ id: string; label: string } | null>(null)
    const [naturalFrom, setNaturalFrom] = useState('')

    const [civilStatus, setCivilStatus] = useState(0)
    const [gender, setGender] = useState(0)
    const [nationality, setNationality] = useState<{ id: string; label: string } | null>(null)
    const [birthdate, setBirthdate] = useState('')
    const [resident, setResident] = useState(1)

    const [profesion, setProfesion] = useState<{ id: string; label: string } | null>(null)
    const [cargo, setCargo] = useState<{ id: string; label: string } | null>(null)

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
    
    const handleSubmit = (e: React.FormEvent) => {

        console.log('ubigeo', ubigeo);
        
        e.preventDefault()
        if (!apepat) {
            setApepatError('Apellido Paterno es requerido')
            setType('error')
            setMessage('Apellido Paterno es requerido')
            setShow(true)
            return
        }

        if (!prinom) {
            setPrinomError('Primer Nombre es requerido')
            setType('error')
            setMessage('Primer Nombre es requerido')
            setShow(true)
            return
        }

        if (!apemat) {
            setApematError('Apellido Materno es requerido')
            setType('error')
            setMessage('Apellido Materno es requerido')
            setShow(true)
            return
        }

        if (!direccion) {
            setDireccionError('Dirección es requerida')
            setType('error')
            setMessage('Dirección es requerida')
            setShow(true)
            return
        }

        if (!ubigeo) {
            setUbigeoError('Ubigeo es requerido')
            setType('error')
            setMessage('Ubigeo es requerido')
            setShow(true)
            return
        }

        if (civilStatus === 0) {
            setCivilStatusError('Estado Civil es requerido')
            setType('error')
            setMessage('Estado Civil es requerido')
            setShow(true)
            return
        }

        if (gender === 0) {
            setGenderError('Sexo es requerido')
            setType('error')
            setMessage('Sexo es requerido')
            setShow(true)
            return  
        }

        if (nationality === null) {
            setNationalityError('Nacionalidad es requerida')
            setType('error')
            setMessage('Nacionalidad es requerida')
            setShow(true)
            return
        }

        if (!birthdate) {
            setBirthdateError('Fecha de Nacimiento es requerida')
            setType('error')
            setMessage('Fecha de Nacimiento es requerida')
            setShow(true)
            return
        }

        const rawBirthdate = birthdate.split('/')

        if (rawBirthdate.length !== 3 || rawBirthdate[0].length !== 2 || rawBirthdate[1].length !== 2 || rawBirthdate[2].length !== 4) {
            setBirthdateError('Fecha de Nacimiento debe ser en formato DD/MM/AAAA')
            setType('error')
            setMessage('Fecha de Nacimiento debe ser en formato DD/MM/AAAA')
            setShow(true)
            return
        }

        if (parseInt(rawBirthdate[0]) < 1 || parseInt(rawBirthdate[0]) > 31) {
            setBirthdateError('Día de Nacimiento debe ser entre 01 y 31')
            setType('error')
            setMessage('Día de Nacimiento debe ser entre 01 y 31')
            setShow(true)
            return  
        }

        if (parseInt(rawBirthdate[1]) < 1 || parseInt(rawBirthdate[1]) > 12) {
            setBirthdateError('Mes de Nacimiento debe ser entre 01 y 12')
            setType('error')
            setMessage('Mes de Nacimiento debe ser entre 01 y 12')
            setShow(true)
            return  
        }

        if (parseInt(rawBirthdate[2]) < 1900 || parseInt(rawBirthdate[2]) > new Date().getFullYear()) {
            setBirthdateError('Año de Nacimiento debe ser válido')
            setType('error')
            setMessage('Año de Nacimiento debe ser válido')
            setShow(true)
            return  
        }

        if (profesion === null) {
            setProfesionError('Profesión es requerida')
            setType('error')
            setMessage('Profesión es requerida')
            setShow(true)
            return
        }

        if (cargo === null) {
            setCargoError('Cargo es requerido')
            setType('error')
            setMessage('Cargo es requerido')
            setShow(true)
            return
        }

    }

    const handleReniec = () => {
        console.log('Consulta RENIEC')
        axios.get(`${import.meta.env.VITE_PERUDEVS_DNI_URL}document=${dni}&key=${import.meta.env.VITE_PERUDEVS_TOKEN}`
        ).then(response => {
            console.log('response', response.data)
            setApepat(response.data.resultado.apellido_paterno || '')
            setApemat(response.data.resultado.apellido_materno || '')
            setPrinom(response.data.resultado.nombres.split(' ')[0] || '')
            setBirthdate(response.data.resultado.fecha_nacimiento || '')
            setDireccion('Avis Luz y Fuerza D-8')
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

    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades()
    const { data: profesiones, isLoading: isLoadingProfesiones, isError: isErrorProfesiones, isSuccess: isSuccessProfesiones } = useGetProfesiones()
    const { data: cargos, isLoading: isLoadingCargos, isError: isErrorCargos, isSuccess: isSuccessCargos } = useGetCargos()
    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos()

    if (isNacionalidadesLoading || isLoadingProfesiones || isLoadingCargos || isLoadingUbigeos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorProfesiones || isErrorCargos || isErrorUbigeo) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessProfesiones && isSuccessCargos && isSuccessUbigeo)

  return (
    <form
        onSubmit={handleSubmit}
    >
        <div className="grid grid-cols-3 items-center gap-6 mb-10">
            <div></div>
            <h2 className="text-xl font-bold text-center">Nuevo Cliente</h2>
            <button
                type="button"
                onClick={handleReniec}
                className="bg-gray-50 px-2 py-1 w-[60%] text-sm h-full transition duration-300 border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex justify-center items-center gap-1"
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
        <>{console.log('ubigeos', ubigeos)}</>
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
                    options={[...cargos.map(car => ({ id: (car.idcargoprofe).toString(), label: car.descripcrapro }))]}
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
                Guardar Cliente
            </button>
        </div>
    </form>
  )
}

export default ClientesForm