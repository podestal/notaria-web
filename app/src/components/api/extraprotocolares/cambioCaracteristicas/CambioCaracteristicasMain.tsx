import ComingSoon from '../../../ui/ComingSoon'
import GenericHeader from '../../../ui/GenericHeader'

const CambioCaracteristicasMain = () => {
  return (
    <div className="w-[92%] max-w-[1400px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 text-black mt-4 mb-4 overflow-hidden">
        <GenericHeader 
          title="Cambio de Características"
          setOpen={() => {}}
        />
        <ComingSoon />
    </div>
  )
}

export default CambioCaracteristicasMain