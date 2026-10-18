import { ChangeEvent, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import useNotificationsStore from "../../hooks/store/useNotificationsStore"
import useCreateUser from "../../hooks/auth/useCreateUser"
import { CreateUserPayload } from "../../services/auth/createUserService"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldShell =
    "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 transition-shadow focus-within:border-sky-300 focus-within:shadow-md focus-within:shadow-sky-100"

const inputClass =
    "w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"

const inputErrorClass =
    "w-full min-w-0 rounded-md border border-rose-400 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"

const CreateUser = () => {
    const [form, setForm] = useState<CreateUserPayload>({
        username: "",
        email: "",
        password: "",
        notary: false,
        first_name: "",
        last_name: "",
    })
    const [errors, setErrors] = useState<Record<keyof CreateUserPayload, string>>({
        username: "",
        email: "",
        password: "",
        notary: "",
        first_name: "",
        last_name: "",
    })
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const createUser = useCreateUser()

    const { setMessage, setShow, setType } = useNotificationsStore()

    const canSubmit = useMemo(() => !loading, [loading])

    const setField = <K extends keyof CreateUserPayload>(field: K, value: CreateUserPayload[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: "" }))
        if (field === "password") setConfirmPasswordError("")
    }

    const validate = () => {
        const nextErrors: Record<keyof CreateUserPayload, string> = {
            username: "",
            email: "",
            password: "",
            notary: "",
            first_name: "",
            last_name: "",
        }

        if (!form.username.trim()) nextErrors.username = "Username es requerido"
        if (!form.first_name.trim()) nextErrors.first_name = "Nombre es requerido"
        if (!form.last_name.trim()) nextErrors.last_name = "Apellido es requerido"
        if (!form.email.trim()) nextErrors.email = "Email es requerido"
        else if (!emailRegex.test(form.email.trim())) nextErrors.email = "Email no válido"

        if (!form.password) nextErrors.password = "Password es requerido"
        else if (form.password.length < 8) nextErrors.password = "Mínimo 8 caracteres"

        if (!confirmPassword) setConfirmPasswordError("Confirme el password")
        else if (confirmPassword !== form.password) {
            setConfirmPasswordError("Los passwords no coinciden")
        } else {
            setConfirmPasswordError("")
        }

        setErrors(nextErrors)
        const isBaseValid = Object.values(nextErrors).every((error) => !error)
        const isConfirmValid = confirmPassword.length > 0 && confirmPassword === form.password
        return isBaseValid && isConfirmValid
    }

    const resetForm = () => {
        setForm({
            username: "",
            email: "",
            password: "",
            notary: false,
            first_name: "",
            last_name: "",
        })
        setErrors({
            username: "",
            email: "",
            password: "",
            notary: "",
            first_name: "",
            last_name: "",
        })
        setConfirmPassword("")
        setConfirmPasswordError("")
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!canSubmit) return
        if (!validate()) return

        setLoading(true)
        try {
            await createUser.mutateAsync({
                user: {
                    ...form,
                    username: form.username.trim(),
                    email: form.email.trim().toLowerCase(),
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    notary: 2,
                },
            })
            setType("success")
            setMessage("Usuario creado exitosamente")
            setShow(true)
            resetForm()
        } catch (error: any) {
            const backendMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "Error al crear usuario"
            setType("error")
            setMessage(String(backendMessage))
            setShow(true)
        } finally {
            setLoading(false)
        }
    }

    const Field = ({
        label,
        required,
        error,
        index,
        children,
    }: {
        label: string
        required?: boolean
        error?: string
        index: number
        children: React.ReactNode
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.05 + index * 0.04 }}
            className="space-y-1"
        >
            <label className={fieldShell}>
                <span className="min-w-[6.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                    {required ? <span className="text-rose-500"> *</span> : null}
                </span>
                {children}
            </label>
            {error ? <p className="px-1 text-[11px] text-rose-500">{error}</p> : null}
        </motion.div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
            <div className="keep-dark relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-100">
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.45, 0.75, 0.45] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex items-center gap-3">
                    <motion.div
                        initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
                        className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5"
                    >
                        <UserPlus className="text-sky-300" size={22} />
                    </motion.div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Configuración</p>
                        <h1 className="text-lg font-semibold text-white">Crear usuario</h1>
                        <p className="mt-0.5 text-xs text-slate-400">
                            Complete los datos obligatorios para registrar un nuevo usuario
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50/50 p-4 sm:p-5">
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-800">Datos de acceso</h3>
                        <p className="mt-0.5 text-xs text-slate-500">Credenciales y nombre del usuario</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 p-4 md:grid-cols-2">
                        <Field label="Username" required error={errors.username} index={0}>
                            <input
                                value={form.username}
                                onChange={(e) => setField("username", e.target.value)}
                                className={errors.username ? inputErrorClass : inputClass}
                                placeholder="usuario"
                            />
                        </Field>
                        <Field label="Email" required error={errors.email} index={1}>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                className={errors.email ? inputErrorClass : inputClass}
                                placeholder="correo@ejemplo.com"
                            />
                        </Field>
                        <Field label="Nombre" required error={errors.first_name} index={2}>
                            <input
                                value={form.first_name}
                                onChange={(e) => setField("first_name", e.target.value)}
                                className={errors.first_name ? inputErrorClass : inputClass}
                            />
                        </Field>
                        <Field label="Apellido" required error={errors.last_name} index={3}>
                            <input
                                value={form.last_name}
                                onChange={(e) => setField("last_name", e.target.value)}
                                className={errors.last_name ? inputErrorClass : inputClass}
                            />
                        </Field>
                        <Field label="Password" required error={errors.password} index={4}>
                            <div className="flex w-full min-w-0 items-center gap-1.5">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setField("password", e.target.value)
                                    }
                                    className={errors.password ? inputErrorClass : inputClass}
                                    placeholder="Mín. 8 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="shrink-0 rounded-md border border-slate-300 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-sky-600"
                                    aria-label={showPassword ? "Ocultar password" : "Mostrar password"}
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </Field>
                        <Field label="Confirmar" required error={confirmPasswordError} index={5}>
                            <div className="flex w-full min-w-0 items-center gap-1.5">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setConfirmPassword(e.target.value)
                                        setConfirmPasswordError("")
                                    }}
                                    className={confirmPasswordError ? inputErrorClass : inputClass}
                                    placeholder="Repita el password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="shrink-0 rounded-md border border-slate-300 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-sky-600"
                                    aria-label={
                                        showConfirmPassword ? "Ocultar password" : "Mostrar password"
                                    }
                                >
                                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </Field>
                    </div>
                </motion.section>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
                >
                    <p className="text-[11px] text-slate-400">
                        Los campos marcados con * son obligatorios
                    </p>
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={loading ? undefined : { y: -1 }}
                        whileTap={loading ? undefined : { scale: 0.96 }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-700 bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Creando...
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-3.5 w-3.5" />
                                Crear usuario
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </motion.div>
    )
}

export default CreateUser
