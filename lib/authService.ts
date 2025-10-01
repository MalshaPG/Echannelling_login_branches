interface LoginCredentials {
  username: string
  password: string
  twoFA: string
}

interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    name: string
    role: string
    email?: string
  }
  error?: string
}

interface PasswordResetResponse {
  success: boolean
  message: string
}

interface VerifyOTPResponse {
  success: boolean
  resetToken: string
  message: string
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch("/api/mock/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Login failed",
      }
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
    }
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    }
  }
}

export async function requestPasswordReset(identifier: string): Promise<PasswordResetResponse> {
  try {
    // Mock API call - simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate success for demo purposes
    // In production, this would call your actual API
    return {
      success: true,
      message: "OTP sent successfully to your registered email/phone",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    }
  }
}

export async function verifyOTP(identifier: string, otp: string): Promise<VerifyOTPResponse> {
  try {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation - accept '123456' as valid OTP
    if (otp === "123456") {
      return {
        success: true,
        resetToken: "mock-reset-token-" + Date.now(),
        message: "OTP verified successfully",
      }
    }

    throw new Error("Invalid OTP")
  } catch (error) {
    throw new Error("Invalid OTP. Please try again.")
  }
}

export async function resetPassword(resetToken: string, newPassword: string): Promise<PasswordResetResponse> {
  try {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate success
    return {
      success: true,
      message: "Password reset successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to reset password. Please try again.",
    }
  }
}
