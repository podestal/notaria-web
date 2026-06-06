import { Outlet } from "react-router-dom"
import { Receipt } from "lucide-react"

const TaxesMain = () => {
    return (
        <div className="mx-auto mb-10 mt-[80px] flex min-h-screen w-[85%] flex-col items-center justify-start rounded-lg bg-slate-100 text-black shadow-lg">

            <div className="w-full flex-1 px-4 py-6">
                <Outlet />
            </div>
        </div>
    )
}

export default TaxesMain
