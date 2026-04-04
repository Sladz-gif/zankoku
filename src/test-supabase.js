// Test Supabase connection
import { supabase } from './lib/supabase.js';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('profiles').select('count').single();
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    console.log('📊 Data:', data);
    
    // Test 2: Test authentication
    console.log('2. Testing authentication...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth test failed:', authError);
    } else {
      console.log('✅ Auth system working');
      console.log('🔐 Session:', session ? 'Active' : 'None');
    }
    
    // Test 3: Check project info
    console.log('3. Checking project info...');
    console.log('🌐 Supabase URL:', supabase.supabaseUrl);
    console.log('🔑 Anon key present:', !!supabase.supabaseKey);
    
    return true;
    
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    return false;
  }
}

// Run test
testSupabaseConnection().then(success => {
  if (success) {
    console.log('🎉 All tests passed! Supabase is connected.');
  } else {
    console.log('💥 Tests failed! Check your configuration.');
  }
});
