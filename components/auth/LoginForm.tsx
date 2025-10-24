"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { InputField } from "./InputField"
import { useAuth } from "@/contexts/AuthContext"
import { login as loginService } from "@/lib/authService"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface FormErrors {
  username?: string
  password?: string
  twoFA?: string
}

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [twoFA, setTwoFA] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!password.trim()) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!twoFA.trim()) {
      newErrors.twoFA = "2FA code is required"
    } else if (!/^\d{6}$/.test(twoFA)) {
      newErrors.twoFA = "2FA code must be 6 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all fields and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await loginService({ username, password, twoFA })

      if (response.success && response.token && response.user) {
        login(response.token, response.user)
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.name}!`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: response.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#26c6a8] flex items-center justify-center">
            <span className="text-white font-bold text-xl italic">e</span>
          </div>
          <span className="text-2xl font-bold text-[#003d82] tracking-wide">CHANNELLING</span>
        </div>
        <h1 className="text-2xl font-bold text-[#003d82]">Admin Login</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          id="username"
          label="Username"
          type="text"
          value={username}
          onChange={setUsername}
          placeholder="Enter your username"
          error={errors.username}
          required
          disabled={isLoading}
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          error={errors.password}
          required
          disabled={isLoading}
        />

        <InputField
          id="twoFA"
          label="2FA Code"
          type="text"
          value={twoFA}
          onChange={setTwoFA}
          placeholder="Enter your 2FA code"
          error={errors.twoFA}
          required
          disabled={isLoading}
          maxLength={6}
        />

        <Button
          type="submit"
          className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white font-semibold py-6 rounded-lg text-base"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        <div className="text-center">
          <Link href="/forgot-password" className="text-sm text-[#0066cc] hover:text-[#0052a3] transition-colors">
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  )
}
