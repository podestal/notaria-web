import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { ArrowLeft, Compass } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'

const SPARKLES = [
    { left: '14%', top: '18%', duration: 5.2, delay: 0 },
    { left: '78%', top: '22%', duration: 6.1, delay: 0.9 },
    { left: '88%', top: '68%', duration: 4.8, delay: 0.4 },
    { left: '22%', top: '76%', duration: 5.6, delay: 1.8 },
    { left: '52%', top: '42%', duration: 7, delay: 1.3 },
]

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
}

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const NotFoundPage = () => {
    return (
        <div className="keep-dark relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-indigo-950 px-6 py-16 text-white">
            <ThemeToggle className="absolute right-5 top-5 z-20 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" />

            <motion.div
                className="pointer-events-none absolute -left-28 -top-28 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/30 blur-3xl"
                animate={{ x: [0, 50, 0], y: [0, 36, 0], scale: [1, 1.12, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="pointer-events-none absolute -bottom-36 -right-20 h-[32rem] w-[32rem] rounded-full bg-sky-400/20 blur-3xl"
                animate={{ x: [0, -40, 0], y: [0, -28, 0], scale: [1.05, 1, 1.05] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-400/25 blur-3xl"
                animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.12, 0.92] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
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
                className="relative z-10 flex w-full max-w-lg flex-col items-center text-center"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3">
                    <motion.img
                        src="/signatium.png"
                        alt="Signatum"
                        className="h-11 w-11 rounded-full shadow-lg shadow-black/25 ring-2 ring-white/30"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span className="text-xl font-semibold tracking-tight">Signatum</span>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    className="relative mb-2"
                    aria-hidden
                >
                    <motion.p
                        className="select-none text-[7.5rem] font-bold leading-none tracking-tighter text-white/15 sm:text-[10rem]"
                        animate={{ opacity: [0.12, 0.22, 0.12] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        404
                    </motion.p>
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur-sm sm:h-20 sm:w-20">
                            <Compass className="h-8 w-8 text-white sm:h-10 sm:w-10" strokeWidth={1.5} />
                        </span>
                    </motion.div>
                </motion.div>

                <motion.h1
                    variants={fadeUp}
                    className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
                >
                    Página no encontrada
                </motion.h1>
                <motion.p
                    variants={fadeUp}
                    className="mt-3 max-w-md text-sm leading-relaxed text-indigo-100/90 sm:text-base"
                >
                    La ruta que buscas no existe o fue movida. Vuelve al inicio de sesión para continuar.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-10 w-full max-w-xs">
                    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                        <Link
                            to="/"
                            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg shadow-black/20 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
                        >
                            <motion.span
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-violet-200/50 to-transparent"
                                initial={{ left: '-40%' }}
                                animate={{ left: '140%' }}
                                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
                            />
                            <ArrowLeft className="relative h-4 w-4" aria-hidden />
                            <span className="relative">Volver al inicio de sesión</span>
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.p variants={fadeUp} className="mt-12 text-xs text-indigo-200/60">
                    © {new Date().getFullYear()} Signatum
                </motion.p>
            </motion.div>
        </div>
    )
}

export default NotFoundPage
