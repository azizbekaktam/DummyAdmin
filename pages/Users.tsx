import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { useGlobal } from '../store/GlobalContext';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Users: React.FC = () => {
  const { dispatch } = useGlobal();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await api.getUsers({ limit, skip });
        setUsers(res.users || []);
        setTotal(res.total);
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchUsers();
  }, [dispatch, limit, skip]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Users Directory</h1>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="hover:bg-gray-50 transition-colors">
              <Link to={`/users/${user.id}`} className="block p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full border border-gray-200 bg-gray-100" src={user.image} alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-400 gap-3">
                      <span className="flex items-center"><Mail className="w-3 h-3 mr-1"/> {user.email}</span>
                      <span className="hidden sm:flex items-center"><Phone className="w-3 h-3 mr-1"/> {user.phone}</span>
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm text-gray-900">{user.company.title}</p>
                    <p className="text-xs text-gray-500">{user.company.name}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Pagination total={total} limit={limit} skip={skip} onPageChange={setSkip} />
      </div>
    </div>
  );
};

export default Users;
