import { Pencil } from "lucide-react"
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
    codeCliente?: string
    onUpdateJuridica?: () => void
    updatingJuridica?: boolean
}

const ClienteForm = ({
    tipoPersona,
    apellidoPaterno,
    apellidoMaterno,
    primerNombre,
    segundoNombre,
    direccion,
    setApellidoPaterno,
    setApellidoMaterno,
    setPrimerNombre,
    setSegundoNombre,
    setDireccion,
    razonSocial,
    domicilioFiscal,
    codeCliente,
    onUpdateJuridica,
    updatingJuridica,
}: Props) => {
  return (
    <>
    {tipoPersona === 1 && (
        <div className="my-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        <div className="my-4 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <SimpleInput 
                label="Razón Social"
                value={razonSocial}
                setValue={() => {}}
                horizontal
                fullWidth
                disabled
            />
            <SimpleInput 
                label="Domicilio Fiscal"
                value={domicilioFiscal}
                setValue={() => {}}
                horizontal
                fullWidth
                disabled
            />
            {!!codeCliente && (
                <div className="flex justify-end pt-1">
                    <button
                        type="button"
                        onClick={onUpdateJuridica}
                        disabled={updatingJuridica}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-60"
                    >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        {updatingJuridica ? "Cargando..." : "Actualizar persona jurídica"}
                    </button>
                </div>
            )}
        </div>
    )}
    </>
  )
}

export default ClienteForm