import { File } from "lucide-react"

const ArchivoPdtKardexFiles = () => {
  return (
    <div className=" grid grid-cols-5 gap-4 justify-center items-center text-center my-6 px-8 py-4 mx-6 text-xs">
        <button className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            <File className="w-4 h-4" />
            <p>Act</p>
        </button>
        <button className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            <File className="w-4 h-4" />
            <p>Bie</p>
        </button>
        
        <button className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            <File className="w-4 h-4" />
            <p>Otg</p>
        </button>
        
        <button className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            <File className="w-4 h-4" />
            <p>Mp</p>
        </button>
        <button className="flex justify-center items-center gap-2 hover:bg-slate-300 w-[100px] cursor-pointer bg-slate-200 rounded-md p-2 transition-all duration-300">
            <File className="w-4 h-4" />
            <p>Form</p>
        </button>
    </div>
  )
}

export default ArchivoPdtKardexFiles