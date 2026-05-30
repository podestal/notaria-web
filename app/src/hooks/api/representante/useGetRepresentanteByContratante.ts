import { useQuery, UseQueryResult } from '@tanstack/react-query'
import getRepresentantesService, { Representante } from '../../../services/api/representantesService'
import useAuthStore from '../../../store/useAuthStore'

interface Props {
    idcontratante: string
    kardex?: string
    enabled?: boolean
}

const useGetRepresentanteByContratante = ({
    idcontratante,
    kardex,
    enabled = true,
}: Props): UseQueryResult<Representante | null, Error> => {
    const access = useAuthStore((state) => state.access_token) || ''
    const representantesService = getRepresentantesService({ byContratante: true })

    return useQuery({
        queryKey: ['representante', 'by_contratante', idcontratante, kardex],
        queryFn: async () => {
            const params: Record<string, string> = { idcontratante }
            if (kardex) params.kardex = kardex
            const data = await representantesService.get(access, params)
            if (!data || typeof data !== 'object' || !('id' in data) || !data.id) {
                return null
            }
            return data as Representante
        },
        enabled: enabled && !!idcontratante && !!access,
    })
}

export default useGetRepresentanteByContratante
