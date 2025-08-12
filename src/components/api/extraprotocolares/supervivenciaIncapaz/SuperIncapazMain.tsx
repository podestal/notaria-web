import ComingSoon from '../../../ui/ComingSoon'
import GenericHeader from '../../../ui/GenericHeader'

const SuperIncapazMain = () => {
  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Supervivencia Persona Incapaz"
          setOpen={() => {}}
        />
        <ComingSoon />
    </div>
  )
}

export default SuperIncapazMain