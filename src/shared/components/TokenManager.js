import { useEffect } from 'react';
import axios from 'axios';

const TokenManager = () => {
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/auth/refresh',
          {},
          { withCredentials: true }
        );

        localStorage.setItem('access_token', response.data.access_token);
        console.log('Access token refreshed.');
      } catch (err) {
        console.error('Failed to refresh token:', err.response?.data || err.message);
      }
    };

    // Refresh every 55 minutes
    const interval = setInterval(refreshAccessToken, 55 * 60 * 1000);
    refreshAccessToken(); // Optional: refresh on component mount

    return () => clearInterval(interval); // Cleanup
  }, []);

  return null;
};

export default TokenManager;
