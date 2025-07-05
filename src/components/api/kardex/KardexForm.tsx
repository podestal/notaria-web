import { FileText } from "lucide-react"
import useKardexTypesStore from "../../../hooks/store/useKardexTypesStore"
import Selector from "../../ui/Selector"
import getTitleCase from "../../../utils/getTitleCase"
import { useState } from "react"
import Calendar from "../../ui/Calendar"
import TimePicker from "../../ui/TimePicker"
import useGetTipoActo from "../../../hooks/api/tipoActo/useGetTipoActo"
import SearchableDropdownInput from "../../ui/SearchableDropdownInput"
import useGetUsuarios from "../../../hooks/api/usuarios/useGetUsuarios"
import useGetAbogados from "../../../hooks/api/abogados/useGetAbogados"
import { CreateKardexData } from "../../../hooks/api/kardex/useCreateKardex"
import { Kardex, KardexPage } from "../../../services/api/kardexService"
import { UseMutationResult } from "@tanstack/react-query"
import moment from "moment"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import KardexFormTabs from "./KardexFormTabs"
import ContratantesMain from "../contratantes/ContratantesMain"
import PatrimonialMain from "../uif_pdt_patrimonial/PatrimonialMain"
import MultiSelect from "../../ui/MultiSelect"
import { AnimatePresence, motion } from "framer-motion"
import KardexActosSelector from "./KardexActosSelector"
import getTipoActoIdArray from "../../../utils/getTipoActoIdArray"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import { UpdateKardexData } from "../../../hooks/api/kardex/useUpdateKardex"
import TopModal from "../../ui/TopModal"
import ExplanationMessage from "../../ui/ExplanationMessage"
import ParticipaMain from "../uif_pdt_participa/ParticipaMain"
import useAuthStore from "../../../store/useAuthStore"
import useGetTemplatesByActos from "../../../hooks/api/templates/useGetTemplatesByActos"
import DigitacionMain from "../digitacion/DigitacionMain"
import EscrituracionMain from "../escrituracion/EscrituracionMain"

interface Props {
    setNotAllowed?: React.Dispatch<React.SetStateAction<boolean>>
    kardex?: Kardex | null
    setKardex?: React.Dispatch<React.SetStateAction<Kardex | null>>
    createKardex?: UseMutationResult<KardexPage, Error, CreateKardexData>
    updateKardex?: UseMutationResult<Kardex, Error, UpdateKardexData>
}

