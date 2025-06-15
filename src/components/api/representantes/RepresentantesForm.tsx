import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import TopModal from "../../ui/TopModal"
import SimpleSelector from "../../ui/SimpleSelector"

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RepresentantesForm = ({ open, setOpen }: Props) => {

    const [facultades, setFacultades] = useState('')
    const [subscribed, setSubscribed] = useState(1)
    const [sedeRegistral, setSedeRegistral] = useState(1)
    const [nPartida, setNPartida] = useState('')

  return (
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <form className="flex flex-col gap-4 p-4">
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
                    options={[
                        { label: 'Lima', value: 1 },
                        { label: 'Arequipa', value: 2 },
                        { label: 'Trujillo', value: 3},
                        { label: 'Cusco', value: 4 },
                        { label: 'Otro', value: 5 }
                    ]}
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
            <p>Contratantes ....</p>
        </form>

    </TopModal>
  )
}

export default RepresentantesForm