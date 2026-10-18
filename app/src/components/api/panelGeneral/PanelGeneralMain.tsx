import { motion } from "framer-motion"
import KardexErrors from "../kardex/kardexErrors/KardexErrors"

const PanelGeneralMain = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto mb-10 mt-4 w-[92%] max-w-[1400px] text-slate-800"
    >
      <KardexErrors />
    </motion.div>
  )
}

export default PanelGeneralMain
