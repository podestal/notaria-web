import { useMemo, useState } from "react"
import { Navigate } from "react-router-dom"
import useAuthStore from "../../../../store/useAuthStore"
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo"
import useGetMapUsers from "../../../../hooks/api/users/useGetMapUsers"
import { getUsuarioDisplayName } from "../../../../services/api/usuariosService"
import UserMappingCard from "./UserMappingCard"

const userNeedsMapping = (user: {
    taxes_usuario_id: number | null
    negocio_id: number | null
}) => user.taxes_usuario_id == null || user.negocio_id == null

const UserMappingMain = () => {
    const user = useUserInfoStore((s) => s.user)
    const isSuperuser = Number(user?.is_superuser) !== 0
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error, isFetching } = useGetMapUsers({
        access,
        enabled: isSuperuser,
    })
    const [search, setSearch] = useState("")

    const users = data ?? []

    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return users
        return users.filter((user) =>
            [
                user.username,
                user.email,
                user.first_name,
                user.last_name,
                String(user.idusuario),
                user.taxes_usuario_id != null ? String(user.taxes_usuario_id) : "",
                user.negocio_id != null ? String(user.negocio_id) : "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(term),
        )
    }, [users, search])

    const pendingCount = useMemo(
        () => users.filter(userNeedsMapping).length,
        [users],
    )

    if (!isSuperuser) {
        return <Navigate to="/app/protocolares" replace />
    }

    return (
        <section className="space-y-4 px-4 py-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Enlazar usuarios</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Revise qué usuarios del core aún no tienen enlace con taxes o negocio.
                    </p>
                </div>
            </header>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nombre, usuario, email o ID…"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 sm:max-w-md"
                    />
                    {users.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-700">
                                {users.length} usuario{users.length === 1 ? "" : "s"}
                            </span>
                            {pendingCount > 0 && (
                                <span className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-800">
                                    {pendingCount} pendiente{pendingCount === 1 ? "" : "s"} de enlace
                                </span>
                            )}
                            {isFetching && !isLoading && (
                                <span className="text-slate-500">Actualizando…</span>
                            )}
                        </div>
                    )}
                </div>

                {isLoading && (
                    <p className="py-10 text-center text-sm text-slate-500 animate-pulse">
                        Cargando usuarios…
                    </p>
                )}

                {isError && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                        {error instanceof Error
                            ? error.message
                            : "No se pudo cargar los usuarios."}
                    </p>
                )}

                {!isLoading && !isError && filteredUsers.length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                        {search.trim()
                            ? "No hay usuarios que coincidan con la búsqueda."
                            : "No hay usuarios registrados."}
                    </p>
                )}

                {!isLoading && filteredUsers.length > 0 && (
                    <ul className="space-y-3">
                        {[...filteredUsers]
                            .sort((a, b) => {
                                const aPending = userNeedsMapping(a)
                                const bPending = userNeedsMapping(b)
                                if (aPending !== bPending) return aPending ? -1 : 1
                                return getUsuarioDisplayName(a).localeCompare(
                                    getUsuarioDisplayName(b),
                                    "es",
                                )
                            })
                            .map((user) => (
                                <li key={user.idusuario}>
                                    <UserMappingCard user={user} />
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        </section>
    )
}

export default UserMappingMain
