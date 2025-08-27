import { useState } from "react";
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo";
import { Libro } from "../../../../services/api/extraprotocolares/librosService";
import moment from "moment";
import SimpleInput from "../../../ui/SimpleInput";
import Calendar from "../../../ui/Calendar";
import SimpleSelector from "../../../ui/SimpleSelector";
import { NUMERO_LIBROS, TIPOS_LEGAL, TIPOS_FOLIOS } from "../../../../data/librosData";
import { QrCode, Save } from "lucide-react";
import GenerarDocumento from "../documentos/GenerarDocumento";
import AbrirDocumento from "../documentos/AbrirDocumento";
import ClienteMain from "./cliente/ClienteMain";
import SearchableDropdownInput from "../../../ui/SearchableDropdownInput";
import { TipoLibro } from "../../../../services/api/extraprotocolares/tipoLibroService";
import SolicitanteLookup from "./cliente/SolicitanteLookup";
import SingleSelect from "../../../ui/SingleSelect";
import { UseMutationResult } from "@tanstack/react-query";
import { CreateLibroData } from "../../../../hooks/api/extraprotocolares/aperturaLibros/useCreateLibro";
import useAuthStore from "../../../../store/useAuthStore";
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore";
import useUpdateLibro, { UpdateLibroData } from "../../../../hooks/api/extraprotocolares/aperturaLibros/useUpdateLibro";


interface Props {
    libro?: Libro
    tipoLibros: TipoLibro[]
    createLibro?: UseMutationResult<Libro, Error, CreateLibroData>
    updateLibro?: UseMutationResult<Libro, Error, UpdateLibroData>
}

