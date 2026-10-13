import { useState, type ReactNode } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useAnimationControls, type Variants } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, FileSignature, Loader2, Lock, ShieldCheck, User, Users } from 'lucide-react';
import useLogin from '../../hooks/auth/useLogin';
import useUserInfoStore from '../../hooks/store/useGetUserInfo';
import { queryClient } from '../../queryClient';
import ThemeToggle from '../ui/ThemeToggle';

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
            className={`group flex items-center gap-2.5 rounded-xl border bg-white px-3.5 transition focus-within:ring-4 ${
                error
                    ? 'border-rose-300 focus-within:border-rose-400 focus-within:ring-rose-100'
                    : 'border-slate-200 focus-within:border-violet-400 focus-within:ring-violet-100'
            }`}
        >
            <span className={`transition-colors duration-200 ${error ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-violet-500'}`}>{icon}</span>
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

const SPARKLES = [
    { left: '18%', top: '22%', duration: 5, delay: 0 },
    { left: '72%', top: '16%', duration: 6, delay: 1.2 },
    { left: '84%', top: '58%', duration: 4.5, delay: 0.6 },
    { left: '30%', top: '78%', duration: 5.5, delay: 2 },
    { left: '58%', top: '44%', duration: 7, delay: 1.6 },
]

const asideContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const formContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const fadeRight: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

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
    const shake = useAnimationControls();

    const shakeForm = () => {
        shake.start({ x: [0, -10, 10, -7, 7, -3, 3, 0], transition: { duration: 0.45 } });
    };

    const handleLogin = (e: React.FormEvent ) => {

      e.preventDefault()
      setMessageError('')

      if (!username) {
        setUsernameError('El nombre de usuario es requerido');
        shakeForm();
        return;
      } 

      if (!password) {
        setPasswordError('La contraseña es requerida');
        shakeForm();
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
                shakeForm();
            },
            onSettled: () => {
                setLoading(false);
            }
        })
    }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
        <aside className="keep-dark relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-indigo-900 lg:flex">
            <motion.div
                className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl"
                animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="pointer-events-none absolute -bottom-32 -right-16 h-[28rem] w-[28rem] rounded-full bg-sky-400/20 blur-3xl"
                animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1.05, 1, 1.05] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
                animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            {SPARKLES.map((s, i) => (
                <motion.span
                    key={i}
                    className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                    style={{ left: s.left, top: s.top }}
                    animate={{ y: [0, -18, 0], opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: s.duration, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
                />
            ))}

            <motion.div
                className="relative z-10 flex w-full flex-col justify-between p-12 text-white xl:p-16"
                variants={asideContainer}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={fadeUp} className="flex items-center gap-3">
                    <motion.img
                        src="/signatium.png"
                        alt="Signatum"
                        className="h-11 w-11 rounded-full shadow-lg shadow-black/20 ring-2 ring-white/30"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        whileHover={{ rotate: 12, scale: 1.08 }}
                    />
                    <span className="text-xl font-semibold tracking-tight">Signatum</span>
                </motion.div>

                <div className="max-w-md">
                    <motion.h1 variants={fadeUp} className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                        La gestión notarial,{' '}
                        <span className="bg-gradient-to-r from-fuchsia-200 via-white to-sky-200 bg-clip-text text-transparent">
                            simple y segura.
                        </span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="mt-4 text-base text-indigo-100/90">
                        Todo el trabajo de la notaría en una sola plataforma.
                    </motion.p>
                    <ul className="mt-10 space-y-4">
                        {FEATURES.map(({ icon: Icon, text }) => (
                            <motion.li
                                key={text}
                                variants={fadeRight}
                                whileHover={{ x: 6 }}
                                className="flex items-start gap-3"
                            >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
                                    <Icon className="h-4 w-4" aria-hidden />
                                </span>
                                <span className="text-sm text-indigo-50">{text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                <motion.p variants={fadeUp} className="text-xs text-indigo-200/70">© {new Date().getFullYear()} Signatum</motion.p>
            </motion.div>
        </aside>

        <main className="relative flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
            <ThemeToggle className="absolute right-5 top-5 border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700" />
            <motion.div animate={shake} className="w-full max-w-sm">
            <motion.div
                variants={formContainer}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={fadeUp} className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
                    <motion.img
                        src="/signatium.png"
                        alt="Signatum"
                        className="mb-5 h-14 w-14 rounded-full shadow-lg shadow-violet-500/30 lg:hidden"
                        initial={{ scale: 0.5, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                    />
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bienvenido de nuevo</h2>
                    <p className="mt-1.5 text-sm text-slate-500">Ingrese sus credenciales para continuar.</p>
                </motion.div>

                <form onSubmit={handleLogin} noValidate className="space-y-5">
                    <AnimatePresence>
                        {messageError && (
                            <motion.div
                                key="login-error"
                                role="alert"
                                className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            >
                                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                                {messageError}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={fadeUp}>
                    <LoginField
                        id="login-username"
                        label="Usuario"
                        icon={<User className="h-4 w-4" aria-hidden />}
                        value={username}
                        onChange={(v) => { setUsername(v); setUsernameError(''); }}
                        error={usernameError}
                        autoComplete="username"
                    />
                    </motion.div>

                    <motion.div variants={fadeUp}>
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
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={showPassword ? 'hide' : 'show'}
                                        className="block"
                                        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </motion.span>
                                </AnimatePresence>
                            </button>
                        }
                    />
                    </motion.div>

                    <motion.div variants={fadeUp}>
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={loading ? undefined : { y: -2, boxShadow: '0 16px 30px -10px rgba(99, 102, 241, 0.55)' }}
                        whileTap={loading ? undefined : { scale: 0.98 }}
                        className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-wait disabled:opacity-80"
                    >
                        {!loading && (
                            <motion.span
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ left: '-40%' }}
                                animate={{ left: '140%' }}
                                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                            />
                        )}
                        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                        <span className="relative">{loading ? 'Ingresando…' : 'Ingresar'}</span>
                        {!loading && (
                            <motion.span
                                className="relative"
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <ArrowRight className="h-4 w-4" aria-hidden />
                            </motion.span>
                        )}
                    </motion.button>
                    </motion.div>
                </form>

                <motion.p variants={fadeUp} className="mt-10 text-center text-xs text-slate-400 lg:text-left">
                    ¿Problemas para ingresar? Contacte al administrador del sistema.
                </motion.p>
            </motion.div>
            </motion.div>
        </main>
    </div>
  );
};

export default Login;
