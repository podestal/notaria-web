import { useState } from "react"
import { ClipboardList } from "lucide-react"
import type { Ingreso } from "../../../services/taxes/ingresosService"
import TopModal from "../../ui/TopModal"
import ComprobanteSectionMain from "../comprobantes/ComprobanteSectionMain"
import CanjearIngresoModal from "./CanjearIngresoModal"
import CreateIngreso from "./CreateIngreso"
import IngresosList from "./IngresosList"
import UpdateIngreso from "./UpdateIngreso"

const ControlInternoMain = () => {
    const [editingIngreso, setEditingIngreso] = useState<Ingreso | null>(null)
    const [canjeandoIngreso, setCanjeandoIngreso] = useState<Ingreso | null>(null)

    return (
        <ComprobanteSectionMain
            icon={ClipboardList}
            title="Control interno"
            description="Registre ingresos y consulte el reporte de comprobantes emitidos."
            createTitle="Nuevo ingreso"
            createDescription="Complete los datos para registrar un comprobante de control interno."
            createForm={(onDone) => <CreateIngreso onDone={onDone} />}
            reporteTitle="Reporte de ingresos"
            reporteDescription="Consulte y filtre los ingresos registrados."
            listVariant="ingreso"
            renderReporteList={(context) => (
                <IngresosList
                    {...context}
                    onEdit={setEditingIngreso}
                    onImprimir={(ingreso) => context.onImprimir(ingreso)}
                    onAnular={(ingreso) => context.onAnular(ingreso)}
                    onCanjear={setCanjeandoIngreso}
                />
            )}
        >
            <TopModal
                isOpen={Boolean(editingIngreso)}
                onClose={() => setEditingIngreso(null)}
                deepth={50}
                portal
            >
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Editar ingreso</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Modifique los datos del ingreso seleccionado.
                    </p>
                    <div className="mt-4">
                        {editingIngreso && (
                            <UpdateIngreso
                                ingreso={editingIngreso}
                                onCancel={() => setEditingIngreso(null)}
                            />
                        )}
                    </div>
                </div>
            </TopModal>

            <CanjearIngresoModal
                ingreso={canjeandoIngreso}
                onClose={() => setCanjeandoIngreso(null)}
            />
        </ComprobanteSectionMain>
    )
}

export default ControlInternoMain
