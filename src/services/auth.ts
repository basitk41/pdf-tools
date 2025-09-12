// src/services/auth.ts

interface User {
  username: string;
  token: string;
}

const mockAuth = {
  login: (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'password') {
          resolve({ username: 'admin', token: 'mock-admin-token' });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },

  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  checkAuth: (): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would check a token in localStorage or a cookie
        const token = localStorage.getItem('authToken');
        if (token) {
          resolve({ username: 'admin', token });
        } else {
          resolve(null);
        }
      }, 200);
    });
  },
};

export default mockAuth;
