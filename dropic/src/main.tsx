import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.ts'
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './router.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
