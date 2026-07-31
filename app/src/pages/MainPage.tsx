import Header from '../router/Header'
import useGetTipoKardexList from '../hooks/api/tipoKardex/useGetTipoKardexList'
import { useEffect } from 'react'
import useKardexTypesStore from '../hooks/store/useKardexTypesStore'
import useNotificationsStore from '../hooks/store/useNotificationsStore'
import NotificationCard from '../components/ui/NotificationCard'
import { Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const MainPage = () => {

  const setKardexTypes = useKardexTypesStore(s => s.setKardexTypes)
  const { data: kardexTypes, isLoading, isError, error, isSuccess } = useGetTipoKardexList()
  const { notifications, removeNotification } = useNotificationsStore()
  const isTestApp = import.meta.env.MODE === 'test'
  const visibleKardexTypes = (kardexTypes || []).filter(kardexType => kardexType.idtipkar <= 5)
  const persistentNotification = [...notifications].reverse().find((n) => n.persistent) ?? null
  const toastNotifications = notifications.filter((n) => !n.persistent)

  useEffect(() => {
    if (isSuccess) {
      setKardexTypes(visibleKardexTypes)
    }
  }, [visibleKardexTypes, isSuccess, setKardexTypes])

  if (isLoading) return <p>Un momento</p>
  if (isError) return <p>Error: {error.message}</p>
  if (isSuccess) 

  return (
    <div className="min-h-screen bg-slate-100">
      <Header 
        kardexTypes={visibleKardexTypes}
      />
      <main className="ml-56 min-h-screen min-w-0 bg-slate-100">
        {isTestApp && (
          <div className="sticky top-0 z-50 border-b border-amber-300 bg-amber-100/95 px-4 py-2 text-center text-xs font-semibold tracking-wide text-amber-900 backdrop-blur">
            ENTORNO DE PRUEBAS: Esta aplicación es de test y no corresponde al sistema real de producción.
          </div>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {persistentNotification && (
            <motion.div
              key={persistentNotification.id}
              className="sticky top-0 z-[70] border-b border-amber-200/80 bg-slate-100/95 px-4 py-2 backdrop-blur"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              <NotificationCard
                type={persistentNotification.type}
                message={persistentNotification.message}
                persistent
                onClose={() => removeNotification(persistentNotification.id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {toastNotifications.length > 0 && (
          <div className="fixed right-4 top-8 z-[70] flex flex-col gap-3 pointer-events-none">
            {[...toastNotifications].reverse().map((n) => (
              <div key={n.id} className="pointer-events-auto">
                <NotificationCard
                  type={n.type}
                  message={n.message}
                  onClose={() => removeNotification(n.id)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="min-h-screen p-0 [&>*]:!mt-0 [&>*]:!mb-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainPage
