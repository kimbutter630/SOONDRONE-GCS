import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, logout } from '../store/slices/authSlice';
import * as authAPI from '../api/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector(state => state.auth);

  const login = async (username, password) => {
    try {
      const response = await authAPI.loginUser({ username, password });
      const { access_token, refresh_token, user: userData } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      dispatch(setUser(userData));
      dispatch(setToken(access_token));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.registerUser({ username, email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
  };
};
