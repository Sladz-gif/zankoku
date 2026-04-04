import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Debug: Log environment variables
console.log('🔍 Supabase Debug - Environment Variables:');
console.log('📍 VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('🔑 VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENT' : 'NOT FOUND');

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// Debug: Log final values
console.log('🌐 Final URL:', supabaseUrl);
console.log('🔑 Final Key:', supabaseAnonKey ? 'PRESENT' : 'NOT FOUND');

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Auth helper functions
export const signUp = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  })
  return { data, error }
}

export const signInWithUsernameOrEmail = async (identifier: string, password: string) => {
  // Check if identifier is an email
  const isEmail = identifier.includes('@');
  
  if (isEmail) {
    // Direct email sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: identifier,
      password
    })
    return { data, error }
  } else {
    // Username lookup - find user by username in profiles table
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .eq('is_banned', false)
        .maybeSingle() as { data: { email: string } | null, error: any };
      
      if (profileError || !profileData?.email) {
        return { 
          data: null, 
          error: { message: 'User not found. Please check your username or sign up.' } 
        };
      }
      
      // Sign in with the found email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profileData.email,
        password
      })
      
      return { data, error };
    } catch (error) {
      return { 
        data: null, 
        error: { message: 'Username lookup failed. Please try again.' } 
      };
    }
  }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Realtime subscriptions
export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table 
      }, 
      callback
    )
    .subscribe()
}

export const subscribeToUserNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export const subscribeToMessages = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages:${userId}`)
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `to_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export const subscribeToBattles = (callback: (payload: any) => void) => {
  return supabase
    .channel('battles')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'battles'
      },
      callback
    )
    .subscribe()
}

export const subscribeToClanUpdates = (clanId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`clan:${clanId}`)
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'clan_posts',
        filter: `clan_id=eq.${clanId}`
      },
      callback
    )
    .subscribe()
}

// Storage functions
export const uploadAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`
  
  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true
    })
  
  if (error) throw error
  
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

export const uploadMangaCover = async (file: File, seriesId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `manga/${seriesId}/cover.${fileExt}`
  
  const { error } = await supabase.storage
    .from('manga')
    .upload(fileName, file, {
      upsert: true
    })
  
  if (error) throw error
  
  const { data } = supabase.storage
    .from('manga')
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

export const uploadMangaPage = async (file: File, seriesId: string, episodeId: string, pageNumber: number) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `manga/${seriesId}/${episodeId}/page_${pageNumber}.${fileExt}`
  
  const { error } = await supabase.storage
    .from('manga')
    .upload(fileName, file, {
      upsert: true
    })
  
  if (error) throw error
  
  const { data } = supabase.storage
    .from('manga')
    .getPublicUrl(fileName)
  
  return data.publicUrl
}

// Utility functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      currency:currency(*),
      user_statistics:user_statistics(*)
    `)
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const updateCurrency = async (userId: string, updates: { bronze?: number, silver?: number, gold?: number }) => {
  const { data, error } = await supabase
    .from('currency')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const createTransaction = async (transaction: {
  user_id: string,
  type: string,
  amount: number,
  currency_type: string,
  description: string,
  reference_id?: string,
  reference_type?: string,
  metadata?: any
}) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single()
  
  return { data, error }
}

export default supabase
