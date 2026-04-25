// Simple debug script to test if the app loads
console.log('🚀 Debug script loading...');

// Test if basic React rendering works
try {
  const root = document.getElementById('root');
  if (root) {
    console.log('✅ Root element found');
    root.innerHTML = '<div style="color: white; padding: 20px;">Debug: App is loading...</div>';
  } else {
    console.error('❌ Root element not found');
  }
} catch (error) {
  console.error('❌ Error in debug script:', error);
}
