import { AnimatePresence, motion } from "framer-motion"
import { type ReactNode } from "react"

export type ContratanteClienteView = "contratante" | "cliente"

const viewMotion: Record<
    ContratanteClienteView,
    { initial: object; animate: object; exit: object }
> = {
    contratante: {
        initial: { opacity: 0, x: -28, y: 6 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: -28, y: -6 },
    },
    cliente: {
        initial: { opacity: 0, x: 28, y: 6 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: { opacity: 0, x: 28, y: -6 },
    },
}

interface Props {
    activeView: ContratanteClienteView
    contratante: ReactNode
    cliente: ReactNode
    className?: string
}

const ContratanteClienteFormTransition = ({
    activeView,
    contratante,
    cliente,
    className = "",
}: Props) => (
    <AnimatePresence mode="wait" initial={false}>
        <motion.div
            key={activeView}
            className={className}
            initial={viewMotion[activeView].initial}
            animate={viewMotion[activeView].animate}
            exit={viewMotion[activeView].exit}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        >
            {activeView === "contratante" ? contratante : cliente}
        </motion.div>
    </AnimatePresence>
)

export default ContratanteClienteFormTransition
