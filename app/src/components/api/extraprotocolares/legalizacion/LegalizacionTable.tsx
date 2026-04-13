import LegalizacionTableBody from "./LegalizacionTableBody"
import LegalizacionTableHeader from "./LegalizacionTableHeader"

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
}

const LegalizacionTable = ({ dateFrom, dateTo }: Props) => {
  return (
    <>
      <LegalizacionTableHeader />
      <LegalizacionTableBody 
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

    </>
  )
}

export default LegalizacionTable