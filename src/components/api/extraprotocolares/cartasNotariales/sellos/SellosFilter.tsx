import SimpleInput from '../../../../ui/SimpleInput'

interface Props {
    description: string
    setDescription: (description: string) => void
}

const SellosFilter = ({
    description,
    setDescription,
}: Props) => {
  return (
    <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full h-10 p-2 border border-slate-300 rounded-2xl"
    />
  )
}

export default SellosFilter