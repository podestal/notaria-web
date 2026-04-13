interface Props {
    label: string
    onClick: () => void
}

const AIButton = ({ label, onClick }: Props) => {
  return (
    <div className="w-full flex justify-center items-center mt-8">
    <button 
            onClick={() => onClick}
            className="relative inline-flex items-center justify-center px-[1px] py-[1px] rounded-lg bg-transparent  font-semibold overflow-hidden cursor-pointer">
        <span className="absolute inset-0 rounded-lg p-[1px] bg-[conic-gradient(from_0deg,red,orange,yellow,green,blue,indigo,violet,red)] animate-pulse hover:text-slate-200 z-0"></span>
        <span className="relative z-10  bg-slate-50 hover:opacity-90 transition-opacity rounded-lg px-6 py-2">
            {label}
        </span>
    </button>
    </div>
  )
}

export default AIButton