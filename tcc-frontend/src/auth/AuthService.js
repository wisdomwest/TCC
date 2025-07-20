
import axios from 'axios';

import { API_URL } from '../services/ApiService';

const register = (username, password, role, branch_id) => {
  return axios.post(API_URL + '/users/register', {
    username,
    password,
    role,
    branch_id,
  });
};

const login = (username, password) => {
  return axios.post(API_URL + '/users/login', {
    username,
    password,
  })
  .then((response) => {
    if (response.data.access_token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
