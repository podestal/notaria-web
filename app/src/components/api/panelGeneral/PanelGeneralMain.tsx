import KardexErrors from "../kardex/kardexErrors/KardexErrors"

const PanelGeneralMain = () => {
  return (
    <div className="mx-auto w-[92%] max-w-[1400px] bg-white rounded-2xl shadow-sm border border-slate-200 text-black mt-4 mb-4 overflow-hidden">
      <KardexErrors />
    </div>
  )
}

export default PanelGeneralMain
