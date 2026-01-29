export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  company: {
    name: string;
    title: string;
  };
  address: {
    address: string;
    city: string;
  };
}

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
}

export interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface ApiResponse<T> {
  products?: T[];
  users?: T[];
  posts?: T[];
  todos?: T[];
  carts?: T[];
  comments?: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface PaginationParams {
  limit: number;
  skip: number;
}
