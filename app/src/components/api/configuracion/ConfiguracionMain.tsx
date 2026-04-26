import { Outlet } from "react-router-dom"

const ConfiguracionMain = () => {
  return (
    <div className="w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg text-black">
        <Outlet />
    </div>
  )
}

export default ConfiguracionMain