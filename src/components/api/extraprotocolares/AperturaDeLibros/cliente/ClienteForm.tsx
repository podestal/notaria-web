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
}

const ClienteForm = ({ tipoPersona, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, direccion, setApellidoPaterno, setApellidoMaterno, setPrimerNombre, setSegundoNombre, setDireccion }: Props) => {
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
        <>
        </>
    )}
    </>
  )
}

export default ClienteForm