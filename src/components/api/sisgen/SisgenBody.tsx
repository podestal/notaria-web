
import SisgenSearchForm from "./SisgenSearchForm";

interface Props {
    typekardex: string;
}

const SisgenBody = ({ typekardex }: Props) => {

  return (
    <div className="w-fullflex flex-col items-start justify-center h-full my-6 gap-6">
        <h2 className="text-xl font-bold">{typekardex}</h2>
        <SisgenSearchForm />
    </div>
  )
}

export default SisgenBody