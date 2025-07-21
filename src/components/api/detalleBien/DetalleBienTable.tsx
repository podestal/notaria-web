import DetalleBienTableBody from "./DetalleBienTableBody"
import DetalleBienTableHeader from "./DetalleBienTableHeader"

interface Props {
    kardex: string
    idtipoacto: string
}

const DetalleBienTable = ({ kardex, idtipoacto }: Props) => {

  return (
    <>
      <DetalleBienTableHeader />
      <DetalleBienTableBody kardex={kardex} idtipoacto={idtipoacto} />
    </>
  )
}

export default DetalleBienTable