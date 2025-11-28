export const setAuth = (user, accessToken, refreshToken) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAuth = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const isAdmin = () => {
  const user = getAuth();
  return user && user.role === 'admin';
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

