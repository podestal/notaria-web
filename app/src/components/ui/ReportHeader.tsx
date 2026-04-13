import { LibraryBig } from "lucide-react"

interface Props {
    title: string
}

const ReportHeader = ({ title }: Props) => {
  return (
    <div className="w-full flex justify-between items-center bg-slate-700 p-4 rounded-t-lg text-slate-50">
        <div className="flex items-center gap-2">
          <LibraryBig 
            className="text-green-700"
          />
          <h2 className="text-amber-500">{title}</h2>
        </div>
    </div>
  )
}

export default ReportHeader