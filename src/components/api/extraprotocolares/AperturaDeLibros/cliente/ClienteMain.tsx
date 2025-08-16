
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
    razonSocial: string
    domicilioFiscal: string
    setRazonSocial: React.Dispatch<React.SetStateAction<string>>
    setDomicilioFiscal: React.Dispatch<React.SetStateAction<string>>
    setCodeCliente: React.Dispatch<React.SetStateAction<string>>
    setDocumentError: React.Dispatch<React.SetStateAction<string>>
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
    direccion,
    razonSocial,
    domicilioFiscal,
    setRazonSocial,
    setDomicilioFiscal,
    setCodeCliente,
    setDocumentError,
 }: Props) => {

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
            setRazonSocial={setRazonSocial}
            setDomicilioFiscal={setDomicilioFiscal}
            setCodeCliente={setCodeCliente}
            setDocumentError={setDocumentError}
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
            razonSocial={razonSocial}
            domicilioFiscal={domicilioFiscal}
            setRazonSocial={setRazonSocial}
            setDomicilioFiscal={setDomicilioFiscal}
        />
    </>
  )
}

export default ClienteMain