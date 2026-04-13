import CreateDetalleBien from "./CreateDetalleBien"
import DetalleBienTable from "./DetalleBienTable"

interface Props {
  kardex: string
  idtipoacto: string
  itemmp: string
}

const DetalleBienMain = ({kardex, idtipoacto, itemmp }: Props) => {

  return (
      <>
        {itemmp 
        ? 
        <>
        <CreateDetalleBien 
            kardex={kardex}
            idtipoacto={idtipoacto}
            itemmp={itemmp}
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