import { Outlet } from "react-router-dom"

const ConfiguracionMain = () => {
  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <Outlet />
    </div>
  )
}

export default ConfiguracionMain