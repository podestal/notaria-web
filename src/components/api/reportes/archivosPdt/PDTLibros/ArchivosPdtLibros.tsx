
import { useState } from 'react'
import ArchivosPdtHeader from '../ArchivosPdtHeader'
import ArchivosPdtLibrosHeader from './ArchivosPdtLibrosHeader'
import ArchivosPdtLibrosBody from './ArchivosPdtLibrosBody'

const ArchivosPdtLibros = () => {

    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <ArchivosPdtHeader 
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            loading={loading}
            setLoading={setLoading}
            refetch={() => Promise.resolve()}
        />
        <ArchivosPdtLibrosHeader dateFrom={dateFrom} dateTo={dateTo} count={0} />
        <ArchivosPdtLibrosBody />
    </div>
  )
}

export default ArchivosPdtLibros