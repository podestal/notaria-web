import { FileText } from "lucide-react"
import useKardexTypesStore from "../../../hooks/store/useKardexTypesStore"
import Selector from "../../ui/Selector"
import getTitleCase from "../../../utils/getTitleCase"
import { act, useState } from "react"
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

interface Props {
    setNotAllowed?: React.Dispatch<React.SetStateAction<boolean>>
    kardex?: Kardex | null
    setKardex?: React.Dispatch<React.SetStateAction<Kardex | null>>
    createKardex?: UseMutationResult<KardexPage, Error, CreateKardexData>
    
}

const KardexForm = ({ setNotAllowed, createKardex, kardex, setKardex }: Props) => {

    const [open, setOpen] = useState(false)

    const { setMessage, setShow, setType } = useNotificationsStore()
    const bodyRender = useBodyRenderStore(s => s.bodyRender)
    const kardexTypes = useKardexTypesStore(s => s.kardexTypes)
    const [karedexReference, setKardexReference] = useState(kardex?.kardex || '') 
    const [selectedKardexType, setSelectedKardexType] = useState(kardex?.idtipkar || bodyRender) 
    const kardexDateArray = kardex ? kardex?.fechaescritura?.split('-') : ''
    const kardexDate = kardexDateArray && `${kardexDateArray[1]}-${kardexDateArray[2]}-${kardexDateArray[0]}`
    const [date, setDate] = useState<Date | undefined>(kardex ? new Date(kardexDate) || new Date() : undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(new Date().toTimeString().slice(0, 5)) // Default to current time in "HH:mm" format

    const [contrato, setContrato] = useState<{ id: string; label: string } | null>(kardex ? {id: '', label: kardex.contrato} : null);
    const [contratos, setContratos] = useState<string[]>([])
    const [contratosDes, setContratosDes] = useState<string[]>([])
    const [responsible, setResponsible] = useState<{ id: string; label: string } | null>({ id: '1', label: 'ADMINISTRADOR' }) 
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
                numescritura: '' 
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
    }

    const { data: tipoActos, isLoading, isError, error, isSuccess } = useGetTipoActo()
    const { data: usuarios, isLoading: isLoadingUsuarios, isError: isErrorUsuarios, error: errorUsuarios, isSuccess: isSuccessUsuarios } = useGetUsuarios()
    const { data: abogados, isLoading: isLoadingAbogados, isError: isErrorAbogados, error: errorAbogados, isSuccess: isSuccessAbogados } = useGetAbogados()

    if (isLoading || isLoadingUsuarios || isLoadingAbogados) return <p className="text-sm animate-pulse text-center my-10">Cargando ....</p>
    if (isError) return <p className="text-center my-8">Error: {error.message}</p>
    if (isErrorUsuarios) return <p className="text-center my-8">Error: {errorUsuarios.message}</p>
    if (isErrorAbogados) return <p className="text-center my-8">Error: {errorAbogados.message}</p>
    if (isSuccess && isSuccessUsuarios && isSuccessAbogados) 

  return (
    <>
    <form 
        onSubmit={handleSubmit}
        className="bg-slate-700 rounded-b-lg shadow-lg w-full ">
        <>{console.log('contratosDes', contratosDes)}</>

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
                <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Generar Kardex</button>
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
                <Selector 
                    options={[{ value: 0, label: 'Seleccionar Plantilla' }]}
                    setter={() => {}}
                    label="Plantilla"
                    horizontal
                />
            </div>
        </div>
    </form>
    {kardex && 
        <KardexFormTabs 
            tabs={[
                // { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
                { id: 'details', label: 'Contratantes', content: <ContratantesMain kardex={kardex}/> },
                { id: 'notes', label: 'Digitación', content: <p>notes</p> },
                { id: 'escrituración', label: 'Escrituración', content: <p>notes</p> },
                { id: 'uif', label: 'UIF/PDT Patrimonial', content: <PatrimonialMain kardex={kardex}/> },
            ]}
        />
    }
    </>
  )
}

export default KardexForm