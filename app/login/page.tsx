import { AuthLayout } from "@/components/auth/AuthLayout"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthLayout title="Admin Dashboard" description="Sign in to access the eChannelling admin panel">
      <LoginForm />
    </AuthLayout>
  )
}
