import SimpleSelector from "../../ui/SimpleSelector"
import { MEDIOS_PAGO, BANCOS, MONEDAS } from "../../../data/patrimonialData"
import SimpleInput from "../../ui/SimpleInput"
import DateInput from "../../ui/DateInput"
import { CreateDetalleMedioDePagoData } from "../../../hooks/api/detalleMedioDePago/useCreateDetalleMedioDePago"
import { DetalleMedioDePago } from "../../../services/api/detalleMedioDePago"
import { UseMutationResult } from "@tanstack/react-query"
import useAuthStore from "../../../store/useAuthStore"
import { Patrimonial } from "../../../services/api/patrimonialService"
import { useState } from "react"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { TriangleAlert } from "lucide-react"

interface Props {
    patrimonial: Patrimonial
    createDetalleMedioDePago: UseMutationResult<DetalleMedioDePago, Error, CreateDetalleMedioDePagoData>
}

const DetalleMediosDePagoForm = ({ patrimonial, createDetalleMedioDePago }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } = useNotificationsStore()

    const [medioPago, setMedioPago] = useState(0)
    const [importe, setImporte] = useState("")
    const [banco, setBanco] = useState(0)
    const [moneda, setMoneda] = useState(0)
    const [documentos, setDocumentos] = useState("")
    const [fechaOperacion, setFechaOperacion] = useState("")
    const notExceedImport = patrimonial.importetrans - patrimonial.medios_pago_sum

    // ERRORS
    const [importeError, setImporteError] = useState('')

    const handleSubmit = () => {

        if (!importe) {
            setImporteError("El importe es requerido")
            return
        }

        if (parseInt(importe) > notExceedImport) {
            setImporteError(`El importe no puede exceder los ${MONEDAS.find(moneda => patrimonial.idmon === moneda.idmon)?.simbolo || ''} ${notExceedImport}`)
            return
        }

        createDetalleMedioDePago.mutate({
            access,// Replace with actual access token
            detalleMedioDePago: {
                itemmp: patrimonial.itemmp, // Replace with actual itemmp
                kardex: patrimonial.kardex, // Replace with actual kardex
                tipacto: patrimonial.idtipoacto, // Replace with actual tipacto
                codmepag: medioPago, // Replace with actual codmepag
                fpago: patrimonial.fpago, // Replace with actual fpago
                idbancos: banco, // Replace with actual idbancos
                importemp: importe, // Replace with actual importemp
                idmon: moneda.toString(), // Replace with actual idmon
                foperacion: fechaOperacion, // Replace with actual foperacion
                documentos: documentos // Replace with actual documentos
            }
        }, {
            onSuccess: (data) => {
                setMessage("Medio de pago creado exitosamente")
                setShow(true)
                setType("success")
                console.log("Detalle Medio de Pago created successfully:", data);
                // Reset form fields
                setMedioPago(0)
                setImporte("")
                setBanco(0)
                setMoneda(0)
                setDocumentos("")
                setFechaOperacion("")
            },
            onError: (error) => {
                setMessage("Error al crear medio de pago")
                setShow(true)
                setType("error")
                console.error("Error creating Detalle Medio de Pago:", error);
            }
        })
    }

  return (
    <div className=" w-[80%] mx-auto flex flex-col justify-center items-center gap-2">
        <h2 className="text-center font-bold text-lg mb-8">Nuevo Medio de Pago/Tipo de fondo</h2>
       <div className="flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-md mb-4">
        <TriangleAlert />
        <p>Recuerde que su importe no puede exceder los {MONEDAS.find(moneda => patrimonial.idmon === moneda.idmon)?.simbolo || ''} {patrimonial.importetrans - patrimonial.medios_pago_sum}</p>
       </div>
        <div className="grid grid-cols-2 gap-8 my-4">
            <SimpleSelector 
                defaultValue={medioPago}
                label="Medio de Pago"
                options={[{ value: 0, label:'Seleccione Medio de pago' }, ...MEDIOS_PAGO.map(medioPago => ({
                    value: medioPago.codmepag,
                    label: medioPago.desmpagos
                }))]}
                horizontal
                setter={setMedioPago}
            />
            <SimpleInput 
                setValue={setImporte}
                value={importe}
                horizontal
                label="Importe M. Pago/T. fondo"
                error={importeError}
                setError={setImporteError}
            />
        </div>
        <div className="grid grid-cols-2 gap-8 my-4">
            <SimpleSelector 
                defaultValue={banco}
                label="Entidad Financiera"
                options={[{ value: 0, label:'Seleccione Banco' }, ...BANCOS.map(banco => ({
                    value: banco.idbancos,
                    label: banco.desbanco
                }))]}
                horizontal
                setter={setBanco}
            />
            <DateInput 
                value={fechaOperacion}
                setValue={setFechaOperacion}
                horizontal
                label="Fecha de operación"
            />
        </div>
        <div className="grid grid-cols-2 gap-8 my-4">
            <SimpleSelector 
                defaultValue={moneda}
                label="Tipo de Moneda"
                options={[{ value: 0, label:'Seleccione Moneda' }, ...MONEDAS.map(moneda => ({
                    value: moneda.idmon,
                    label: moneda.desmon
                }))]}
                horizontal
                setter={setMoneda}
            />
            <SimpleInput 
                setValue={setDocumentos}
                value={documentos}
                horizontal
                label="Documentos"
                
            />
        </div>
        <div className="flex items-center justify-center gap-4 my-8">
            <button
                onClick={handleSubmit}
                type="button"
                className=" bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
                Guardar
            </button>
        </div>
    </div>
  )
}

export default DetalleMediosDePagoForm