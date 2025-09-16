import { PdtError } from '../../../../../services/api/pdtKardexErrors'
import ArchivosPdtKardexCard from './ArchivosPdtKardexCard'

interface Props {
    errors: PdtError[]
}

const ArchivosPdtKardexBody = ({ errors }: Props) => {
    console.log('errors', errors)
  return (
    <div className="w-[85%] mx-auto pb-10 text-black">
        <div className="grid grid-cols-2 gap-4 justify-center items-center text-center text-xs font-semibold p-2 my-4 mx-6 bg-slate-200 text-black">
            <p>Kardex</p>
            <p>Descripción del Error</p>
        </div>
        {errors.map((error, index) => (
            <ArchivosPdtKardexCard key={index + error.kardex} error={error} />
        ))}
    </div>
  )
}

export default ArchivosPdtKardexBody