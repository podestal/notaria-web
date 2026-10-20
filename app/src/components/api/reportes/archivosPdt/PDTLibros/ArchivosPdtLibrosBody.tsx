import { FileSearch } from "lucide-react"
import { motion } from "framer-motion"
import { LibroPdt } from "../../../../../services/api/extraprotocolares/librosService"
import ArchivoPdtLibrosCard, { PDT_LIBROS_GRID } from "./ArchivoPdtLibrosCard"
import ExtraTableShell, { EXTRA_HEADER_CLASS } from "../../../extraprotocolares/ExtraTableShell"
import { emptyMotionProps } from "../../../extraprotocolares/rowMotion"

interface Props {
    errors: LibroPdt[]
}

const ArchivosPdtLibrosBody = ({ errors }: Props) => {
  return (
    <ExtraTableShell
        count={errors.length}
        label={errors.length === 1 ? "error encontrado" : "errores encontrados"}
        hint="Haga clic en un libro para abrirlo"
        minWidth="560px"
    >
        <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: PDT_LIBROS_GRID }}>
            <p>Libro</p>
            <p>Descripción del error</p>
        </div>
        {errors.length === 0 ? (
            <motion.div
                {...emptyMotionProps}
                className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
            >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <FileSearch className="h-5 w-5" aria-hidden />
                </span>
                <p className="text-sm font-medium text-slate-600">Sin errores PDT en este rango</p>
                <p className="text-xs text-slate-400">Puede descargar el archivo plano.</p>
            </motion.div>
        ) : (
            <div className="divide-y divide-slate-100">
                {errors.map((error, index) => (
                    <ArchivoPdtLibrosCard key={`${error.bookNumber}-${index}`} error={error} index={index} />
                ))}
            </div>
        )}
    </ExtraTableShell>
  )
}

export default ArchivosPdtLibrosBody
