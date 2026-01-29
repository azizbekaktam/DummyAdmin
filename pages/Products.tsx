import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import { useGlobal } from '../store/GlobalContext';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { Search, Star, Filter } from 'lucide-react';

const Products: React.FC = () => {
  const { dispatch } = useGlobal();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<{slug: string, name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch Categories
  useEffect(() => {
    api.getCategoryList().then(cats => setCategories(cats)).catch(console.error);
  }, []);

  const fetchProducts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let res;
      if (search) {
        res = await api.searchProducts(search);
        // Search endpoint in dummyjson doesn't support skip/limit fully the same way for pagination sometimes, but let's assume standard behavior or client side slice if needed.
        // Actually, DummyJSON search DOES support limit/skip.
      } else if (selectedCategory) {
        res = await api.getProductsByCategory(selectedCategory, { limit, skip });
      } else {
        res = await api.getProducts({ limit, skip });
      }
      
      setProducts(res.products || []);
      setTotal(res.total);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, limit, skip, search, selectedCategory]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSkip(0); // Reset to first page
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSearch('');
    setSkip(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            />
          </div>
          
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
             <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white w-full sm:w-48"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            to={`/products/${product.id}`}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
              <img 
                src={product.thumbnail} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded text-indigo-600">
                -{Math.round(product.discountPercentage)}%
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1" title={product.title}>
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  {product.rating}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {products.length === 0 && !search && (
         <div className="text-center py-12 text-gray-500">No products found.</div>
      )}

      <Pagination 
        total={total} 
        limit={limit} 
        skip={skip} 
        onPageChange={setSkip} 
      />
    </div>
  );
};

export default Products;
