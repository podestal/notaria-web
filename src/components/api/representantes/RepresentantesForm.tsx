import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import { SedeRegistral } from "../../../services/api/sedesRegistralesService"
import { Contratante } from "../../../services/api/contratantesService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    sedesRegistrales: SedeRegistral[]
    contratantes: Contratante[]
}

const RepresentantesForm = ({ sedesRegistrales, contratantes }: Props) => {

    const [facultades, setFacultades] = useState('')
    const [subscribed, setSubscribed] = useState(1)
    const [sedeRegistral, setSedeRegistral] = useState(1)
    const [nPartida, setNPartida] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí puedes manejar el envío del formulario, por ejemplo, enviando los datos a una API
    }

  return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4">
            <h2 className="text-2xl text-center mb-6">Contratantes</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                <SimpleInput 
                    label="Facultades"
                    value={facultades}
                    setValue={setFacultades}
                    horizontal
                />
                </div>
                <SimpleSelector 
                    label="Inscrito"
                    options={[
                        { label: 'Sí', value: 1 },
                        { label: 'No', value: 0 }
                    ]}
                    setter={setSubscribed}
                    defaultValue={subscribed}
                    
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <SimpleSelector 
                    label="Sede Registral"
                    options={sedesRegistrales.map(sede => ({
                        label: sede.dessede,
                        value: parseInt(sede.idsedereg)
                    }))}
                    setter={setSedeRegistral}
                    defaultValue={sedeRegistral}
                />
                <SimpleInput 
                    label="Número de Partida"
                    value={nPartida}
                    setValue={setNPartida}
                    horizontal
                />
            </div>
            <div className="mt-6 flex flex-col gap-4">
                {/* <h3 className="text-sm">Contratantes Registrados</h3> */}
                {contratantes.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No hay contratantes registrados.</p>
                )}
                {contratantes.length > 0 && contratantes.map( contratante => (
                    <div
                        key={contratante.idcontratante}
                        className="grid grid-cols-3 gap-4 items-center hover:bg-gray-100 p-2 rounded-md transition-colors duration-200"
                    >
                        <p className="text-xs col-span-2">{getTitleCase(contratante.cliente)}</p>
                        <button className="text-xs bg-blue-600 text-white w-[60%] py-1 rounded-2xl cursor-pointer hover:bg-blue-700">Seleccionar</button>
                    </div>
                ))}
            </div>
        </form>
  )
}

export default RepresentantesForm