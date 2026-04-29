import { ChangeEvent, useMemo, useState } from "react";
import { RiEyeFill, RiEyeOffFill } from "@remixicon/react";
import SimpleInput from "../ui/SimpleInput";
import useNotificationsStore from "../../hooks/store/useNotificationsStore";
import useCreateUser from "../../hooks/auth/useCreateUser";
import { CreateUserPayload } from "../../services/auth/createUserService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateUser = () => {
    const [form, setForm] = useState<CreateUserPayload>({
        username: "",
        email: "",
        password: "",
        notary: false,
        first_name: "",
        last_name: "",
    });
    const [errors, setErrors] = useState<Record<keyof CreateUserPayload, string>>({
        username: "",
        email: "",
        password: "",
        notary: "",
        first_name: "",
        last_name: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const createUser = useCreateUser();

    const { setMessage, setShow, setType } = useNotificationsStore();

    const canSubmit = useMemo(() => !loading, [loading]);

    const setField = <K extends keyof CreateUserPayload>(field: K, value: CreateUserPayload[K]) => {
        setForm((prev: CreateUserPayload) => ({ ...prev, [field]: value }));
        setErrors((prev: Record<keyof CreateUserPayload, string>) => ({ ...prev, [field]: "" }));
        if (field === "password") setConfirmPasswordError("");
    };

    const validate = () => {
        const nextErrors: Record<keyof CreateUserPayload, string> = {
            username: "",
            email: "",
            password: "",
            notary: "",
            first_name: "",
            last_name: "",
        };

        if (!form.username.trim()) nextErrors.username = "Username es requerido";
        if (!form.first_name.trim()) nextErrors.first_name = "Nombre es requerido";
        if (!form.last_name.trim()) nextErrors.last_name = "Apellido es requerido";
        if (!form.email.trim()) nextErrors.email = "Email es requerido";
        else if (!emailRegex.test(form.email.trim())) nextErrors.email = "Email no valido";

        if (!form.password) nextErrors.password = "Password es requerido";
        else if (form.password.length < 8) nextErrors.password = "Minimo 8 caracteres";

        if (!confirmPassword) setConfirmPasswordError("Confirme el password");
        else if (confirmPassword !== form.password) {
            setConfirmPasswordError("Los passwords no coinciden");
        } else {
            setConfirmPasswordError("");
        }

        setErrors(nextErrors);
        const isBaseValid = Object.values(nextErrors).every((error) => !error);
        const isConfirmValid = confirmPassword.length > 0 && confirmPassword === form.password;
        return isBaseValid && isConfirmValid;
    };

    const resetForm = () => {
        setForm({
            username: "",
            email: "",
            password: "",
            notary: false,
            first_name: "",
            last_name: "",
        });
        setErrors({
            username: "",
            email: "",
            password: "",
            notary: "",
            first_name: "",
            last_name: "",
        });
        setConfirmPassword("");
        setConfirmPasswordError("");
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        if (!validate()) return;

        setLoading(true);
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
            });
            setType("success");
            setMessage("Usuario creado exitosamente");
            setShow(true);
            resetForm();
        } catch (error: any) {
            const backendMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "Error al crear usuario";
            setType("error");
            setMessage(String(backendMessage));
            setShow(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full">
            <div className="overflow-hidden rounded-xl bg-white p-4">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
                    <h2 className="text-lg font-semibold text-slate-800">Crear nuevo usuario</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Complete los datos obligatorios para registrar un nuevo usuario.
                    </p>
                </div>

                <div className="space-y-6 px-6 py-6 sm:px-8">
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <SimpleInput
                    label="Username"
                    value={form.username}
                    setValue={(value) => setField("username", value)}
                    error={errors.username}
                    horizontal
                    required
                    fullWidth
                />
                <SimpleInput
                    label="Email"
                    value={form.email}
                    setValue={(value) => setField("email", value)}
                    error={errors.email}
                    horizontal
                    required
                    fullWidth
                />
                <div className="grid grid-cols-3 items-center gap-6">
                    <label className="pl-2 block text-xs font-semibold text-slate-700">
                        Password
                    </label>
                    <div className="col-span-2">
                        <div className="flex items-center gap-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setField("password", e.target.value)
                                }
                                className={`w-full rounded-md border bg-white py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 ${
                                    errors.password
                                        ? "border-red-500 focus:ring-red-300"
                                        : "border-slate-300 focus:ring-blue-300"
                                }`}
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev: boolean) => !prev)}
                                className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100"
                            >
                                {showPassword ? (
                                    <RiEyeOffFill className="size-5 shrink-0 text-blue-600" />
                                ) : (
                                    <RiEyeFill className="size-5 shrink-0 text-blue-600" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 px-2 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-6">
                    <label className="pl-2 block text-xs font-semibold text-slate-700">
                        Confirmar Password
                    </label>
                    <div className="col-span-2">
                        <div className="flex items-center gap-2">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmPasswordError("");
                                }}
                                className={`w-full rounded-md border bg-white py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 ${
                                    confirmPasswordError
                                        ? "border-red-500 focus:ring-red-300"
                                        : "border-slate-300 focus:ring-blue-300"
                                }`}
                                placeholder="Repita el password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev: boolean) => !prev)}
                                className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100"
                            >
                                {showConfirmPassword ? (
                                    <RiEyeOffFill className="size-5 shrink-0 text-blue-600" />
                                ) : (
                                    <RiEyeFill className="size-5 shrink-0 text-blue-600" />
                                )}
                            </button>
                        </div>
                        {confirmPasswordError && (
                            <p className="mt-1 px-2 text-xs text-red-500">{confirmPasswordError}</p>
                        )}
                    </div>
                </div>
                <SimpleInput
                    label="Nombre"
                    value={form.first_name}
                    setValue={(value) => setField("first_name", value)}
                    error={errors.first_name}
                    horizontal
                    required
                    fullWidth
                />
                <SimpleInput
                    label="Apellido"
                    value={form.last_name}
                    setValue={(value) => setField("last_name", value)}
                    error={errors.last_name}
                    horizontal
                    required
                    fullWidth
                />
                    </div>

                    {/* <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3 sm:items-center">
                            <label className="pl-2 block text-xs font-semibold text-slate-700">
                                Tipo de usuario
                            </label>
                            <div className="sm:col-span-2">
                        <select
                            value={form.notary === null ? "" : form.notary ? "true" : "false"}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                setField(
                                    "notary",
                                    e.target.value === "" ? null : e.target.value === "true"
                                )
                            }
                            className={`w-full rounded-md border bg-white py-2 px-3 text-slate-700 focus:outline-none focus:ring-2 ${
                                errors.notary
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-slate-300 focus:ring-blue-300"
                            }`}
                        >
                            <option value="">Seleccione</option>
                            <option value="true">Notario</option>
                            <option value="false">Usuario normal</option>
                        </select>
                        {errors.notary && (
                            <p className="mt-1 px-2 text-xs text-red-500">{errors.notary}</p>
                        )}
                            </div>
                        </div>
                    </div> */}
                </div>

                <div className="flex items-center m-4 justify-end border-t border-slate-200 pt-5">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creando..." : "Crear usuario"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;