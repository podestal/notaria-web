import { useQuery } from "@tanstack/react-query"
import getDocumentosLogsService, { DocumentoLog } from "../../../../services/docs/documentosLogsService"
import useAuthStore from "../../../../store/useAuthStore"

interface Props {
  kardex: string
}

const LogsMain = ({ kardex }: Props) => {
  const access = useAuthStore(state => state.access_token)
  const logsService = getDocumentosLogsService({ byKardex: true })

  const { data, isLoading, isError } = useQuery({
    queryKey: ["documentos-logs", kardex],
    queryFn: () => logsService.get(access || "", { kardex }),
    enabled: Boolean(access && kardex),
  })

  const logs = (Array.isArray(data) ? data : []) as DocumentoLog[]

  if (isLoading) {
    return <p className="text-sm text-gray-600">Cargando logs...</p>
  }

  if (isError) {
    return <p className="text-sm text-red-600">No se pudieron cargar los logs.</p>
  }

  if (!logs.length) {
    return <p className="text-sm text-gray-600">No hay logs para este kardex.</p>
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      <div className="grid grid-cols-3 gap-2 border-b border-gray-200 pb-2 text-xs font-semibold">
        <p>Usuario</p>
        <p>Accion</p>
        <p>Fecha</p>
      </div>
      {logs.map(log => (
        <div key={log.id} className="grid grid-cols-3 gap-2 border-b border-gray-100 py-2 text-xs">
          <p>{log.user}</p>
          <p>{log.action}</p>
          <p>{new Date(log.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

export default LogsMain
