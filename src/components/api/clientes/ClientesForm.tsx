import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import Selector from "../../ui/Selector"
import SimpleSelector from "../../ui/SimpleSelector"
import nationalities from "../../../utils/nationalities"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import useGetNacionalidades from "../../../hooks/api/nacionalidades/useGetNacionalidades"
import useGetProfesiones from "../../../hooks/api/profesiones/useGetProfesiones"
import useGetCargos from "../../../hooks/api/cargos/useGetCargos"


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



    const [apepat, setApepat] = useState('')
    const [apemat, setApemat] = useState('')
    const [prinom, setPrinom] = useState('')
    const [segnom, setSegnom] = useState('')
    const [direccion, setDireccion] = useState('')
    const [nombre, setNombre] = useState('')

    const [civilStatus, setCivilStatus] = useState(0)
    const [sex, setSex] = useState(0)
    const [nationality, setNationality] = useState<{ id: string; label: string } | null>(null)
    const [resident, setResident] = useState(1)

    // Error handling states
    const [apepatError, setApepatError] = useState('')
    const [prinomError, setPrinomError] = useState('') 
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!apepat) {
            setApepatError('Apellido Paterno es requerido')
            return
        }
    }

    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades()
    const { data: profesiones, isLoading: isLoadingProfesiones, isError: isErrorProfesiones, isSuccess: isSuccessProfesiones } = useGetProfesiones()
    const { data: cargos, isLoading: isLoadingCargos, isError: isErrorCargos, isSuccess: isSuccessCargos } = useGetCargos()

    if (isNacionalidadesLoading || isLoadingProfesiones || isLoadingCargos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorProfesiones || isErrorCargos) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessProfesiones && isSuccessCargos)

  return (
    <form
        onSubmit={handleSubmit}
    >
        <h2 className="text-2xl font-bold text-center mb-10">Nuevo Cliente</h2>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Apellido Paterno"
                value={apepat}
                setValue={setApepat}
                horizontal={true}
                required={true}
                error={apepatError}
            />
            <SimpleInput 
                label="Apellido Materno"
                value={apemat}
                setValue={setApemat}
                horizontal={true}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleInput 
                label="Primer Nombre"
                value={prinom}
                setValue={setPrinom}
                horizontal={true}
                required
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
            />
            <SimpleInput 
                label="Ubigeo"
                value={nombre}
                setValue={setNombre}
                horizontal={true}
                required
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleSelector 
                label="Estado Civil"
                setter={setCivilStatus}
                options={civilStatusOptions}
                horizontal={true}
                required
            />
            <SimpleSelector 
                label="Sexo"
                setter={setSex}
                options={sexOptions}
                horizontal={true}
                required
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
                value={prinom}
                setValue={setPrinom}
                horizontal={true}
            />
            <SimpleInput 
                label="Fecha de Nacimiento"
                value={segnom}
                setValue={setSegnom}
                horizontal={true}
                required
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <div className="w-full flex justify-center items-center gap-4 col-span-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Profesión</p>
                <SearchableDropdownInput
                    options={[...profesiones.map(prof => ({ id: (prof.idprofesion).toString(), label: prof.desprofesion }))]}
                    selected={nationality}
                    setSelected={setNationality}
                    placeholder="Buscar Profesión"
                    required
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4 col-span-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Cargo</p>
                <SearchableDropdownInput
                    options={[...cargos.map(car => ({ id: (car.idcargoprofe).toString(), label: car.descripcrapro }))]}
                    selected={nationality}
                    setSelected={setNationality}
                    placeholder="Buscar Cargo"
                    required
                />
            </div>
            {/* <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Seleccionar</button> */}
        </div>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Teléfono Celular"
                value={direccion}
                setValue={setDireccion}
                horizontal={true}
            />
            <SimpleInput 
                label="Teléfono Oficina"
                value={nombre}
                setValue={setNombre}
                horizontal={true}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Teléfono Fijo"
                value={direccion}
                setValue={setDireccion}
                horizontal={true}
            />
            <SimpleInput 
                label="Email"
                value={nombre}
                setValue={setNombre}
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