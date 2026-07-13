import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import './services/http/registerGlobalAxiosAuthRefresh'
import { initAppTimezone } from './utils/appTimezone'
import { RouterProvider } from 'react-router-dom'
import routes from './router/routes.tsx'
import { queryClient } from './queryClient'

initAppTimezone()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={routes} />
    </QueryClientProvider>
  </StrictMode>,
)


