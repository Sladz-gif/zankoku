import { supabase } from './supabase';
import { Database } from './database.types';

// Real-time subscription types
export type RealtimeSubscription = ReturnType<typeof supabase.channel.on>;

// Profiles service
export const profilesService = {
  // Get all profiles
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        currency (*),
        clans:clan_id (
          id,
          name,
          tag,
          alignment,
          primary_anime,
          members,
          wins,
          losses,
          motto,
          leader_id,
          leader_title
        )
      `)
      .eq('is_banned', false)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Get profile by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        currency (*),
        clans:clan_id (
          id,
          name,
          tag,
          alignment,
          primary_anime,
          members,
          wins,
          losses,
          motto,
          leader_id,
          leader_title
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Subscribe to real-time profile updates
  subscribeToProfiles(callback: (payload: any) => void) {
    return supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        callback
      )
      .subscribe();
  },

  // Update profile
  async update(id: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }
};

// Posts service
export const postsService = {
  // Get all posts with user info
  async getAll(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url,
          anime_faction,
          alignment,
          rank,
          clans:clan_id (
            id,
            name,
            tag,
            alignment
          )
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { data, error };
  },

  // Get post by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url,
          anime_faction,
          alignment,
          rank,
          clans:clan_id (
            id,
            name,
            tag,
            alignment
          )
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  },

  // Create new post
  async create(post: Database['public']['Tables']['posts']['Insert']) {
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single();

    return { data, error };
  },

  // Subscribe to real-time posts
  subscribeToPosts(callback: (payload: any) => void) {
    return supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        callback
      )
      .subscribe();
  },

  // Update post
  async update(id: string, updates: Partial<Database['public']['Tables']['posts']['Update']>) {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete post
  async delete(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    return { error };
  }
};

// Clans service
export const clansService = {
  // Get all clans with member count
  async getAll() {
    const { data, error } = await supabase
      .from('clans')
      .select(`
        *,
        clan_members(count),
        profiles:leader_id (
          username,
          avatar_url,
          anime_faction,
          rank
        )
      `)
      .eq('is_active', true)
      .order('wins', { ascending: false });

    return { data, error };
  },

  // Get trending clans (by activity and wins)
  async getTrending(limit = 10) {
    const { data, error } = await supabase
      .from('clans')
      .select(`
        *,
        clan_members(count),
        clan_posts!inner(count),
        profiles:leader_id (
          username,
          avatar_url,
          anime_faction,
          rank
        )
      `)
      .eq('is_active', true)
      .order('wins', { ascending: false })
      .order('members', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Subscribe to real-time clan updates
  subscribeToClans(callback: (payload: any) => void) {
    return supabase
      .channel('clans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clans'
        },
        callback
      )
      .subscribe();
  },

  // Get clan by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('clans')
      .select(`
        *,
        clan_members(
          id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            username,
            avatar_url,
            anime_faction,
            rank,
            alignment
          )
        ),
        profiles:leader_id (
          username,
          avatar_url,
          anime_faction,
          rank
        )
      `)
      .eq('id', id)
      .single();

    return { data, error };
  }
};

// Bounties service
export const bountiesService = {
  // Get all active bounties
  async getActive() {
    const { data, error } = await supabase
      .from('bounties')
      .select(`
        *,
        profiles:target_id (
          username,
          avatar_url,
          anime_faction,
          rank,
          alignment
        ),
        profiles:creator_id (
          username,
          avatar_url,
          anime_faction,
          rank
        )
      `)
      .eq('active', true)
      .eq('status', 'active')
      .order('amount', { ascending: false })
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Subscribe to real-time bounty updates
  subscribeToBounties(callback: (payload: any) => void) {
    return supabase
      .channel('bounties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bounties'
        },
        callback
      )
      .subscribe();
  },

  // Create bounty
  async create(bounty: Database['public']['Tables']['bounties']['Insert']) {
    const { data, error } = await supabase
      .from('bounties')
      .insert(bounty)
      .select()
      .single();

    return { data, error };
  }
};

// Comments service
export const commentsService = {
  // Get comments for a post
  async getByPostId(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url,
          anime_faction,
          rank
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  // Create comment
  async create(comment: Database['public']['Tables']['comments']['Insert']) {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment)
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url,
          anime_faction,
          rank
        )
      `)
      .single();

    return { data, error };
  },

  // Subscribe to real-time comments
  subscribeToComments(callback: (payload: any) => void) {
    return supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        callback
      )
      .subscribe();
  }
};

// Utility function to initialize all real-time subscriptions
export const initializeRealtime = () => {
  const subscriptions = [];

  // Subscribe to profiles changes
  const profilesChannel = supabase
    .channel('profiles-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles'
      },
      (payload) => console.log('Profile change:', payload)
    )
    .subscribe();

  // Subscribe to posts changes
  const postsChannel = supabase
    .channel('posts-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts'
      },
      (payload) => console.log('Post change:', payload)
    )
    .subscribe();

  // Subscribe to clans changes
  const clansChannel = supabase
    .channel('clans-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'clans'
      },
      (payload) => console.log('Clan change:', payload)
    )
    .subscribe();

  // Subscribe to bounties changes
  const bountiesChannel = supabase
    .channel('bounties-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bounties'
      },
      (payload) => console.log('Bounty change:', payload)
    )
    .subscribe();

  // Subscribe to comments changes
  const commentsChannel = supabase
    .channel('comments-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments'
      },
      (payload) => console.log('Comment change:', payload)
    )
    .subscribe();

  subscriptions.push(profilesChannel, postsChannel, clansChannel, bountiesChannel, commentsChannel);
  return subscriptions;
};

// Utility function to cleanup subscriptions
export const cleanupRealtime = (subscriptions: any[]) => {
  subscriptions.forEach(subscription => {
    supabase.removeChannel(subscription);
  });
};