const LibroForm = ({ libro, tipoLibros, createLibro, updateLibro }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType} = useNotificationsStore()

    const [loading, setLoading] = useState(false);
    const [selectedTipoPersona, setSelectedTipoPersona] = useState(libro ? libro.tipper === 'N' ? 1 : 2 : 2);
    const [document, setDocument] = useState(libro ? libro.ruc : 'CODJU000000');
    const user = useUserInfoStore(state => state.user);
    const [cronologico, setCronologico] = useState<string>(libro?.numlibro ? `${libro.numlibro}-${libro.ano}` : '');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        libro?.fecing
        ? moment.utc(libro.fecing, "YYYY-MM-DD").hour(12).toDate()
        : (new Date())
    );
    const [numeroLibro, setNumeroLibro] = useState(libro?.idnlibro || 0);
    const [apellidoPaterno, setApellidoPaterno] = useState(libro ? libro.apepat : '');
    const [apellidoMaterno, setApellidoMaterno] = useState(libro ? libro.apemat : '');
    const [primerNombre, setPrimerNombre] = useState(libro ? libro.prinom : '');
    const [segundoNombre, setSegundoNombre] = useState(libro ? libro.segnom : '');
    const [direccion, setDireccion] = useState(libro ? libro.domicilio : '');
    const [ubigeo, setUbigeo] = useState(libro ? libro.coddis : '');
    const [razonSocial, setRazonSocial] = useState(libro ? libro.empresa : '');
    const [domicilioFiscal, setDomicilioFiscal] = useState(libro ? libro.domfiscal : '');
    const [codeCliente, setCodeCliente] = useState(libro ? libro.codclie : '');

    // Datos del Libro
    const [selectedTipoLibro, setSelectedTipoLibro] = useState<{id: string, label: string} | null>(libro?.idtiplib ? {id: libro.idtiplib.toString(), label: tipoLibros.find(tl => tl.idtiplib === libro.idtiplib)?.destiplib || ''} : null);
    const [selectedTipoLegal, setSelectedTipoLegal] = useState(libro?.idlegal || 1);
    const [numFojas, setNumFojas] = useState(libro?.folio || '');
    const [tipoFolio, setTipoFolio] = useState(libro?.idtipfol || 1);
    const [detalle, setDetalle] = useState(libro?.detalle || '');

    // Datos del Solicitante
    const [solicitanteName, setSolicitanteName] = useState(libro ? libro.solicitante : '');
    const [solicitanteDocument, setSolicitanteDocument] = useState(libro ? libro.dni : '');
    const [comentario, setComentario] = useState(libro ? libro.comentario : '');
    const [orientation, setOrientation] = useState('V');

    // Error handling
    const [numLibroError, setNumLibroError] = useState('');
    const [documentError, setDocumentError] = useState('');
    const [tipoLibroError, setTipoLibroError] = useState('');
    const [numFojasError, setNumFojasError] = useState('');
    const [solicitanteNameError, setSolicitanteNameError] = useState('');

    // docs
    const [showDocs, setShowDocs] = useState(libro ? true : false);
    const [numLibro, setNumLibro] = useState(libro?.numlibro || '');
    const [anoLibro, setAnoLibro] = useState(libro?.ano || '');
    const [idLibro, setIdLibro] = useState(libro?.id || 0);

    const [doneCreate, setDoneCreate] = useState(false);
    const updateLibroInternal = useUpdateLibro({ page: 1, libroId: idLibro })


    
    const handleSave = () => {

        if (!numeroLibro) {
            setNumLibroError('Seleccione un tipo de libro')
            setMessage('Seleccione un tipo de libro')
            setShow(true)
            setType('error')
            return
        }

        if (!selectedTipoLibro) {
            setTipoLibroError('Seleccione un tipo de libro')
            setMessage('Seleccione un tipo de libro')
            setShow(true)
            setType('error')
            return
        }

        if (!numFojas) {
            setNumFojasError('Ingrese el número de fojas')
            setMessage('Ingrese el número de fojas')
            setShow(true)
            setType('error')
            return
        }

        if (!solicitanteName) {
            setSolicitanteNameError('Ingrese el nombre del solicitante')
            setMessage('Ingrese el nombre del solicitante')
            setShow(true)
            setType('error')
            return
        }

        setLoading(true);

        createLibro && createLibro.mutate({
            access: access,
            libro: {
                numlibro: '0',
                ano: moment().format('YYYY'),
                fecing: moment(fechaIngreso).format('YYYY-MM-DD'),
                tipper: selectedTipoPersona === 1 ? 'N' : 'J',
                apepat: apellidoPaterno,
                apemat: apellidoMaterno,
                prinom: primerNombre,
                segnom: segundoNombre,
                ruc: selectedTipoPersona === 1 ? '' : document.startsWith('CODJU') ? '' : document,
                domicilio: direccion,
                coddis: ubigeo || '',
                empresa: razonSocial,
                domfiscal: domicilioFiscal,
                idtiplib: parseInt(selectedTipoLibro?.id || '0'),
                descritiplib: selectedTipoLibro?.label || '',
                idlegal: selectedTipoLegal,
                folio: numFojas,
                idtipfol: tipoFolio,
                detalle: detalle,
                idnotario: 1,
                solicitante: solicitanteName,
                comentario: comentario,
                feclegal: '',
                comentario2: '',
                dni: solicitanteDocument,
                idusuario: user?.idusuario || 0,
                idnlibro: numeroLibro,
                codclie: codeCliente,
                flag: 1,
                numdoc_plantilla: document.startsWith('CODJU') ? document : '',
                estadosisgen: 0,
            }
        }, {
            onSuccess: res  => {
                setMessage('Libro creado correctamente')
                setShow(true)
                setType('success')
                setShowDocs(true)
                setNumLibro(res.numlibro)
                setAnoLibro(res.ano)
                setIdLibro(res.id)
                setDoneCreate(true)
            },
            onError: () => {
                setMessage('Error al crear el libro')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        } )

        updateLibro && libro && updateLibro.mutate({
            access: access,
            libro: {
                numlibro: libro.numlibro,
                ano: libro.ano,
                fecing: moment(fechaIngreso).format('YYYY-MM-DD'),
                tipper: selectedTipoPersona === 1 ? 'N' : 'J',
                apepat: apellidoPaterno,
                apemat: apellidoMaterno,
                prinom: primerNombre,
                segnom: segundoNombre,
                ruc: selectedTipoPersona === 1 ? '' : document.startsWith('CODJU') ? '' : document,
                domicilio: direccion,
                coddis: ubigeo || '',
                empresa: razonSocial,
                domfiscal: domicilioFiscal,
                idtiplib: parseInt(selectedTipoLibro?.id || '0'),
                descritiplib: selectedTipoLibro?.label || '',
                idlegal: selectedTipoLegal,
                folio: numFojas,
                idtipfol: tipoFolio,
                detalle: detalle,
                idnotario: 1,
                solicitante: solicitanteName,
                comentario: comentario,
                feclegal: '',
                comentario2: '',
                dni: solicitanteDocument,
                idusuario: user?.idusuario || 0,
                idnlibro: numeroLibro,
                codclie: codeCliente,
                flag: 1,
                numdoc_plantilla: document.startsWith('CODJU') ? document : '',
                estadosisgen: 0,
            }
        }, {
            onSuccess: res => {
                setMessage('Libro actualizado correctamente')
                setShow(true)
                setType('success')
            },
            onError: () => {
                setMessage('Error al actualizar el libro')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setLoading(false)
            }
        })

        if (!libro && doneCreate) {
            updateLibroInternal.mutate({
                access: access,
                libro: {
                    numlibro: numLibro,
                    ano: anoLibro,
                    fecing: moment(fechaIngreso).format('YYYY-MM-DD'),
                    tipper: selectedTipoPersona === 1 ? 'N' : 'J',
                    apepat: apellidoPaterno,
                    apemat: apellidoMaterno,
                    prinom: primerNombre,
                    segnom: segundoNombre,
                    ruc: selectedTipoPersona === 1 ? '' : document.startsWith('CODJU') ? '' : document,
                    domicilio: direccion,
                    coddis: ubigeo || '',
                    empresa: razonSocial,
                    domfiscal: domicilioFiscal,
                    idtiplib: parseInt(selectedTipoLibro?.id || '0'),
                    descritiplib: selectedTipoLibro?.label || '',
                    idlegal: selectedTipoLegal,
                    folio: numFojas,
                    idtipfol: tipoFolio,
                    detalle: detalle,
                    idnotario: 1,
                    solicitante: solicitanteName,
                    comentario: comentario,
                    feclegal: '',
                    comentario2: '',
                    dni: solicitanteDocument,
                    idusuario: user?.idusuario || 0,
                    idnlibro: numeroLibro,
                    codclie: codeCliente,
                    flag: 1,
                    numdoc_plantilla: document.startsWith('CODJU') ? document : '',
                    estadosisgen: 0,
                }
            }, {
                onSuccess: () => {
                    setMessage('Libro actualizado correctamente')
                    setShow(true)
                    setType('success')
                },
                onError: () => {
                    setMessage('Error al actualizar el libro')
                    setShow(true)
                    setType('error')
                },
                onSettled: () => {
                    setLoading(false)
                }
            })
        }

        
    }

  return (
    <div>
        <h2 className="text-lg font-semibold text-center mb-8">Formulario Apertura de Libros</h2>
        <>{console.log('libro', libro)}</>
        <div className="grid grid-cols-8 gap-2">
            <button 
                onClick={handleSave}
                className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                {!loading && <Save className="text-xl"/>}
                <p className="text-xs">{loading ? 'Guardando...' : 'Guardar'}</p>
            </button>
            {showDocs && 
            <GenerarDocumento 
                name={`__LIBRO__${numLibro}-${anoLibro}.docx`}
                url='libro'
                params={{
                    id_libro: idLibro.toString(),
                    action: 'generate',
                    orientation: orientation,
                }}
            />}
            {showDocs && 
            <AbrirDocumento 
                name={`__LIBRO__${numLibro}-${anoLibro}.docx`}
                url='libro'
                params={{
                    id_libro: idLibro.toString(),
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
                error={numLibroError}
                setError={setNumLibroError}
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
            setCodeCliente={setCodeCliente}
            setDocumentError={setDocumentError}
            setUbigeo={setUbigeo}
        />
        <p className="w-full border-b-1 border-slate-300 my-4 pb-2 text-md font-semibold text-center">Datos del Libro</p>
        <div className="w-full flex justify-center items-center gap-4 col-span-2">
            <p className="pl-2 block text-xs font-semibold text-slate-700">Tipo de Libro</p>
            <SearchableDropdownInput
                options={tipoLibros.map(tl => ({ id: tl.idtiplib.toString(), label: tl.destiplib }))}
                selected={selectedTipoLibro}
                setSelected={setSelectedTipoLibro}
                placeholder="Tipo de Libro"
                error={tipoLibroError}
                setError={setTipoLibroError}
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelector
                label="Tipo de Legalización"
                defaultValue={selectedTipoLegal}
                setter={setSelectedTipoLegal}
                options={TIPOS_LEGAL.map(tl => ({ value: tl.idlegal, label: tl.deslegal }))}
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput
                label="N° de Fojas"
                value={numFojas}
                setValue={setNumFojas}
                horizontal
                error={numFojasError}
                setError={setNumFojasError}
            />
            <SimpleSelector
                label="Tipo de Folio"
                defaultValue={tipoFolio}
                setter={setTipoFolio}
                options={TIPOS_FOLIOS.map(tf => ({ value: tf.idtipfol, label: tf.destipfol }))}
            />
        </div>
        <SolicitanteLookup 
            solicitanteName={solicitanteName}
            setSolicitanteName={setSolicitanteName}
            solicitanteDocument={solicitanteDocument}
            setSolicitanteDocument={setSolicitanteDocument}
            comentario={comentario}
            setComentario={setComentario}
            solicitanteNameError={solicitanteNameError}
            setSolicitanteNameError={setSolicitanteNameError}
        />
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput
                label="Responsable"
                value={user ? `${user.first_name} ${user.last_name}` : ''}
                setValue={() => {}}
                horizontal
                disabled
            />
            <div>
                <SingleSelect 
                    options={[
                        { value: 'V', label: 'Vertical' },
                        { value: 'H', label: 'Horizontal' },
                    ]}
                    selected={orientation}
                    onChange={setOrientation}
                />
            </div>
        </div>
    </div>
  )
}

export default LibroForm