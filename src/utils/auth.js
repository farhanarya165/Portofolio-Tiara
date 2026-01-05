// Encrypted credentials (Base64 encoded - basic security)
const ENCRYPTED_CREDENTIALS = {
  username: btoa(import.meta.env.VITE_ADMIN_USER || 'tiaraaadmin'), 
  password: btoa(import.meta.env.VITE_ADMIN_PASS || 'TiaraPortfolio2025!')
};

export const auth = {
  // Verify login credentials
  verify(username, password) {
    try {
      const validUsername = atob(ENCRYPTED_CREDENTIALS.username);
      const validPassword = atob(ENCRYPTED_CREDENTIALS.password);
      
      const isValid = username === validUsername && password === validPassword;
      
      console.log('🔐 Credential verification:', isValid ? 'SUCCESS' : 'FAILED');
      
      return isValid;
    } catch (error) {
      console.error('❌ Auth verification error:', error);
      return false;
    }
  },

  // Set authentication session
  login() {
    try {
      console.log('💾 Starting login process...');
      
      // Clear any existing session first
      this.logout();
      
      const authData = {
        isAuthenticated: 'true',
        authTime: Date.now().toString(),
        sessionId: Math.random().toString(36).substr(2, 9)
      };
      
      console.log('📝 Writing to sessionStorage...');
      
      // Save to sessionStorage
      sessionStorage.setItem('isAuthenticated', authData.isAuthenticated);
      sessionStorage.setItem('authTime', authData.authTime);
      sessionStorage.setItem('sessionId', authData.sessionId);
      
      // Verify data was saved
      const savedAuth = sessionStorage.getItem('isAuthenticated');
      const savedTime = sessionStorage.getItem('authTime');
      const savedId = sessionStorage.getItem('sessionId');
      
      console.log('🔍 Verification check:');
      console.log('  - isAuthenticated:', savedAuth);
      console.log('  - authTime:', savedTime);
      console.log('  - sessionId:', savedId);
      
      if (!savedAuth || savedAuth !== 'true') {
        console.error('❌ Failed to save authentication to sessionStorage');
        return false;
      }
      
      console.log('✅ Authentication saved successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  },

  // Clear authentication session
  logout() {
    try {
      console.log('🚪 Logging out...');
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('authTime');
      sessionStorage.removeItem('sessionId');
      console.log('✅ Logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    try {
      const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
      const authTime = sessionStorage.getItem('authTime');
      const sessionId = sessionStorage.getItem('sessionId');
      
      if (!isAuth || !authTime || !sessionId) {
        console.log('❌ Auth check failed: Missing credentials');
        return false;
      }

      // Session expires after 2 hours
      const TWO_HOURS = 2 * 60 * 60 * 1000;
      const currentTime = Date.now();
      const timeDiff = currentTime - parseInt(authTime);

      if (timeDiff > TWO_HOURS) {
        console.log('⏰ Session expired');
        this.logout();
        return false;
      }

      const remainingMinutes = Math.floor((TWO_HOURS - timeDiff) / (60 * 1000));
      console.log(`✅ Authenticated - Session expires in ${remainingMinutes} minutes`);
      
      return true;
    } catch (error) {
      console.error('❌ Auth check error:', error);
      return false;
    }
  },

  // Get remaining session time in minutes
  getSessionTimeRemaining() {
    try {
      const authTime = sessionStorage.getItem('authTime');
      if (!authTime) return 0;

      const TWO_HOURS = 2 * 60 * 60 * 1000;
      const currentTime = Date.now();
      const timeDiff = currentTime - parseInt(authTime);
      const remainingTime = TWO_HOURS - timeDiff;

      return Math.max(0, Math.floor(remainingTime / (60 * 1000)));
    } catch (error) {
      console.error('❌ Error getting session time:', error);
      return 0;
    }
  }
};

// Generate unique ID for projects
export const generateId = (prefix = 'item') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};