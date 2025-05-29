import { useState } from "react"
import Selector from "../../ui/Selector"
import axios from "axios"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

const ContratantesForm = () => {

    const { setType, setMessage, setShow } = useNotificationsStore()
    const [selectedTipoPersona, setSelectedTipoPersona] = useState(0)   
    const [document, setDocument] = useState('')
    const token = import.meta.env.VITE_FACTILIZA_TOKEN

    // FORM FIELDS
    const [showForm, setShowForm] = useState(false)
    // const [apepat, setApepat] = useState('')
    // const [apemat, setApemat] = useState('')
    // const [prinom, setPrinom] = useState('')
    // const [segnom, setSegnom] = useState('')
    const [direccion, setDireccion] = useState('')
    const [nombres, setNombres] = useState('')


    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault()


    // }

    const handleLookup = () => {

        if (selectedTipoPersona === 0) {
            setType('error')
            setMessage('Debe seleccionar un tipo de persona y proporcionar un documento válido.')
            setShow(true)
            return
        }

        if (selectedTipoPersona === 1 && document.length !== 8) {
            setType('error')
            setMessage('El DNI debe tener 8 dígitos.')
            setShow(true)
            return
        }
        
        if (selectedTipoPersona === 2 && document.length !== 11) {
            setType('error')
            setMessage('El RUC debe tener 11 dígitos.')
            setShow(true)
            return
        }

        axios.get(`https://api.factiliza.com/v1/dni/info/${document}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            console.log(response.data);
            setShowForm(true)
            setNombres(response.data.data.nombre_completo);
            setDireccion(response.data.data.direccion);
          })
          .catch(error => {
            console.error(error);
          });
    }

  return (
    <>
    {showForm
    ? 
    <div className="text-black">
        <h2 className="text-lg font-semibold mb-4">Datos del Contratante</h2>
        <p>{nombres}</p>
        <p>{direccion}</p>
    </div>
    : 
    <div>
        <Selector 
            label="Tipo de Persona"
            options={[
                { value: 0, label: 'Seleccione una opción' },
                { value: 1, label: 'Persona Natural' },
                { value: 2, label: 'Persona Jurídica' }
            ]}
            setter={setSelectedTipoPersona}
        />
        {selectedTipoPersona > 0 && 
        <>
        <input 
            type="text"
            value={document}
            onChange={e => setDocument(e.target.value)}
            placeholder={`${selectedTipoPersona === 1 ? 'DNI' : 'RUC'}`}
            className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
        />
        <button 
            onClick={handleLookup}
            className="hover:cursor-pointer w-full bg-blue-600 text-white rounded-md py-2 mt-4 hover:bg-blue-500 transition-colors duration-300" type="submit">
            Buscar
        </button>
        </>
        }
    </div>}
    {/* <form
        onSubmit={handleSubmit}
    >
        

    </form> */}
    </>
  )
}

export default ContratantesForm