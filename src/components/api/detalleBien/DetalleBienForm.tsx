interface Props {
  kardex: string
  idtipoacto: string
}

const DetalleBienForm = ({ kardex, idtipoacto }: Props) => {
  return (
    <div>
      <p>Detalle bienes form</p>
      <p>{kardex}</p>
      <p>{idtipoacto}</p>
    </div>
  )
}

export default DetalleBienForm