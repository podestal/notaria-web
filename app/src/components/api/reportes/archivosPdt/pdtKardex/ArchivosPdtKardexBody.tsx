import { FileSearch } from 'lucide-react'
import { motion } from 'framer-motion'
import { PdtError } from '../../../../../services/api/pdtKardexErrors'
import ArchivosPdtKardexCard, { PDT_KARDEX_GRID } from './ArchivosPdtKardexCard'
import ExtraTableShell, { EXTRA_HEADER_CLASS } from '../../../extraprotocolares/ExtraTableShell'
import { emptyMotionProps } from '../../../extraprotocolares/rowMotion'

interface Props {
    errors: PdtError[]
}

const ArchivosPdtKardexBody = ({ errors }: Props) => {
  return (
    <ExtraTableShell
        count={errors.length}
        label={errors.length === 1 ? "error encontrado" : "errores encontrados"}
        hint="Haga clic en un kardex para abrirlo"
        minWidth="720px"
    >
        <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: PDT_KARDEX_GRID }}>
            <p>Kardex</p>
            <p>Acto</p>
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
                <p className="text-xs text-slate-400">Puede descargar los archivos planos.</p>
            </motion.div>
        ) : (
            <div className="divide-y divide-slate-100">
                {errors.map((error, index) => (
                    <ArchivosPdtKardexCard key={`${error.kardex}-${index}`} error={error} index={index} />
                ))}
            </div>
        )}
    </ExtraTableShell>
  )
}

export default ArchivosPdtKardexBody
