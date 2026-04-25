import ComingSoon from '../../../ui/ComingSoon'
import GenericHeader from '../../../ui/GenericHeader'

const SuperIncapazMain = () => {
  return (
    <div className="w-[92%] max-w-[1400px] mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 text-black mt-4 mb-4 overflow-hidden">
        <GenericHeader 
          title="Supervivencia Persona Incapaz"
          setOpen={() => {}}
        />
        <ComingSoon />
    </div>
  )
}

export default SuperIncapazMain