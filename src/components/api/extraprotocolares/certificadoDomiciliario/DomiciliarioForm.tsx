import { useState } from "react";
import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService";
import { Save } from "lucide-react";
import AbrirDocumento from "../documentos/AbrirDocumento";
import GenerarDocumento from "../documentos/GenerarDocumento";
import SimpleInput from "../../../ui/SimpleInput";
import Calendar from "../../../ui/Calendar";
import moment from "moment";

interface Props {
    domiciliario?: Domiciliario;
}

const DomiciliarioForm = ({ domiciliario }: Props) => {

    const [loading, setLoading] = useState(false);

    const [numCertificado, setNumCertificado] = useState(domiciliario?.num_certificado || '');
    const [numFormulario, setNumFormulario] = useState(domiciliario?.num_formu || '');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        domiciliario?.fec_ingreso
        ? moment.utc(domiciliario.fec_ingreso, "YYYY-MM-DD").hour(12).toDate()
        : (new Date())
    );

    const handleSave = () => {
        console.log('handleSave');
    }

  return (
    <div>
        <h2 className="text-lg font-semibold text-center mb-8">Formulario Cartas Notariales</h2>
        {/* <>{console.log('permisoViaje', permisoViaje)}</> */}
        <div className="grid grid-cols-8 gap-2">
            <button 
                onClick={handleSave}
                className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                {!loading && <Save className="text-xl"/>}
                <p className="text-xs">{loading ? 'Guardando...' : 'Guardar'}</p>
            </button>
            {domiciliario && 
            <GenerarDocumento 
                name={`__CDOM__${domiciliario.num_certificado.slice(-6)}-${domiciliario.num_certificado.slice(0, 4)}.docx`}
                url='cert-domiciliario'
                params={{
                    id_domiciliario: domiciliario.id_domiciliario.toString()
                }}
            />}
            {domiciliario && 
            <AbrirDocumento 
                name={`__CDOM__${domiciliario.num_certificado.slice(-6)}-${domiciliario.num_certificado.slice(0, 4)}.docx`}
                url='cert-domiciliario'
                params={{
                    id_domiciliario: domiciliario.id_domiciliario.toString(),
                    action: 'retrieve'
                }}
            />}
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput
                label="Num Certificado"
                value={numCertificado}
                setValue={setNumCertificado}
                horizontal
                disabled
            />
            <SimpleInput
                label="Num Formulario"
                value={numFormulario}
                setValue={setNumFormulario}
                horizontal
                disabled
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha de ingreso</p>
                <Calendar
                    selectedDate={fechaIngreso}
                    setSelectedDate={setFechaIngreso}   
                />
            </div>
        </div>
    </div>
  )
}

export default DomiciliarioForm