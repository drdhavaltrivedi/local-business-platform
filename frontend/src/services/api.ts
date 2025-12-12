import axios from 'axios';
import { UserRole } from '@shared/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
  }) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Coupons API
export const couponsAPI = {
  getCoupons: (params?: {
    category?: string;
    status?: string;
    zipCode?: string;
    isPlatinumOnly?: boolean;
  }) => api.get('/coupons', { params }),
  getCoupon: (id: string) => api.get(`/coupons/${id}`),
  createCoupon: (data: any) => api.post('/coupons', data),
  redeemCoupon: (id: string, data: { latitude?: number; longitude?: number }) =>
    api.post(`/coupons/${id}/redeem`, data),
  validateRedemption: (id: string) => api.post(`/coupons/redemptions/${id}/validate`),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (data: {
    type: string;
    amount: number;
    metadata?: Record<string, any>;
  }) => api.post('/payments/create-intent', data),
};

// Merchants API
export const merchantsAPI = {
  createMerchant: (data: any) => api.post('/merchants', data),
  getMerchant: () => api.get('/merchants/me'),
  signAgreement: () => api.post('/merchants/me/agreement'),
  getAllMerchants: (params?: any) => api.get('/merchants', { params }),
};

// Fundraisers API
export const fundraisersAPI = {
  createFundraiser: (data: any) => api.post('/fundraisers', data),
  createBooklet: (data: any) => api.post('/fundraisers/booklets', data),
  uploadCustomers: (bookletId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/fundraisers/booklets/${bookletId}/customers/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getBooklets: () => api.get('/fundraisers/booklets'),
  getBookletCustomers: (bookletId: string) =>
    api.get(`/fundraisers/booklets/${bookletId}/customers`),
};

// Reviews API
export const reviewsAPI = {
  createReview: (data: any) => api.post('/reviews', data),
  getMerchantReviews: (merchantId: string) => api.get(`/reviews/merchant/${merchantId}`),
  createMerchantRating: (data: any) => api.post('/reviews/merchant-rating', data),
  getMerchantRatings: (merchantId: string) => api.get(`/reviews/merchant/${merchantId}/ratings`),
};

