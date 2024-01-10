import { pb } from "./pb"
import { Navigate } from 'react-router-dom'

export function ProtectedRoute(props: { children: React.ReactNode }) {
  if (pb.authStore.isValid) {
    return props.children
  }

  return <Navigate to={`/signin?redirect=${location.href}`} />
}