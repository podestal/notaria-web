import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"

const ClientesForm = () => {



    const [apepat, setApepat] = useState('')
    const [apemat, setApemat] = useState('')
    const [prinom, setPrinom] = useState('')
    const [segnom, setSegnom] = useState('')
    const [direccion, setDireccion] = useState('')
    const [nombre, setNombre] = useState('')

  return (
    <form>
        <h2 className="text-2xl font-bold text-center mb-10">Nuevo Cliente</h2>
        <div className="flex justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Apellido Paterno"
                value={apepat}
                setValue={setApepat}
                horizontal={true}
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
            />
            <SimpleInput 
                label="Segundo Nombre"
                value={segnom}
                setValue={setSegnom}
                horizontal={true}
            />
        </div>
        <div className="flex flex-col justify-center items-center gap-6 mb-4">
            <SimpleInput 
                label="Dirección"
                value={direccion}
                setValue={setDireccion}
                horizontal={true}
            />
            <SimpleInput 
                label="Ubigeo"
                value={nombre}
                setValue={setNombre}
                horizontal={true}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleInput 
                label="Estado Civil"
                value={prinom}
                setValue={setPrinom}
                horizontal={true}
            />
            <SimpleInput 
                label="Sexo"
                value={segnom}
                setValue={setSegnom}
                horizontal={true}
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleInput 
                label="Nacionalidad"
                value={prinom}
                setValue={setPrinom}
                horizontal={true}
            />
            <SimpleInput 
                label="Residente"
                value={segnom}
                setValue={setSegnom}
                horizontal={true}
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
            />
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleInput 
                label="Prof/Ocupación"
                value={prinom}
                setValue={setPrinom}
                horizontal={true}
            />
            <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Seleccionar</button>
        </div>
        <div className="flex justify-center items-center gap-6 mb-6">
            <SimpleInput 
                label="Cargo"
                value={prinom}
                setValue={setPrinom}
                horizontal={true}
            />
            <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Seleccionar</button>
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