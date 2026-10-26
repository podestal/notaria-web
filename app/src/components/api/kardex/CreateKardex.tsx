import { useState } from "react"
import { motion } from "framer-motion"
import KardexForm from "./KardexForm"
import KardexLogsPanel from "./KardexLogsPanel"
import useCreateKardex from "../../../hooks/api/kardex/useCreateKardex"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import useUserInfoStore from "../../../hooks/store/useGetUserInfo"
import TopModal from "../../ui/TopModal"
import { Kardex } from "../../../services/api/kardexService"
import KardexCompliancePastMonthsAlert from "./KardexCompliancePastMonthsAlert"
import { useCompliancePastMonthsUrgent } from "./useCompliancePastMonthsUrgent"

const CreateKardex = () => {

    const [open, setOpen] = useState(false)
    const bodyRender = useBodyRenderStore(s => s.bodyRender)
    const createKardex = useCreateKardex({ idtipkar: bodyRender }) 
    const [kardex, setKardex] = useState<Kardex | null>(null)
    const { show: pastUrgent } = useCompliancePastMonthsUrgent()
    const user = useUserInfoStore(s => s.user)
    const isSuperuser = Number(user?.is_superuser) !== 0
    const showLogs = isSuperuser && open && Boolean(kardex?.idkardex)

  return (
    <>
    <div>
        <motion.button 
            onClick={() => setOpen(true)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="group cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-2 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/25 transition-colors">
            <span className="font-bold text-lg leading-none transition-transform duration-300 group-hover:rotate-90">+</span>
            <span className="text-xs font-semibold">Nuevo</span>
        </motion.button>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => {
            setOpen(false)
            setKardex(null)
        }}
        portal
        wide={showLogs}
        tone={pastUrgent ? "danger" : "default"}
        banner={
            pastUrgent ? <KardexCompliancePastMonthsAlert sticky /> : null
        }
    >
        {showLogs && kardex ? (
            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-0">
                <div className="flex max-h-[32vh] shrink-0 flex-col lg:max-h-none lg:w-[22rem] xl:w-96">
                    <KardexLogsPanel
                        idkardex={kardex.idkardex}
                        enabled={open}
                        className="h-full lg:max-h-none"
                    />
                </div>
                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto lg:pl-4">
                    <KardexForm
                        createKardex={createKardex}
                        setKardex={setKardex}
                        kardex={kardex}
                    />
                </main>
            </div>
        ) : (
            <KardexForm
                createKardex={createKardex}
                setKardex={setKardex}
                kardex={kardex}
            />
        )}
    </TopModal>
    </>
  )
}

export default CreateKardex
