import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testSettings() {
    try {
        // 1. Login to get token
        console.log('Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'newuser@test.com',
            password: 'testpass123'
        });

        const token = loginResponse.data.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        if (!token) {
            console.error('Failed to get token');
            return;
        }

        // 2. Get Settings
        console.log('Fetching settings...');
        const settingsResponse = await axios.get(`${API_URL}/settings`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Settings response status:', settingsResponse.status);
        console.log('Settings data:', JSON.stringify(settingsResponse.data, null, 2));

    } catch (error: any) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testSettings();
