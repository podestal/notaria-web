import SimpleInput from "../../../../ui/SimpleInput"

interface Props {
    tipoPersona: number
    apellidoPaterno: string
    apellidoMaterno: string
    primerNombre: string
    segundoNombre: string
    direccion: string
    setApellidoPaterno: React.Dispatch<React.SetStateAction<string>>
    setApellidoMaterno: React.Dispatch<React.SetStateAction<string>>
    setPrimerNombre: React.Dispatch<React.SetStateAction<string>>
    setSegundoNombre: React.Dispatch<React.SetStateAction<string>>
    setDireccion: React.Dispatch<React.SetStateAction<string>>
    razonSocial: string
    domicilioFiscal: string
    setRazonSocial: React.Dispatch<React.SetStateAction<string>>
    setDomicilioFiscal: React.Dispatch<React.SetStateAction<string>>
}

const ClienteForm = ({ tipoPersona, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, direccion, setApellidoPaterno, setApellidoMaterno, setPrimerNombre, setSegundoNombre, setDireccion, razonSocial, domicilioFiscal, setRazonSocial, setDomicilioFiscal }: Props) => {
  return (
    <>
    {tipoPersona === 1 && (
        <div>
            <div className="grid grid-cols-2 gap-4 my-4">
                <SimpleInput 
                    label="Apellido Paterno"
                    value={apellidoPaterno}
                    setValue={setApellidoPaterno}
                    horizontal
                />
                <SimpleInput 
                    label="Apellido Materno"
                    value={apellidoMaterno}
                    setValue={setApellidoMaterno}
                    horizontal
                />
            </div>
            <div className="grid grid-cols-2 gap-4 my-4">
                <SimpleInput 
                    label="Primer Nombre"
                    value={primerNombre}
                    setValue={setPrimerNombre}
                    horizontal
                />
                <SimpleInput 
                    label="Segundo Nombre"
                    value={segundoNombre}
                    setValue={setSegundoNombre}
                    horizontal
                />
            </div>
            <SimpleInput 
                label="Dirección"
                value={direccion}
                setValue={setDireccion}
                horizontal
                fullWidth
            />
        </div>
    )}
    {tipoPersona === 2 && (
        <div className="flex flex-col gap-4 my-4">
            <SimpleInput 
                label="Razón Social"
                value={razonSocial}
                setValue={setRazonSocial}
                horizontal
                fullWidth
            />
            <SimpleInput 
                label="Domicilio Fiscal"
                value={domicilioFiscal}
                setValue={setDomicilioFiscal}
                horizontal
                fullWidth
            />
        </div>
    )}
    </>
  )
}

export default ClienteForm