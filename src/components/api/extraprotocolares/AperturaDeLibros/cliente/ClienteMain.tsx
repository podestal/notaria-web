
import ClienteForm from "./ClienteForm"
import PreClienteForm from "./PreClienteForm"

interface Props {
    selectedTipoPersona: number
    setSelectedTipoPersona: React.Dispatch<React.SetStateAction<number>>
    document: string
    setDocument: React.Dispatch<React.SetStateAction<string>>
    setApellidoPaterno: React.Dispatch<React.SetStateAction<string>>
    setApellidoMaterno: React.Dispatch<React.SetStateAction<string>>
    setPrimerNombre: React.Dispatch<React.SetStateAction<string>>
    setSegundoNombre: React.Dispatch<React.SetStateAction<string>>
    setDireccion: React.Dispatch<React.SetStateAction<string>>
    apellidoPaterno: string
    apellidoMaterno: string
    primerNombre: string
    segundoNombre: string
    direccion: string
}

const ClienteMain = ({ 
    selectedTipoPersona, 
    setSelectedTipoPersona, 
    document, 
    setDocument, 
    setApellidoPaterno, 
    setApellidoMaterno, 
    setPrimerNombre, 
    setSegundoNombre, 
    setDireccion, 
    apellidoPaterno, 
    apellidoMaterno, 
    primerNombre, 
    segundoNombre, 
    direccion }: Props) => {

  return (
    <>
        <PreClienteForm 
            selectedTipoPersona={selectedTipoPersona}
            setSelectedTipoPersona={setSelectedTipoPersona}
            document={document}
            setDocument={setDocument}
            setApellidoPaterno={setApellidoPaterno}
            setApellidoMaterno={setApellidoMaterno}
            setPrimerNombre={setPrimerNombre}
            setSegundoNombre={setSegundoNombre}
            setDireccion={setDireccion}
        />
        <ClienteForm 
            tipoPersona={selectedTipoPersona}
            apellidoPaterno={apellidoPaterno}
            apellidoMaterno={apellidoMaterno}
            primerNombre={primerNombre}
            segundoNombre={segundoNombre}
            direccion={direccion}
            setApellidoPaterno={setApellidoPaterno}
            setApellidoMaterno={setApellidoMaterno}
            setPrimerNombre={setPrimerNombre}
            setSegundoNombre={setSegundoNombre}
            setDireccion={setDireccion}
        />
    </>
  )
}

export default ClienteMain