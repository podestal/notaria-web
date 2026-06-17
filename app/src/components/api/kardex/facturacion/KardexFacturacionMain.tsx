import { ClipboardList, FileText, Receipt } from "lucide-react"
import { useState } from "react"
import type { Kardex } from "../../../../services/api/kardexService"
import CreateRecibo from "../../../taxes/comprobantes/CreateRecibo"
import CreateIngreso from "../../../taxes/controlInterno/CreateIngreso"
import KardexFacturacionComprobantes from "./KardexFacturacionComprobantes"

type FacturacionType = "control_interno" | "boleta" | "factura"

interface Props {
    kardex: Kardex
}

const FACTURACION_OPTIONS: {
    id: FacturacionType
    label: string
    description: string
    icon: typeof ClipboardList
}[] = [
    {
        id: "control_interno",
        label: "Control interno",
        description: "Registre un comprobante de control interno.",
        icon: ClipboardList,
    },
    {
        id: "boleta",
        label: "Boleta",
        description: "Emita una boleta de venta electrónica.",
        icon: Receipt,
    },
    {
        id: "factura",
        label: "Factura",
        description: "Emita una factura electrónica.",
        icon: FileText,
    },
]

const KardexFacturacionMain = ({ kardex }: Props) => {
    const [selectedType, setSelectedType] = useState<FacturacionType>("control_interno")
    const [formKey, setFormKey] = useState(0)

    const selectedOption =
        FACTURACION_OPTIONS.find((option) => option.id === selectedType) ??
        FACTURACION_OPTIONS[0]

    const handleCreateDone = () => {
        setFormKey((prev) => prev + 1)
    }

    const renderForm = () => {
        switch (selectedType) {
            case "boleta":
                return (
                    <CreateRecibo
                        key={formKey}
                        variant="boleta"
                        onDone={handleCreateDone}
                        kardex={kardex.kardex}
                    />
                )
            case "factura":
                return (
                    <CreateRecibo
                        key={formKey}
                        variant="factura"
                        onDone={handleCreateDone}
                        kardex={kardex.kardex}
                    />
                )
            case "control_interno":
            default:
                return (
                    <CreateIngreso
                        key={formKey}
                        onDone={handleCreateDone}
                        kardex={kardex.kardex}
                    />
                )
        }
    }

    return (
        <div className="py-4">
            <header className="mb-4">
                <h2 className="text-base font-semibold text-slate-800">Facturación</h2>
                <p className="mt-1 text-xs text-slate-500">
                    Kardex {kardex.kardex}. Consulte los comprobantes vinculados o registre
                    uno nuevo.
                </p>
            </header>

            <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-800">
                    Comprobantes del kardex
                </h3>
                <div className="mt-3">
                    <KardexFacturacionComprobantes kardexCode={kardex.kardex} />
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {FACTURACION_OPTIONS.map((option) => {
                    const Icon = option.icon
                    const isActive = selectedType === option.id

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                                setSelectedType(option.id)
                                setFormKey((prev) => prev + 1)
                            }}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                                isActive
                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5" aria-hidden />
                            {option.label}
                        </button>
                    )
                })}
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-4">
                <h3 className="text-sm font-semibold text-slate-800">{selectedOption.label}</h3>
                <p className="mb-4 mt-1 text-xs text-slate-500">{selectedOption.description}</p>
                <div key={`${selectedType}-${formKey}`}>{renderForm()}</div>
            </div>
        </div>
    )
}

export default KardexFacturacionMain
