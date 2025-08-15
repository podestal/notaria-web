import { useState } from "react";
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo";
import { Libro } from "../../../../services/api/extraprotocolares/librosService";
import moment from "moment";
import SimpleInput from "../../../ui/SimpleInput";
import Calendar from "../../../ui/Calendar";
import SimpleSelector from "../../../ui/SimpleSelector";
import { NUMERO_LIBROS } from "../../../../data/librosData";
import { QrCode, Save } from "lucide-react";
import GenerarDocumento from "../documentos/GenerarDocumento";
import AbrirDocumento from "../documentos/AbrirDocumento";
import ClienteMain from "./cliente/ClienteMain";

interface Props {
    libro?: Libro
}

const LibroForm = ({ libro }: Props) => {

    const [loading, setLoading] = useState(false);
    const [selectedTipoPersona, setSelectedTipoPersona] = useState(0);
    const [document, setDocument] = useState('');
    const user = useUserInfoStore(state => state.user);
    const [cronologico, setCronologico] = useState<string>(libro?.numlibro ? `${libro.numlibro}-${libro.ano}` : '');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        libro?.fecing
        ? moment.utc(libro.fecing, "YYYY-MM-DD").hour(12).toDate()
        : (new Date())
    );
    const [numeroLibro, setNumeroLibro] = useState(libro?.idnlibro || 0);
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [domicilioFiscal, setDomicilioFiscal] = useState('');

    const handleSave = () => {
        console.log('handleSave');
    }

  return (
    <div>
        <h2 className="text-lg font-semibold text-center mb-8">Formulario Apertura de Libros</h2>
        <div className="grid grid-cols-8 gap-2">
            <button 
                onClick={handleSave}
                className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                {!loading && <Save className="text-xl"/>}
                <p className="text-xs">{loading ? 'Guardando...' : 'Guardar'}</p>
            </button>
            {libro && 
            <GenerarDocumento 
                name={`__LIBRO__${libro.numlibro}-${libro.ano}.docx`}
                url='libro'
                params={{
                    id_libro: libro.id.toString()
                }}
            />}
            {libro && 
            <AbrirDocumento 
                name={`__LIBRO__${libro.numlibro}-${libro.ano}.docx`}
                url='libro'
                params={{
                    id_libro: libro.id.toString(),
                    action: 'retrieve'
                }}
            />}
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <QrCode className="text-xl text-slate-950"/>
                <p className="text-xs">Generar QR</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="N Cronológico"
                value={cronologico}
                setValue={setCronologico}
                horizontal
                disabled
            />
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha de ingreso</p>
                <Calendar
                    selectedDate={fechaIngreso}
                    setSelectedDate={setFechaIngreso}   
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelector
                label="N Libro"
                defaultValue={numeroLibro}
                setter={setNumeroLibro}
                options={[
                    { value: 0, label: 'Seleccione un libro' },
                    ...NUMERO_LIBROS.map(libro => ({ value: libro.idnlibro, label: libro.desnlibro }))
                ]}
            />
        </div>
        <p className="w-full border-b-1 border-slate-300 my-4 pb-2 text-md font-semibold text-center">Busqueda de Cliente</p>
        <ClienteMain 
            selectedTipoPersona={selectedTipoPersona}
            setSelectedTipoPersona={setSelectedTipoPersona}
            document={document}
            setDocument={setDocument}
            setApellidoPaterno={setApellidoPaterno}
            setApellidoMaterno={setApellidoMaterno}
            setPrimerNombre={setPrimerNombre}
            setSegundoNombre={setSegundoNombre}
            setDireccion={setDireccion}
            apellidoPaterno={apellidoPaterno}
            apellidoMaterno={apellidoMaterno}
            primerNombre={primerNombre}
            segundoNombre={segundoNombre}
            direccion={direccion}
            razonSocial={razonSocial}
            domicilioFiscal={domicilioFiscal}
            setRazonSocial={setRazonSocial}
            setDomicilioFiscal={setDomicilioFiscal}
        />
    </div>
  )
}

export default LibroForm