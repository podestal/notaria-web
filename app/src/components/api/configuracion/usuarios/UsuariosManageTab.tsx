import { useMemo, useState } from "react"
import useAuthStore from "../../../../store/useAuthStore"
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo"
import useGetMapUsers from "../../../../hooks/api/users/useGetMapUsers"
import { getUsuarioDisplayName } from "../../../../services/api/usuariosService"
import UserMappingCard from "../userMapping/UserMappingCard"

type StatusFilter = "all" | "active" | "inactive"

const filterInputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"

const includesTerm = (value: string | null | undefined, term: string) => {
    if (!term) return true
    return (value || "").toLowerCase().includes(term)
}

const UsuariosManageTab = () => {
    const currentUser = useUserInfoStore((s) => s.user)
    const canLoadUsers =
        Number(currentUser?.is_superuser) !== 0 || Number(currentUser?.is_staff) !== 0
    const isSuperuser = Number(currentUser?.is_superuser) !== 0
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error, isFetching } = useGetMapUsers({
        access,
        enabled: canLoadUsers,
    })
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [status, setStatus] = useState<StatusFilter>("active")
    const users = data ?? []

    const usernameTerm = username.trim().toLowerCase()
    const firstNameTerm = firstName.trim().toLowerCase()
    const lastNameTerm = lastName.trim().toLowerCase()
    const hasTextFilter = Boolean(usernameTerm || firstNameTerm || lastNameTerm)

    const filteredUsers = useMemo(() => {
        return [...users]
            .filter((user) => {
                if (status === "active" && !user.is_active) return false
                if (status === "inactive" && user.is_active) return false
                if (!includesTerm(user.username, usernameTerm)) return false
                if (!includesTerm(user.first_name, firstNameTerm)) return false
                if (!includesTerm(user.last_name, lastNameTerm)) return false
                return true
            })
            .sort((a, b) =>
                getUsuarioDisplayName(a).localeCompare(getUsuarioDisplayName(b), "es"),
            )
    }, [users, usernameTerm, firstNameTerm, lastNameTerm, status])

    const activeCount = users.filter((user) => user.is_active).length
    const inactiveCount = users.length - activeCount

    return (
        <section className="space-y-4 bg-slate-50/50 p-4 sm:p-5">
            <p className="text-xs text-slate-500">
                {isSuperuser
                    ? "Filtre la lista, active o desactive usuarios y marque qué protocolares puede hacer cada uno."
                    : "Filtre la lista de usuarios. Un superusuario puede cambiar el estado y los protocolares."}
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <label className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Username
                    </span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="usuario"
                        className={filterInputClass}
                    />
                </label>
                <label className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Nombre
                    </span>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="nombre"
                        className={filterInputClass}
                    />
                </label>
                <label className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Apellido
                    </span>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="apellido"
                        className={filterInputClass}
                    />
                </label>
            </div>

            <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filtrar por estado"
            >
                {(
                    [
                        { id: "active" as const, label: "Activo", count: activeCount },
                        { id: "inactive" as const, label: "Inactivo", count: inactiveCount },
                        { id: "all" as const, label: "Todos", count: users.length },
                    ] as const
                ).map((item) => {
                    const selected = status === item.id
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setStatus(item.id)}
                            aria-pressed={selected}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                selected
                                    ? "bg-sky-600 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700"
                            }`}
                        >
                            {item.label}
                            <span className={selected ? "ml-1 text-sky-100" : "ml-1 text-slate-400"}>
                                {item.count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {users.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-700">
                        {filteredUsers.length} usuario
                        {filteredUsers.length === 1 ? "" : "s"}
                        {filteredUsers.length !== users.length
                            ? ` de ${users.length}`
                            : ""}
                    </span>
                    {isFetching && !isLoading && (
                        <span className="text-slate-500">Actualizando…</span>
                    )}
                </div>
            )}

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
                    {hasTextFilter || status !== "all"
                        ? "No hay usuarios que coincidan con los filtros."
                        : "No hay usuarios registrados."}
                </p>
            )}

            {!isLoading && filteredUsers.length > 0 && (
                <ul className="space-y-3">
                    {filteredUsers.map((user) => (
                        <li key={user.idusuario}>
                            <UserMappingCard
                                user={user}
                                showLinking={false}
                                showProtocolar={isSuperuser}
                                showStatusToggle={isSuperuser}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default UsuariosManageTab
