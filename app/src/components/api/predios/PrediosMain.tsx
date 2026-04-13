import PrediosForm from "./PrediosForm"
import PrediosTable from "./PrediosTable"

interface Props {
    kardex: string
}

const PrediosMain = ({ kardex }: Props) => {
  return (
    <>
        <PrediosForm 
            kardex={kardex}
        />
        <PrediosTable 
            kardex={kardex}
        />
    </>
  )
}

export default PrediosMain