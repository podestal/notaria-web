import { Outlet, useLocation } from "react-router-dom"

const TaxesMain = () => {
    const { pathname } = useLocation()

    return (
        <div className="mx-auto mb-10 mt-[80px] flex min-h-screen w-[85%] flex-col items-center justify-start rounded-lg bg-slate-100 text-black">
            <div className="w-full flex-1 px-4 py-6">
                <Outlet key={pathname} />
            </div>
        </div>
    )
}

export default TaxesMain
