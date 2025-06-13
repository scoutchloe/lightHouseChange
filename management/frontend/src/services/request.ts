import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import type { ApiResponse } from '../types';

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加token
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error: any) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    // 检查业务状态码
    if (data.code === 200) {
      return response;
    }
    
    // 处理业务错误
    if (data.code === 401) {
      // 未授权，清除token并跳转登录
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      window.location.href = '/login';
      return Promise.reject(new Error('未授权访问'));
    }
    
    // 其他业务错误
    message.error(data.message || '请求失败');
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  (error: any) => {
    console.error('Response error:', error);
    
    // 网络错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          message.error('未授权访问');
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          window.location.href = '/login';
          break;
        case 403:
          message.error('权限不足');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.message || `请求失败 (${status})`);
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络');
    } else {
      message.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// 封装请求方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return request.get(url, config).then((res: AxiosResponse<ApiResponse<T>>) => res.data);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return request.post(url, data, config).then((res: AxiosResponse<ApiResponse<T>>) => res.data);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return request.put(url, data, config).then((res: AxiosResponse<ApiResponse<T>>) => res.data);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return request.delete(url, config).then((res: AxiosResponse<ApiResponse<T>>) => res.data);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    return request.patch(url, data, config).then((res: AxiosResponse<ApiResponse<T>>) => res.data);
  },
};

export default request; 