import { Loader, RefreshCcw } from 'lucide-react'
import moment from 'moment'
import ArchivoPdtKardexFiles from './ArchivoPdtKardexFiles'
import { useState } from 'react'

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    count: number
    errors: number
    refetch: any
    typeKardex: number
}

const ArchivosPdtKardexHeader = ({ dateFrom, dateTo, count, errors, refetch, typeKardex }: Props) => {
    console.log('kardex header pdt');
    console.log('dateFrom', dateFrom)
    console.log('dateTo', dateTo)
    
    const [isLoading, setIsLoading] = useState(false)

    const handleRefetch = () => {
        setIsLoading(true)
        refetch().finally(() => {
            setIsLoading(false)
        })
    }

  return (
    <div className="w-[85%] mx-auto">
        <h2 className="text-lg text-center font-semibold my-4 mx-6">Resumen de Operaciones PDT</h2>
        <div className="w-full text-sm grid grid-cols-5 gap-4 justify-center items-center text-center my-6 px-8 py-4 mx-6">
            <div className="flex flex-col justify-center items-start font-semibold gap-2">
                <h2>Mes</h2>
                <h2>Cantidad de Kardex</h2>
                <h2>Archivo Plano</h2>
            </div>
            <div className="col-span-4 flex flex-col justify-center items-start gap-2">
                <h2>{moment(dateFrom).format('DD/MM/YYYY')} - {moment(dateTo).format('DD/MM/YYYY')}</h2>
                <h2>{count}</h2>
                {/* <ArchivoPdtLibroDownload initialDate={dateFrom} finalDate={dateTo} /> */}
                <p>No disponible</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 justify-center items-center text-center">
            <ArchivoPdtKardexFiles 
                initialDate={dateFrom} 
                finalDate={dateTo} 
                typeKardex={typeKardex} 
            />
            <div className="flex justify-center items-center">
                <button 
                    onClick={handleRefetch}
                    className="bg-blue-600 text-white px-4 py-2 text-xs cursor-pointer rounded-md hover:bg-blue-700 transition-all duration-300 flex justify-center items-center gap-2">
                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                    <p>Actualizar Errores ({errors})</p>
                </button>
            </div>
        </div>
    </div>
  )
}

export default ArchivosPdtKardexHeader