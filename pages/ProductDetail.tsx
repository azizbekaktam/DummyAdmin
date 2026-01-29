import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types';
import { useGlobal } from '../store/GlobalContext';
import { ArrowLeft, Star, ShoppingCart, Check } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useGlobal();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const data = await api.getProduct(Number(id));
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchProduct();
  }, [id, dispatch]);

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              <img 
                src={selectedImage} 
                alt={product.title} 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-indigo-600' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  {product.rating}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  In Stock: <span className="font-semibold ml-1">{product.stock} units</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  Category: <span className="font-semibold ml-1 capitalize">{product.category}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                <span className="text-lg text-red-500 font-medium mb-1 line-through">
                  ${Math.round(product.price / (1 - product.discountPercentage / 100))}
                </span>
                <span className="text-sm text-green-600 font-medium mb-2">
                  {product.discountPercentage}% OFF
                </span>
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
