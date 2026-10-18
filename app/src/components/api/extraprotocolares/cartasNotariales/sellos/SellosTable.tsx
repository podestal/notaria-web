import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import useGetSellos from "../../../../../hooks/api/extraprotocolares/ingresoCartas/sellosCartas/useGetSellos"
import useAuthStore from "../../../../../store/useAuthStore"
import getTitleCase from "../../../../../utils/getTitleCase"
import { emptyMotionProps, rowMotionProps } from "../../rowMotion"
import ExtraTableShell, { EXTRA_HEADER_CLASS, EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../../ExtraTableShell"
import LoadingState from "../../../../ui/LoadingState"

interface Props {
    description: string
    setContenido: React.Dispatch<React.SetStateAction<string>>
    setOpenSellos: React.Dispatch<React.SetStateAction<boolean>>
}

const SELLOS_GRID_COLUMNS = "minmax(100px,1fr) minmax(220px,3fr)"

const SellosTable = ({
    description,
    setContenido,
    setOpenSellos,
}: Props) => {
    const access = useAuthStore(s => s.access_token) || ''
    const {data: sellos, isLoading, isError, error, isSuccess} = useGetSellos({ access })

    if (isLoading) return <LoadingState message="Cargando sellos…" />
    if (isError) return <p className="my-8 text-center text-sm text-red-600">Error al cargar los sellos: {error?.message}</p>
    if (!isSuccess) return null

    const filtered = sellos.filter(s =>
      s.dessello.toLowerCase().includes(description.toLowerCase())
    )

  return (
    <ExtraTableShell
      count={filtered.length}
      label="sellos encontrados"
      hint="Haga clic en una fila para insertar el sello"
      minWidth="480px"
    >
      <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: SELLOS_GRID_COLUMNS }}>
        <p className="text-left">Código</p>
        <p className="text-left">Descripción</p>
      </div>
      {filtered.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {filtered.map((s, index) => (
            <motion.div
              key={s.idsello}
              {...rowMotionProps(index)}
              role="button"
              tabIndex={0}
              onClick={() => {
                setContenido(s.contenido || '')
                setOpenSellos(false)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setContenido(s.contenido || '')
                  setOpenSellos(false)
                }
              }}
              className={`${EXTRA_ROW_CLASS} cursor-pointer`}
              style={{ gridTemplateColumns: SELLOS_GRID_COLUMNS }}
            >
              <div>
                <span className={EXTRA_ID_BADGE_CLASS}>{s.idsello}</span>
              </div>
              <p className="leading-snug text-slate-800">{getTitleCase(s.dessello || '')}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FileSearch className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-sm font-medium text-slate-600">No hay sellos disponibles</p>
        </motion.div>
      )}
    </ExtraTableShell>
  )
}

export default SellosTable
