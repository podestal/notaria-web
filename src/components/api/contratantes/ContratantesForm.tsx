import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"

const ContratantesForm = () => {

    const [apePaterno, setApePaterno] = useState('')
    const [apeMaterno, setApeMaterno] = useState('')
    const [prinom, setPrinom] = useState('')
    const [segnom, setSegnom] = useState('')
    const [address, setAddress] = useState('')

    const handleCreateContratante = (e: React.FormEvent) => {
        e.preventDefault()
    }

  return (
    <>
    {/* <ClientesForm /> */}
    <form
        onSubmit={handleCreateContratante}
    >
        <h2 className="text-xl text-center font-bold mb-6">Nuevo Contratante</h2>
        <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2">
                <SimpleInput 
                    label="Apellido Paterno"
                    value={apePaterno}
                    setValue={setApePaterno}
                    horizontal
                />
            </div>
            <div className="col-span-2">
                <SimpleInput 
                    label="Apellido Materno"
                    value={apeMaterno}
                    setValue={setApeMaterno}
                    horizontal
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4">
                <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                    <span className="font-bold text-green-600 text-md">+</span>
                    <span>Condición</span>
                </button>
                <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                    <span className="font-bold text-red-600 text-md">-</span>
                    <span>Condición</span>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
            <div className="col-span-2">
                <SimpleInput 
                    label="Primer Nombre"
                    value={prinom}
                    setValue={setPrinom}
                    horizontal
                />
            </div>
            <div className="col-span-2">
                <SimpleInput 
                    label="Segundo Nombre"
                    value={segnom}
                    setValue={setSegnom}
                    horizontal
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4">
                <button className="bg-gray-50 h-full px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">
                    Grabar Contratante
                </button>
            </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
            <div className="col-span-4 w-full">
                <SimpleInput 
                    label="Dirección"
                    value={address}
                    setValue={setAddress}
                    horizontal
                    fullWidth
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4">
                <button className="bg-gray-50 h-full px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">
                    Editar Cliente
                </button>
            </div>
        </div>
        <div className="flex items-center justify-start gap-10 mt-6">
            <div className="flex items-center justify-center gap-4">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Firma</p>
                <input type="checkbox" />
            </div>
            <div className="flex items-center justify-center gap-4">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Incluir en el Indic</p>
                <input type="checkbox" />
            </div>
        </div>
    </form>
    </>
  )
}

export default ContratantesForm