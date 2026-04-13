import PrediosTableBody from "./PrediosTableBody"
import PrediosTableHeader from "./PrediosTableHeader"

interface Props {
    kardex: string
}

const PrediosTable = ({ kardex }: Props) => {
  return (
    <div className="my-6">
        <PrediosTableHeader />
        <PrediosTableBody 
            kardex={kardex}
        />
    </div>
  )
}

export default PrediosTable