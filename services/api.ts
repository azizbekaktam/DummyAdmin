import { Product, User, Cart, Post, Todo, Comment, ApiResponse, PaginationParams } from '../types';

const BASE_URL = 'https://dummyjson.com';

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  // Products
  getProducts: (params: PaginationParams) => 
    request<ApiResponse<Product>>(`/products?limit=${params.limit}&skip=${params.skip}`),
  
  getProduct: (id: number) => 
    request<Product>(`/products/${id}`),
  
  searchProducts: (query: string) => 
    request<ApiResponse<Product>>(`/products/search?q=${query}`),
  
  getCategories: () => 
    request<string[]>('/products/categories'), // Returns array of category objects or strings depending on version, usually strings now or objects with slug/name
  
  getCategoryList: () => request<{slug: string, name: string}[]>('/products/categories'),

  getProductsByCategory: (category: string, params: PaginationParams) => 
    request<ApiResponse<Product>>(`/products/category/${category}?limit=${params.limit}&skip=${params.skip}`),

  // Users
  getUsers: (params: PaginationParams) => 
    request<ApiResponse<User>>(`/users?limit=${params.limit}&skip=${params.skip}`),
  
  getUser: (id: number) => 
    request<User>(`/users/${id}`),

  // Carts
  getCarts: () => 
    request<ApiResponse<Cart>>('/carts'),
  
  getUserCarts: (userId: number) => 
    request<{ carts: Cart[], total: number, skip: number, limit: number }>(`/carts/user/${userId}`),

  // Posts
  getPosts: (params: PaginationParams) => 
    request<ApiResponse<Post>>(`/posts?limit=${params.limit}&skip=${params.skip}`),
  
  getPost: (id: number) => 
    request<Post>(`/posts/${id}`),
  
  getPostComments: (postId: number) => 
    request<ApiResponse<Comment>>(`/posts/${postId}/comments`),

  // Todos
  getTodos: (params: PaginationParams) => 
    request<ApiResponse<Todo>>(`/todos?limit=${params.limit}&skip=${params.skip}`),
};
