import LegalizacionTableBody from "./LegalizacionTableBody"

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
}

const LegalizacionTable = ({ dateFrom, dateTo }: Props) => {
  return (
    <LegalizacionTableBody
      dateFrom={dateFrom}
      dateTo={dateTo}
    />
  )
}

export default LegalizacionTable
