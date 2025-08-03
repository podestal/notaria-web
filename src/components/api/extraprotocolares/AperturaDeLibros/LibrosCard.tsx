import { useState } from "react";
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import TopModal from "../../../ui/TopModal";

interface Props {
    libro: Libro
}

const LibrosCard = ({ libro }: Props) => {

    const [open, setOpen] = useState(false);

  return (
    <>
        <div className="grid grid-cols-10 gap-4 justify-center items-center text-center text-black text-xs p-2 my-4 mx-6">
            <p
                onClick={() => setOpen(true)}
                className="text-center text-blue-600 cursor-pointer hover:text-blue-500"
            >{libro.numlibro}-{libro.ano}</p>
            <p>{libro.fecing}</p>
            <p className="col-span-2">{libro.empresa}</p>
            <p>{libro.idtiplib}</p>
            <p>{libro.numlibro}</p>
            <p>{libro.folio}</p>
            <p>{libro.idtipfol}</p>
            <p>{libro.ruc}</p>
            <p>l</p>
        </div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            {/* Aquí podrías agregar un componente para editar el libro */}
            <p>Detalles del Libro: {libro.numlibro}</p>
            {/* Agrega más detalles o un formulario de edición aquí */}
        </TopModal>
    </>
  )
}

export default LibrosCard