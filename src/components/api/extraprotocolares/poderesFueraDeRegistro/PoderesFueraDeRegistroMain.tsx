import GenericHeader from '../../../ui/GenericHeader'
import PoderesFueraDeRegistroFilters from './PoderesFueraDeRegistroFilters'
import PoderesFueraDeRegistroTable from './PoderesFueraDeRegistroTable'

const PoderesFueraDeRegistroMain = () => {
  return (
        <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
            <GenericHeader 
            title="Poderes Fuera de Registro"
            setOpen={() => {}}
            />
            <PoderesFueraDeRegistroFilters />
            <PoderesFueraDeRegistroTable />
        </div>
  )
}

export default PoderesFueraDeRegistroMain