import { ref } from "vue";
import useSupabase from "src/boot/supabase";

const user = ref(null)

export default function useAuthUser() {
  const { supabase } = useSupabase()

  const login = async ({ email, password }) => {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return user
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  const loginWithSocialProvider = async (provider) => {
    try {
      const { user, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        redirectTo: window.location.origin
      })

      if (error) throw error
      return user
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  const logout = async () => {
    try {
      let { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  const isLoggedIn = () => {
    return !!user.value
  }

  const register = async ({ email, password, ...meta }) => {
    try {
      const { user, error } = await supabase.auth.signUp(
        { email, password },

        {
          data: meta,
          redirectTo: `${window.location.origin}/me?fromEmail=registrationConfỉrmation`
        },
      )
      if (error) throw error
      return user
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  const update = async (data) => {
    try {
      const { user, error } = supabase.auth.update(data)
      if (error) throw error
    } catch (error) {
      alert(error.message)
    }
  }

  const sendPasswordRestEmail = async () => {
    const { user, error } = await supabase.auth.api.resetPasswordForEmail(email)
    if (error) throw error
    return user
  }

  return {
    user,
    login,
    loginWithSocialProvider,
    logout,
    isLoggedIn,
    register,
    update,
    sendPasswordRestEmail
  }
}


