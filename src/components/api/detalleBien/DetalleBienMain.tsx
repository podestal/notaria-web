import CreateDetalleBien from "./CreateDetalleBien"
import DetalleBienTable from "./DetalleBienTable"

interface Props {
  kardex: string
  idtipoacto: string
}

const DetalleBienMain = ({kardex, idtipoacto }: Props) => {

  return (
      <>
        {idtipoacto 
        ? 
        <>
        <CreateDetalleBien 
        />
        <DetalleBienTable 
            kardex={kardex}
            idtipoacto={idtipoacto}
        />
        </> 
        : 
        <p className="text-center text-xs my-6">Es necesario crear un patrimonial primero</p>
        }
    </>
  )
}

export default DetalleBienMain