import { useState } from "react";
import { motion } from "framer-motion";
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import TopModal from "../../../ui/TopModal";
import { NUMERO_LIBROS, TIPOS_FOLIOS } from "../../../../data/librosData";
import UpdateLibro from "./UpdateLibro";
import { rowMotionProps } from "../rowMotion";

interface Props {
    libro: Libro
    readyOnly?: boolean
    page: number
    index?: number
}

const LibrosCard = ({ libro, readyOnly, page, index = 0 }: Props) => {

    const [open, setOpen] = useState(false);

  return (
    <>
        <motion.div
            {...rowMotionProps(index)}
            className="grid grid-cols-10 gap-4 justify-center items-center text-center text-slate-800 text-xs p-2 my-4 mx-6 transition-colors hover:bg-sky-50/60"
        >
            <p
                onClick={() => {
                    if (readyOnly) return
                    setOpen(true)
                }}
                className="text-center text-blue-600 cursor-pointer hover:text-blue-500"
            >{libro.numlibro}-{libro.ano}</p>
            <p>{libro.fecing}</p>
            <p className="col-span-2">{libro.empresa}</p>
            <p>{libro.idtiplib}</p>
            <p>{NUMERO_LIBROS.find(libro => libro.idnlibro === libro.idnlibro)?.desnlibro}</p>
            <p>{libro.folio}</p>
            <p>{TIPOS_FOLIOS.find(folio => folio.idtipfol === libro.idtipfol)?.destipfol}</p>
            <p>{libro.ruc}</p>
            <p>l</p>
        </motion.div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <UpdateLibro libro={libro} page={page} />
        </TopModal>
    </>
  )
}

export default LibrosCard