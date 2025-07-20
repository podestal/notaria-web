
import SisgenSearchForm from "./SisgenSearchForm";

interface Props {
    typekardex: string;
    instrumentType: number
}

const SisgenBody = ({ typekardex, instrumentType }: Props) => {

  return (
    <div className="w-full my-6">
        <h2 className="text-xl font-bold">{typekardex}</h2>
        <SisgenSearchForm 
          instrumentType={instrumentType}
        />
    </div>
  )
}

export default SisgenBody