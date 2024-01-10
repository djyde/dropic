import { createBrowserRouter } from 'react-router-dom'
import { SignInPage } from './pages/SignIn'
import { MainPage } from './pages/Main'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element:
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
  },
  {
    path: '/signin',
    element: <SignInPage />
  }
])