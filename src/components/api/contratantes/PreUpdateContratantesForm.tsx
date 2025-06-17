import { useState } from 'react'
import { Contratante } from '../../../services/api/contratantesService'
import ContratantesForm from './ContratantesForm'

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    contratante: Contratante
}

const PreUpdateContratantesForm = ({ idtipkar, idtipoacto, kardex, contratante }: Props) => {

    const [showContratanteForm, setShowContratanteForm] = useState(true)
    const [showClienteForm, setShowClienteForm] = useState(false)

  return (
    <>
        {showContratanteForm && 
            <ContratantesForm 
                cliente1={null}
                setShowContratanteForm={setShowContratanteForm}
                setShowClienteForm={setShowClienteForm}
                setClientesCheck={() => {}}
                idtipoacto={idtipoacto}
                idtipkar={idtipkar}
                kardex={kardex}
                contratante={contratante}
            />}
        {showClienteForm &&
        <div>
            <p>Cliente updated</p>    
            <button 
                onClick={() => {
                    setShowContratanteForm(true)
                    setShowClienteForm(false)
                }}
                className="text-blue-500 hover:text-blue-400 cursor-pointer"
            >
                Click</button>
        </div>}
    </>
  )
}

export default PreUpdateContratantesForm