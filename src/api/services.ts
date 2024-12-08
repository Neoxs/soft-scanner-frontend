import api from './axios'
import { User, Product, Store, CreateUserDTO, CreateProductDTO } from '../types'

export const userService = {
  create: (userData: CreateUserDTO) =>
    api.post<User>('/api/user/create', userData),

  getById: (id: string) => api.get<User>(`/api/user/get/${id}`),
}

export const productService = {
  create: (productData: CreateProductDTO) =>
    api.post<Product>('/api/product/create', productData),

  getAll: () => api.get<Product[]>('/api/product/all'),

  getById: (id: string) => api.get<Product>(`/api/product/get/${id}`),

  update: (id: string, productData: Product) =>
    api.put<Product>(`/api/product/update/${id}`, productData),

  delete: (id: string) => api.delete(`/api/product/delete/${id}`),
}

export const storeService = {
  get: () => api.get<Store>('/api/store/get'),

  init: () => api.post<Store>('/api/store/init'),
}
