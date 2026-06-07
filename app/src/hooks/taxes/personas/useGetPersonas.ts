import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import personasService, { type PersonasPage } from "../../../services/taxes/personasService"

interface Props {
    access: string
    page?: number
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    razon_social?: string
    numero_documento?: string
    documento?: string
    enabled?: boolean
}

const useGetPersonas = ({
    access,
    page = 1,
    nombres = "",
    apellido_paterno = "",
    apellido_materno = "",
    razon_social = "",
    numero_documento = "",
    documento = "",
    enabled = true,
}: Props): UseQueryResult<PersonasPage, Error> => {
    const params: Record<string, string> = {
        page: String(page),
    }
    if (nombres.trim()) params.nombres = nombres.trim()
    if (apellido_paterno.trim()) params.apellido_paterno = apellido_paterno.trim()
    if (apellido_materno.trim()) params.apellido_materno = apellido_materno.trim()
    if (razon_social.trim()) params.razon_social = razon_social.trim()
    if (numero_documento.trim()) params.numero_documento = numero_documento.trim()
    if (documento.trim()) params.documento = documento.trim()

    return useQuery({
        queryKey: [
            "taxes-personas",
            page,
            nombres.trim(),
            apellido_paterno.trim(),
            apellido_materno.trim(),
            razon_social.trim(),
            numero_documento.trim(),
            documento.trim(),
        ],
        queryFn: () => personasService.get(access, params),
        enabled: enabled && !!access,
    })
}

export default useGetPersonas
