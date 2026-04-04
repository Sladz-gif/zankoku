import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, signUp, signIn, signOut, getCurrentUser } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, username: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  refreshUser: () => Promise<void>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

interface SupabaseProviderProps {
  children: React.ReactNode
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      const result = await signUp(email, password, username)
      if (result.data?.user && !result.error) {
        // Profile will be created automatically by the trigger
        await refreshUser()
      }
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password)
      if (result.data?.user && !result.error) {
        await refreshUser()
      }
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  const handleSignOut = async () => {
    try {
      const result = await signOut()
      if (!result.error) {
        setUser(null)
        setSession(null)
      }
      return result
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  const value: SupabaseContextType = {
    user,
    session,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshUser
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

// Database hooks for common operations
export const useProfile = () => {
  const { user } = useSupabase()

  const getProfile = async () => {
    if (!user) return null
    
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        currency:currency(*),
        user_statistics:user_statistics(*)
      `)
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  }

  const updateProfile = async (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  }

  return { getProfile, updateProfile }
}

export const useCurrency = () => {
  const { user } = useSupabase()

  const getCurrency = async () => {
    if (!user) return null

    const { data, error } = await supabase
      .from('currency')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching currency:', error)
      return null
    }

    return data
  }

  const updateCurrency = async (updates: Partial<Database['public']['Tables']['currency']['Update']>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('currency')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating currency:', error)
      throw error
    }

    return data
  }

  const createTransaction = async (transaction: Omit<Database['public']['Tables']['transactions']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transaction:', error)
      throw error
    }

    return data
  }

  return { getCurrency, updateCurrency, createTransaction }
}

export const useBattles = () => {
  const { user } = useSupabase()

  const getActiveBattles = async () => {
    const { data, error } = await supabase
      .from('active_battles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching active battles:', error)
      return []
    }

    return data
  }

  const createBattle = async (battle: Omit<Database['public']['Tables']['battles']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('battles')
      .insert({
        ...battle,
        creator_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating battle:', error)
      throw error
    }

    return data
  }

  const joinBattle = async (battleId: string, playerSlot: 'player1' | 'player2') => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('battles')
      .update({
        [playerSlot]: user.id,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', battleId)
      .select()
      .single()

    if (error) {
      console.error('Error joining battle:', error)
      throw error
    }

    return data
  }

  return { getActiveBattles, createBattle, joinBattle }
}

export const usePosts = () => {
  const { user } = useSupabase()

  const getPosts = async (limit = 20) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:profiles(username, avatar_url, anime_faction),
        comments:comments(count)
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching posts:', error)
      return []
    }

    return data
  }

  const createPost = async (content: string, type: Database['public']['Tables']['posts']['Row']['type'] = 'text') => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content,
        type,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    return data
  }

  const likePost = async (postId: string) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('posts')
      .update({ 
        likes: supabase.rpc('increment', { row_id: postId }),
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()

    if (error) {
      console.error('Error liking post:', error)
      throw error
    }

    return data
  }

  return { getPosts, createPost, likePost }
}

export const useManga = () => {
  const { user } = useSupabase()

  const getPopularManga = async (limit = 20) => {
    const { data, error } = await supabase
      .from('popular_manga')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular manga:', error)
      return []
    }

    return data
  }

  const getMangaSeries = async (seriesId: string) => {
    const { data, error } = await supabase
      .from('manga_series')
      .select(`
        *,
        profiles:profiles(username, avatar_url),
        manga_episodes(
          id,
          title,
          episode_number,
          pages,
          price_gold,
          is_free,
          published_at
        )
      `)
      .eq('id', seriesId)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching manga series:', error)
      return null
    }

    return data
  }

  const createMangaSeries = async (series: Omit<Database['public']['Tables']['manga_series']['Insert'], 'id' | 'creator_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('manga_series')
      .insert({
        ...series,
        creator_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating manga series:', error)
      throw error
    }

    return data
  }

  const purchaseManga = async (seriesId: string, episodeId?: string) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('manga_purchases')
      .insert({
        user_id: user.id,
        series_id: seriesId,
        episode_id: episodeId || null,
        purchase_type: episodeId ? 'episode' : 'series',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error purchasing manga:', error)
      throw error
    }

    return data
  }

  return { getPopularManga, getMangaSeries, createMangaSeries, purchaseManga }
}

export const useClans = () => {
  const { user } = useSupabase()

  const getClans = async () => {
    const { data, error } = await supabase
      .from('clans')
      .select(`
        *,
        profiles:profiles(username, avatar_url),
        clan_members(count)
      `)
      .eq('is_active', true)
      .order('wins', { ascending: false })

    if (error) {
      console.error('Error fetching clans:', error)
      return []
    }

    return data
  }

  const createClan = async (clan: Omit<Database['public']['Tables']['clans']['Insert'], 'id' | 'leader_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('clans')
      .insert({
        ...clan,
        leader_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating clan:', error)
      throw error
    }

    // Add creator as clan member
    await supabase
      .from('clan_members')
      .insert({
        clan_id: data.id,
        user_id: user.id,
        role: 'leader',
        joined_at: new Date().toISOString()
      })

    return data
  }

  const joinClan = async (clanId: string, message?: string) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('clan_join_requests')
      .insert({
        clan_id: clanId,
        user_id: user.id,
        message,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error joining clan:', error)
      throw error
    }

    return data
  }

  return { getClans, createClan, joinClan }
}

export const useNotifications = () => {
  const { user } = useSupabase()

  const getNotifications = async (limit = 50) => {
    if (!user) return []

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching notifications:', error)
      return []
    }

    return data
  }

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }

    return data
  }

  return { getNotifications, markNotificationAsRead }
}

export default SupabaseProvider
