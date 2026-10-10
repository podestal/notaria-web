import { useState, type ReactNode } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, FileSignature, Loader2, Lock, ShieldCheck, User, Users } from 'lucide-react';
import useLogin from '../../hooks/auth/useLogin';
import useUserInfoStore from '../../hooks/store/useGetUserInfo';
import { queryClient } from '../../queryClient';

interface DecodedToken {
    user_id: number;
}

interface LoginFieldProps {
    id: string
    label: string
    icon: ReactNode
    value: string
    onChange: (value: string) => void
    error: string
    type?: string
    autoComplete?: string
    trailing?: ReactNode
}

const LoginField = ({ id, label, icon, value, onChange, error, type = 'text', autoComplete, trailing }: LoginFieldProps) => (
    <div className="space-y-1.5">
        <label htmlFor={id} className="block text-xs font-semibold text-slate-600">
            {label}
        </label>
        <div
            className={`flex items-center gap-2.5 rounded-xl border bg-white px-3.5 transition focus-within:ring-4 ${
                error
                    ? 'border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100'
                    : 'border-slate-200 focus-within:border-violet-400 focus-within:ring-violet-100'
            }`}
        >
            <span className={error ? 'text-rose-400' : 'text-slate-400'}>{icon}</span>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete={autoComplete}
                aria-invalid={Boolean(error)}
                className="w-full bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {trailing}
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
)

const FEATURES = [
    { icon: FileSignature, text: 'Kardex, escrituración y extraprotocolares en un solo lugar' },
    { icon: Users, text: 'Clientes y contratantes siempre sincronizados' },
    { icon: ShieldCheck, text: 'Reportes SISGEN, UIF y PDT listos para enviar' },
]

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {setTokens, setUserId, clearTokens} = useAuthStore()
    const setUser = useUserInfoStore(s => s.setUser)
    const navigate = useNavigate()

    const login = useLogin()
    const [loading, setLoading] = useState(false);

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [messageError, setMessageError] = useState('');

    const handleLogin = (e: React.FormEvent ) => {

      e.preventDefault()
      setMessageError('')

      if (!username) {
        setUsernameError('El nombre de usuario es requerido');
        return;
      } 

      if (!password) {
        setPasswordError('La contraseña es requerida');
        return;
      }

      setLoading(true);

      login.mutate({
            credentials: {
                username: username,
                password: password
            }
        }, {
            onSuccess: (jwtData) => {
                const decoded = jwtDecode<DecodedToken>(jwtData.access)
                clearTokens()
                setUser(null)
                queryClient.clear()
                setTokens(jwtData.access, jwtData.refresh)
                setUserId(decoded.user_id)
                navigate('/app/panel-general')
            },
            onError: (err) => {
                console.error('Login error:', err);
                setMessageError('Usuario o contraseña incorrectos');
            },
            onSettled: () => {
                setLoading(false);
            }
        })
    }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
        <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-indigo-900 lg:flex">
            <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-sky-400/20 blur-3xl" />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <motion.div
                className="relative z-10 flex w-full flex-col justify-between p-12 text-white xl:p-16"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-3">
                    <img src="/signatium.png" alt="Signatum" className="h-11 w-11 rounded-full shadow-lg shadow-black/20 ring-2 ring-white/30" />
                    <span className="text-xl font-semibold tracking-tight">Signatum</span>
                </div>

                <div className="max-w-md">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                        La gestión notarial, simple y segura.
                    </h1>
                    <p className="mt-4 text-base text-indigo-100/90">
                        Todo el trabajo de la notaría en una sola plataforma.
                    </p>
                    <ul className="mt-10 space-y-4">
                        {FEATURES.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                                    <Icon className="h-4 w-4" aria-hidden />
                                </span>
                                <span className="text-sm text-indigo-50">{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-xs text-indigo-200/70">© {new Date().getFullYear()} Signatum</p>
            </motion.div>
        </aside>

        <main className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
            <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
                    <img src="/signatium.png" alt="Signatum" className="mb-5 h-14 w-14 rounded-full shadow-lg shadow-violet-500/30 lg:hidden" />
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bienvenido de nuevo</h2>
                    <p className="mt-1.5 text-sm text-slate-500">Ingrese sus credenciales para continuar.</p>
                </div>

                <form onSubmit={handleLogin} noValidate className="space-y-5">
                    {messageError && (
                        <motion.div
                            role="alert"
                            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                            {messageError}
                        </motion.div>
                    )}

                    <LoginField
                        id="login-username"
                        label="Usuario"
                        icon={<User className="h-4 w-4" aria-hidden />}
                        value={username}
                        onChange={(v) => { setUsername(v); setUsernameError(''); }}
                        error={usernameError}
                        autoComplete="username"
                    />

                    <LoginField
                        id="login-password"
                        label="Contraseña"
                        icon={<Lock className="h-4 w-4" aria-hidden />}
                        value={password}
                        onChange={(v) => { setPassword(v); setPasswordError(''); }}
                        error={passwordError}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        trailing={
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="text-slate-400 transition hover:text-slate-600"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-wait disabled:opacity-80"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                        {loading ? 'Ingresando…' : 'Ingresar'}
                    </button>
                </form>

                <p className="mt-10 text-center text-xs text-slate-400 lg:text-left">
                    ¿Problemas para ingresar? Contacte al administrador del sistema.
                </p>
            </motion.div>
        </main>
    </div>
  );
};

export default Login;
