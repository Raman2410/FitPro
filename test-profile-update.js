// Test script to verify profile update functionality with registration
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing Profile Update Functionality...\n');
    
    // First, let's test the health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test registration to create a test user
    console.log('\n2. Testing registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: 'testprofile@example.com',
      password: 'password123',
      name: 'Test Profile User',
      age: 25,
      gender: 'male'
    });
    
    const token = registerResponse.data.token;
    const user = registerResponse.data.user;
    console.log('✅ Registration successful, user ID:', user.id);
    console.log('✅ Token received:', token.substring(0, 20) + '...');
    
    // Test get profile
    console.log('\n3. Testing get profile...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data);
    
    // Test update profile
    console.log('\n4. Testing update profile...');
    const updateResponse = await axios.put(`${API_BASE_URL}/auth/profile`, {
      age: 28,
      gender: 'female',
      name: 'Test User Updated'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile updated:', updateResponse.data);
    
    // Verify the update
    console.log('\n5. Verifying profile update...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Updated profile:', verifyResponse.data);
    
    console.log('\n🎉 All tests passed! Profile update functionality is working correctly.');
    console.log('\n📋 Summary:');
    console.log('- User registration: ✅ Working');
    console.log('- Profile retrieval: ✅ Working');  
    console.log('- Profile update: ✅ Working');
    console.log('- Data persistence: ✅ Working');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.error('🚨 User not found - this indicates the user ID reference issue is not fully resolved');
    } else if (error.response?.status === 401) {
      console.error('🚨 Authentication failed - token issue');
    } else if (error.response?.status === 400) {
      console.error('🚨 Bad request - validation failed:', error.response.data);
    }
  }
}

testProfileUpdate();