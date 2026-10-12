interface Props {
    message?: string
    description?: string
    fullScreen?: boolean
}

const LoadingState = ({ message = 'Un momento…', description = 'Cargando información', fullScreen = false }: Props) => {
  return (
    <div
        role="status"
        aria-live="polite"
        className={`flex flex-col items-center justify-center gap-4 px-4 ${fullScreen ? 'min-h-screen' : 'py-16'}`}
    >
        <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600/40" />
            <div className="absolute inset-[14px] animate-pulse rounded-full bg-blue-600/15" />
        </div>
        <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">{message}</p>
            {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
        </div>
    </div>
  )
}

export default LoadingState
