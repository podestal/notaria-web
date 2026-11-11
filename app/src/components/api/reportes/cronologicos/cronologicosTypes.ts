import type { ComponentType } from "react"
import EscriturasPublicas from "./reportes/escritruasPublicas/EscriturasPublicas"
import NoContenciosos from "./reportes/noContenciosos/NoContenciosos"
import TransferenciasVehiculares from "./reportes/vehicular/TransferenciasVehiculares"
import GarantiasMobiliarias from "./reportes/garantias/GarantiasMobiliarias"
import Testamentos from "./reportes/testamento/Testamentos"
import Protestos from "./reportes/Protestos"
import ActasProtestos from "./reportes/ActasProtestos"
import CamaraDeComercio from "./reportes/CamaraDeComercio"
import CartasNotariales from "./reportes/cartasNotariales/CartasNotariales"
import AperturaLibros from "./reportes/aperturaLibro/AperturaLibros"
import PermisoViajes from "./reportes/permisoViaje/PermisoViajes"
import Poderes from "./reportes/poderes/Poderes"
import SupervivenciaCapaz from "./reportes/SupervivenciaCapaz"
import SupervivenciaIncapaz from "./reportes/SupervivenciaIncapaz"
import Domiciliario from "./reportes/domiciliario/Domiciliario"

export type CronologicoTypeId =
    | "escrituras"
    | "no-contenciosos"
    | "transferencias-vehiculares"
    | "garantias-mobiliarias"
    | "testamentos"
    | "protestos"
    | "generar-actas-protesto"
    | "informe-camara-comercio"
    | "cartas-notariales"
    | "certificacion-apertura-libros"
    | "permisos-viaje"
    | "poderes-fuera-registro"
    | "cart-supervivencia-persona-capaz"
    | "cart-supervivencia-persona-incapaz"
    | "certificado-domiciliario"

export type CronologicoReportProps = {
    embedded?: boolean
}

export const CRONOLOGICOS_OPTIONS: {
    id: CronologicoTypeId
    label: string
    /** Colored border + text when idle. */
    idle: string
    /** Solid fill when selected. */
    active: string
    Component: ComponentType<CronologicoReportProps>
}[] = [
    {
        id: "escrituras",
        label: "Escrituras Públicas",
        idle: "border-sky-600 bg-white text-sky-700 hover:bg-sky-50",
        active: "border-sky-600 bg-sky-600 text-white shadow-sm shadow-sky-200",
        Component: EscriturasPublicas,
    },
    {
        id: "no-contenciosos",
        label: "No Contenciosos",
        idle: "border-violet-600 bg-white text-violet-700 hover:bg-violet-50",
        active: "border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-200",
        Component: NoContenciosos,
    },
    {
        id: "transferencias-vehiculares",
        label: "Vehiculares",
        idle: "border-amber-500 bg-white text-amber-700 hover:bg-amber-50",
        active: "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200",
        Component: TransferenciasVehiculares,
    },
    {
        id: "garantias-mobiliarias",
        label: "Garantías",
        idle: "border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50",
        active: "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200",
        Component: GarantiasMobiliarias,
    },
    {
        id: "testamentos",
        label: "Testamentos",
        idle: "border-indigo-600 bg-white text-indigo-700 hover:bg-indigo-50",
        active: "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200",
        Component: Testamentos,
    },
    {
        id: "protestos",
        label: "Protestos",
        idle: "border-rose-600 bg-white text-rose-700 hover:bg-rose-50",
        active: "border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-200",
        Component: Protestos,
    },
    {
        id: "generar-actas-protesto",
        label: "Actas Protesto",
        idle: "border-orange-600 bg-white text-orange-700 hover:bg-orange-50",
        active: "border-orange-600 bg-orange-600 text-white shadow-sm shadow-orange-200",
        Component: ActasProtestos,
    },
    {
        id: "informe-camara-comercio",
        label: "Cámara Comercio",
        idle: "border-teal-600 bg-white text-teal-700 hover:bg-teal-50",
        active: "border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-200",
        Component: CamaraDeComercio,
    },
    {
        id: "cartas-notariales",
        label: "Cartas Notariales",
        idle: "border-cyan-600 bg-white text-cyan-700 hover:bg-cyan-50",
        active: "border-cyan-600 bg-cyan-600 text-white shadow-sm shadow-cyan-200",
        Component: CartasNotariales,
    },
    {
        id: "certificacion-apertura-libros",
        label: "Apertura Libros",
        idle: "border-yellow-500 bg-white text-yellow-700 hover:bg-yellow-50",
        active: "border-yellow-500 bg-yellow-500 text-white shadow-sm shadow-yellow-200",
        Component: AperturaLibros,
    },
    {
        id: "permisos-viaje",
        label: "Permisos Viaje",
        idle: "border-purple-600 bg-white text-purple-700 hover:bg-purple-50",
        active: "border-purple-600 bg-purple-600 text-white shadow-sm shadow-purple-200",
        Component: PermisoViajes,
    },
    {
        id: "poderes-fuera-registro",
        label: "Poderes",
        idle: "border-blue-600 bg-white text-blue-700 hover:bg-blue-50",
        active: "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-200",
        Component: Poderes,
    },
    {
        id: "cart-supervivencia-persona-capaz",
        label: "Supervivencia Capaz",
        idle: "border-red-600 bg-white text-red-700 hover:bg-red-50",
        active: "border-red-600 bg-red-600 text-white shadow-sm shadow-red-200",
        Component: SupervivenciaCapaz,
    },
    {
        id: "cart-supervivencia-persona-incapaz",
        label: "Supervivencia Incapaz",
        idle: "border-slate-700 bg-white text-slate-700 hover:bg-slate-50",
        active: "border-slate-700 bg-slate-700 text-white shadow-sm shadow-slate-300",
        Component: SupervivenciaIncapaz,
    },
    {
        id: "certificado-domiciliario",
        label: "Domiciliario",
        idle: "border-pink-600 bg-white text-pink-700 hover:bg-pink-50",
        active: "border-pink-600 bg-pink-600 text-white shadow-sm shadow-pink-200",
        Component: Domiciliario,
    },
]
