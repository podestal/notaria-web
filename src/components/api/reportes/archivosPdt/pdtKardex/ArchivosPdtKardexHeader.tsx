import React from 'react'
import moment from 'moment'

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    count: number
}

const ArchivosPdtKardexHeader = ({ dateFrom, dateTo, count }: Props) => {
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
    </div>
  )
}

export default ArchivosPdtKardexHeader