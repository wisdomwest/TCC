
import axios from 'axios';
import AuthService from '../auth/AuthService';

export const API_URL = 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
  const user = AuthService.getCurrentUser();
  if (user && user.access_token) {
    return { Authorization: 'Bearer ' + user.access_token };
  }
  return {};
};

const ApiService = {
  // Branches
  getBranches: () => {
    return axios.get(API_URL + '/branches');
  },
  createBranch: (name, is_hq) => {
    return axios.post(API_URL + '/branches', { name, is_hq }, { headers: getAuthHeader() });
  },

  // Consignments
  createConsignment: (data) => {
    return axios.post(API_URL + '/consignments', data, { headers: getAuthHeader() });
  },
  getConsignments: () => {
    return axios.get(API_URL + '/consignments', { headers: getAuthHeader() });
  },
  getConsignment: (id) => {
    return axios.get(API_URL + '/consignments/' + id, { headers: getAuthHeader() });
  },
  getConsignmentStatus: (id) => {
    return axios.get(API_URL + '/consignments/status/' + id, { headers: getAuthHeader() });
  },
  getConsignmentStats: (destination) => {
    return axios.get(API_URL + '/consignments/stats', { params: { destination }, headers: getAuthHeader() });
  },
  getAverageWaitTime: () => {
    return axios.get(API_URL + '/consignments/average_wait_time', { headers: getAuthHeader() });
  },

  // Dispatches
  getDispatches: () => {
    return axios.get(API_URL + '/dispatches', { headers: getAuthHeader() });
  },
  getDispatch: (id) => {
    return axios.get(API_URL + '/dispatches/' + id, { headers: getAuthHeader() });
  },

  // Invoices
  getInvoices: () => {
    return axios.get(API_URL + '/invoices', { headers: getAuthHeader() });
  },
  getInvoice: (id) => {
    return axios.get(API_URL + '/invoices/' + id, { headers: getAuthHeader() });
  },

  // Trucks
  createTruck: (data) => {
    return axios.post(API_URL + '/trucks', data, { headers: getAuthHeader() });
  },
  getTrucks: () => {
    return axios.get(API_URL + '/trucks', { headers: getAuthHeader() });
  },
  getTruck: (id) => {
    return axios.get(API_URL + '/trucks/' + id, { headers: getAuthHeader() });
  },
  updateTruck: (id, data) => {
    return axios.put(API_URL + '/trucks/' + id, data, { headers: getAuthHeader() });
  },
  getTruckStatuses: () => {
    return axios.get(API_URL + '/trucks/status', { headers: getAuthHeader() });
  },
  getTruckUsage: (days) => {
    return axios.get(API_URL + '/trucks/usage', { params: { days }, headers: getAuthHeader() });
  },
  getAverageIdleTime: () => {
    return axios.get(API_URL + '/trucks/average_idle_time', { headers: getAuthHeader() });
  },
  
  // Consignment status update
  updateConsignmentStatus: (id, data) => {
    return axios.put(API_URL + '/consignments/' + id, data, { headers: getAuthHeader() });
  },

  // Users
  getUsers: () => {
    return axios.get(API_URL + '/users', { headers: getAuthHeader() });
  },
  getUser: (id) => {
    return axios.get(API_URL + '/users/' + id, { headers: getAuthHeader() });
  },
  updateUser: (id, data) => {
    return axios.put(API_URL + '/users/' + id, data, { headers: getAuthHeader() });
  },
  deleteUser: (id) => {
    return axios.delete(API_URL + '/users/' + id, { headers: getAuthHeader() });
  },
  
  // Get current user details
  getCurrentUserDetails: () => {
    return axios.get(API_URL + '/users/me', { headers: getAuthHeader() });
  },
  
  // Get branch details
  getBranch: (id) => {
    return axios.get(API_URL + '/branches/' + id, { headers: getAuthHeader() });
  },
};

export default ApiService;
