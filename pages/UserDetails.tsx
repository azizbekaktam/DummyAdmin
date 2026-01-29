import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { User, Cart } from '../types';
import { useGlobal } from '../store/GlobalContext';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, ShoppingBag } from 'lucide-react';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useGlobal();
  const [user, setUser] = useState<User | null>(null);
  const [carts, setCarts] = useState<Cart[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [userData, cartData] = await Promise.all([
          api.getUser(Number(id)),
          api.getUserCarts(Number(id))
        ]);
        setUser(userData);
        setCarts(cartData.carts);
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [id, dispatch]);

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="relative pt-12 flex flex-col md:flex-row items-start md:items-end gap-6">
          <img 
            src={user.image} 
            alt={user.username} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
          />
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
            <p className="text-gray-500">@{user.username} • {user.age} years old • {user.gender}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-indigo-500"/> {user.email}</div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-indigo-500"/> {user.phone}</div>
              <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-indigo-500"/> {user.address.address}, {user.address.city}</div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Employment</h3>
            <div className="flex items-start">
              <Briefcase className="w-4 h-4 mr-2 mt-1 text-indigo-500"/> 
              <div>
                <p className="font-medium text-gray-900">{user.company.title}</p>
                <p className="text-sm text-gray-600">{user.company.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Carts */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2" />
          User Shopping Carts ({carts.length})
        </h2>
        
        {carts.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-500">No carts found for this user.</div>
        ) : (
          <div className="space-y-6">
            {carts.map((cart) => (
              <div key={cart.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Cart #{cart.id}</span>
                  <div className="text-sm">
                    <span className="text-gray-500 mr-4">Items: <span className="font-medium text-gray-900">{cart.totalQuantity}</span></span>
                    <span className="text-gray-500">Total: <span className="font-bold text-green-600">${cart.total}</span></span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.products.map((p) => (
                    <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50">
                      <img src={p.thumbnail} alt={p.title} className="w-16 h-16 object-cover rounded bg-gray-100" />
                      <div className="flex-1">
                        <Link to={`/products/${p.id}`} className="text-sm font-medium text-indigo-600 hover:underline">{p.title}</Link>
                        <div className="text-xs text-gray-500 mt-1">
                          ${p.price} x {p.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">${p.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
