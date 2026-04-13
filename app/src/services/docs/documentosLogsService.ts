import DocClient from "./docClient"

// kardex = models.CharField(max_length=15, db_index=True, help_text="Kardex reference")
// user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
// action = models.CharField(max_length=1, choices=ACTIONS_CHOICES)
// created_at = models.DateTimeField(auto_now_add=True)

export interface DocumentoLog {
    id: number
    kardex: string
    user: number
    action: string
    created_at: string
}

interface Props {
    byKardex?: boolean
}

const getDocumentosLogsService = ({ byKardex }: Props) => {
    let url = '/documentos-logs/'
    if (byKardex) {
        url += 'by_kardex/'
    }
    return new DocClient<DocumentoLog>(url)
}

export default getDocumentosLogsService