const KardexForm = ({ 
    setNotAllowed, 
    createKardex, 
    updateKardex, 
    kardex, 
    setKardex 
}: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [open, setOpen] = useState(false)
    const [cannotUpdateKardex, setCannotUpdateKardex] = useState(false)
    const [cannotUpdateKardexMessage, setCannotUpdateKardexMessage] = useState('')

    const { setMessage, setShow, setType } = useNotificationsStore()
    const bodyRender = useBodyRenderStore(s => s.bodyRender)
    const kardexTypes = useKardexTypesStore(s => s.kardexTypes)
    const [karedexReference, setKardexReference] = useState(kardex?.kardex || '') 
    const [selectedKardexType, setSelectedKardexType] = useState(kardex?.idtipkar || bodyRender) 
    const kardexDateArray = kardex ? kardex?.fechaescritura?.split('-') : ''
    const kardexDate = kardexDateArray && `${kardexDateArray[1]}-${kardexDateArray[2]}-${kardexDateArray[0]}`
    const [date, setDate] = useState<Date | undefined>(kardex ? new Date(kardexDate) || new Date() : undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(new Date().toTimeString().slice(0, 5)) // Default to current time in "HH:mm" format

    // const [contrato, setContrato] = useState<{ id: string; label: string } | null>(kardex ? {id: '', label: kardex.contrato} : null);
    const [contratos, setContratos] = useState<string[]>(kardex ? getTipoActoIdArray(kardex.codactos) : [])
    const [contratosDes, setContratosDes] = useState<string[]>(kardex ? kardex.contrato?.split(' / ') : [])
    const [responsible, setResponsible] = useState<{ id: string; label: string } | null>({ id: '1', label: 'ADMINISTRADOR' }) 
    const [selectedTemplate, setSelectedTemplate] = useState(kardex ? kardex.fktemplate : 0)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (contratos.length === 0) {
            setMessage('No se ha seleccionado un contrato')
            setShow(true)
            setType('error')
            return
            
        }

        if (responsible === null) {
            setMessage('No se ha seleccionado un responsable')
            setShow(true)
            setType('error')
            return
        }

        const formattedContratoDes = contratosDes.map(des => des.trim()).join(' / ')

        createKardex && createKardex.mutate({
            kardex: {
                kardex: '',
                idtipkar: selectedKardexType,
                fechaingreso: moment(date).format('DD/MM/YYYY'),
                referencia: karedexReference || 'This is a test reference',
                codactos: contratos.join(''),
                idusuario: Number(responsible.id),
                responsable: Number(responsible.id),
                retenido: 0,
                desistido: 0,
                autorizado: 0,
                idrecogio: 0,
                pagado: 0,
                visita: 0,
                idnotario: 1,
                contrato: `${formattedContratoDes} / `, 
                numescritura: '', 
                fktemplate: selectedTemplate
            }
        }, {
            onSuccess: (res) => {
                setMessage('Kardex creado exitosamente')
                setShow(true)
                setType('success')
                setNotAllowed && setNotAllowed(false)
                const newKardex = res as unknown as Kardex
                setKardex && setKardex(newKardex)
                
                // setKardex && setKardex(res.)
            }, 
            onError: (error) => {
                setMessage(`Error al crear el kardex: ${error.message}`)
                setShow(true)
                setType('error')
            }
        })

        console.log('contratos before updating', contratos)

        if (kardex && updateKardex) {
            updateKardex.mutate({
                kardex: {
                    // idkardex: kardex?.idkardex || 0,
                    kardex: karedexReference,
                    idtipkar: selectedKardexType,
                    fechaingreso:kardex.fechaingreso,
                    referencia: karedexReference || 'This is a test reference',
                    codactos: contratos.join(''),
                    idusuario: Number(responsible.id),
                    responsable: Number(responsible.id),
                    retenido: 0,
                    desistido: 0,
                    autorizado: 0,
                    idrecogio: 0,
                    pagado: 0,
                    visita: 0,
                    idnotario: 1,
                    contrato: `${formattedContratoDes} / `, 
                    numescritura: '',
                    fktemplate: selectedTemplate
                },
                access: 'access_token'
            }, {
                onSuccess: (res) => {
                    console.log('res', res)
                    setMessage('Kardex actualizado exitosamente')
                    setShow(true)
                    setType('success')
                }, 
                onError: (error) => {
                    let errorMessage = ''
                    if ((error as any)?.response?.data?.error ) {
                        setCannotUpdateKardex(true)
                        setCannotUpdateKardexMessage((error as any)?.response?.data?.error)
                    } else {
                        setMessage(`Error al actualizar el kardex: ${errorMessage}`)
                        setShow(true)
                        setType('error')
                    }
                }
            })
        }

    }

    const { data: tipoActos, isLoading, isError, error, isSuccess } = useGetTipoActo({ access })
    const { data: usuarios, isLoading: isLoadingUsuarios, isError: isErrorUsuarios, error: errorUsuarios, isSuccess: isSuccessUsuarios } = useGetUsuarios({ access })
    const { data: abogados, isLoading: isLoadingAbogados, isError: isErrorAbogados, error: errorAbogados, isSuccess: isSuccessAbogados } = useGetAbogados({ access })
    const { data: templates, isSuccess: isSuccessTemplates } = useGetTemplatesByActos({ access, codactos: contratos.join('') })

    if (isLoading || isLoadingUsuarios || isLoadingAbogados) return <p className="text-sm animate-pulse text-center my-10">Cargando ....</p>
    if (isError) return <p className="text-center my-8">Error: {error.message}</p>
    if (isErrorUsuarios) return <p className="text-center my-8">Error: {errorUsuarios.message}</p>
    if (isErrorAbogados) return <p className="text-center my-8">Error: {errorAbogados.message}</p>
    // if (isErrorTemplates) return <p className="text-center my-8">Error: {errorTemplates.message}</p>
    if (isSuccess && isSuccessUsuarios && isSuccessAbogados )

  return (
    <>
    <form 
        onSubmit={handleSubmit}
        className="bg-slate-700 rounded-b-lg shadow-lg w-full ">
        {/* <>{console.log('contratosDes', contratosDes)}</> */}
        <>{console.log('templates', templates)}</>
        <div className="flex justify-center items-center gap-2 p-4 rounded-t-lg text-slate-50 ">
            <FileText className="text-green-600"/>
            <h2 className="text-xl text-amber-500">{kardex ? 'Editar' : 'Nuevo'} Kardex</h2>
        </div>
        {/* <>{console.log('contrato', kardex?.contrato)}</> */}
        <div className="bg-slate-50 text-black p-4 rounded-b-lg">
            <div className="flex justify-between items-center gap-4 mb-6">
                <Selector 
                    options={[{ value: 0, label: 'Tipo de Kardex' },...kardexTypes.map(type => ({ value: type.idtipkar, label: getTitleCase(type.nomtipkar) }))]}
                    setter={setSelectedKardexType}
                    defaultValue={selectedKardexType}
                />
                <Calendar 
                    selectedDate={date}
                    setSelectedDate={setDate}
                />
                <div className="relative w-56">
                    <TimePicker 
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center gap-4 mb-6">
                <input 
                    value={karedexReference}
                    onChange={(e) => setKardexReference(e.target.value)}
                    placeholder="Referencia del Kardex"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
                <button 
                    type={kardex ? 'button' : 'submit'}
                    disabled={!!kardex}
                    className={`bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300   rounded-md ${kardex ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-300'}`}>Generar Kardex</button>
            </div>
            <div className="flex justify-between items-center gap-4">
                <input 
                    // value={contrato ? contrato.id : `${kardex ? tipoActos.find(acto => acto.desacto === kardex.contrato)?.idtipoacto : '00'}`}
                    // value={kardex ? tipoActos.find(acto => acto.desacto === kardex.contrato.split('/')[0].trim())?.idtipoacto || '00' : `${contrato ? contrato.id : ''}`}
                    value={contratos.join('')}
                    onChange={() => {}}
                    disabled
                    placeholder="Código de Acto"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
                <input 
                    placeholder="Derecho Notarial"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
                <input 
                    placeholder="Derecho Registral"
                    className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                />
            </div>
            {/* <SearchableDropdownInput
                options={tipoActos
                    .filter(acto => acto.idtipkar === selectedKardexType)
                    .map(acto => ({ id: acto.idtipoacto, label: `${acto.desacto} /` }))}
                selected={contrato}
                // defaultValue={kardex && tipoActos.find(tipoActo => tipoActo.desacto === kardex.contrato) || null}
                setSelected={setContrato}
                placeholder="Buscar contrato..."
            /> */}
            <div className="grid grid-cols-9 items-start my-4">
            <div className="col-span-8">
            <KardexActosSelector 
                tipoActos={tipoActos.filter(acto => acto.idtipkar === selectedKardexType)}
                contratos={contratos}
                setContratosDes={setContratosDes}
            />
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-4">
                <button 
                    type="button"
                    onClick={() => setOpen(true)}
                    className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                    <span className="font-bold text-green-600 text-md">+</span>
                    <span>Mostrar Actos</span>
                </button>
                <button 
                    type="button"
                    onClick={() => setOpen(false)}
                    className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md flex flex-col gap-1">
                    <span className="font-bold text-red-600 text-md">-</span>
                    <span>Ocultar Actos</span>
                </button>
            </div>
            </div>
            <AnimatePresence>
            {open && 
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                // className="w-full my-4"
            
            >
                <MultiSelect 
                    options={tipoActos
                        .filter(acto => acto.idtipkar === selectedKardexType)
                        .map(acto => ({ id: acto.idtipoacto, label: `${acto.desacto} /` }))}
                    placeholder="Buscar contrato..."
                    label=""
                    selectedIds={contratos}
                    setSelectedIds={setContratos}
                />
            </motion.div>}
            </AnimatePresence>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-center items-center gap-4">
                    <p className="text-md font-bold py-2">Responsable</p>
                    <SearchableDropdownInput 
                        options={usuarios.map(user => ({ id: String(user.idusuario), label: getTitleCase(user.loginusuario) }))}
                        selected={responsible}
                        setSelected={setResponsible}
                        placeholder="Buscar responsable..."
                    />
                </div>
                <div className="flex justify-center items-center gap-4">
                    <Selector 
                        options={[{ value: 0, label: 'Seleccionar Usuario' }, ...usuarios.map(user => ({ value: user.idusuario, label: getTitleCase(user.loginusuario) }))]}
                        setter={() => {}}
                        label="Recepción"
                        horizontal
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 place-content-center place-items-start gap-4 my-4">
                <Selector 
                    options={[{ value: 0, label: 'Seleccionar Abogado' }, ...abogados.map(abogado => ({ value: Number(abogado.idabogado), label: getTitleCase(abogado.razonsocial) }))]}
                    setter={() => {}}
                    label="Abogado"
                    horizontal
                />
                <div className="flex justify-center items-center gap-4">
                    <p>Funcionario</p>
                    <input 
                        className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 place-content-center place-items-start gap-4 my-4">
                <Selector 
                    options={[{ value: 0, label: 'Seleccionar Presentante' }]}
                    setter={() => {}}
                    label="Presentante"
                    horizontal
                />
                <SimpleSelector 
                    options={(isSuccessTemplates && templates.length > 0) ? [{ value: 0, label: 'Seleccione Plantilla' }, ...templates.map(template => ({ value: template.pktemplate, label: getTitleCase(template.nametemplate) }))] : [{ value: 0, label: 'No hay plantillas disponibles' }]}
                    setter={setSelectedTemplate}
                    defaultValue={selectedTemplate}
                    label="Plantilla"
                    horizontal
                />
            </div>
            {kardex && 
            <div className="w-full grid grid-cols-3 gap-3 items-center my-10">
                <SimpleInput 
                    value=""
                    setValue={() => {}}
                    label="Kardex Conexo"
                    horizontal
                />
                <SimpleSelector 
                    options={[{ value: 0, label: 'Seleccionar Notaría' }]}
                    defaultValue={0}
                    setter={() => {}}
                    horizontal
                />
                <div className="flex justify-center items-center gap-4">
                    <button
                        type="submit"
                        className=" bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        Grabar Cambios
                    </button>
                </div>
            </div>}
            
        </div>
    </form>
    <TopModal 
        isOpen={cannotUpdateKardex}
        onClose={() => {
            setCannotUpdateKardex(false)
            setCannotUpdateKardexMessage('')
        }}
    >
        <ExplanationMessage 
            onClick={() => {
                setCannotUpdateKardex(false)
                setCannotUpdateKardexMessage('')
            }}
            message={cannotUpdateKardexMessage}
        />
    </TopModal>
    {kardex && 
        <>
        <KardexFormTabs 
            tabs={[
                // { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
                { id: 'details', label: 'Contratantes', content: <ContratantesMain kardex={kardex}/> },
                { id: 'notes', label: 'Digitación', content: <DigitacionMain kardex={kardex} /> },
                { id: 'escrituración', label: 'Escrituración', content: <EscrituracionMain kardex={kardex} /> },
                { id: 'uif', label: 'UIF/PDT Patrimonial', content: <PatrimonialMain kardex={kardex}/> },
                { id: 'uifp', label: 'UIF/PDT Participa', content: <ParticipaMain kardex={kardex}/> },
            ]}
        />
        </>
    }
    </>
  )
}

export default KardexForm