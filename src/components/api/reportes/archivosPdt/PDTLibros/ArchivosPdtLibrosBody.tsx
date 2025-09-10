import { LibroPdt } from "../../../../../services/api/extraprotocolares/librosService";

interface Props {
    errors: LibroPdt[];
}

const ArchivosPdtLibrosBody = ({ errors }: Props) => {
  return (
    <div className="w-[85%] mx-auto pb-10 text-black">
    <div className="grid grid-cols-2 gap-4 justify-center items-center text-center text-xs font-semibold p-2 my-4 mx-6 bg-slate-200 text-black">
        <p>Libro</p>
        <p>Descripción del Error</p>
    </div>
    {errors.map((error, index) => (
        <div key={index + error.bookNumber} className="grid grid-cols-2 gap-4 justify-center items-center text-center text-xs p-2 my-4 mx-6 text-black">
            <p>{error.bookNumber}</p>
            <p>{error.errorItem}</p>
        </div>
    ))}
    </div>
  )
}

export default ArchivosPdtLibrosBody