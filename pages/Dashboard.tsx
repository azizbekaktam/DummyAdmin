import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useGlobal } from '../store/GlobalContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, FileText, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string; to: string }> = ({ title, value, icon: Icon, color, to }) => (
  <Link to={to} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Link>
);

const Dashboard: React.FC = () => {
  const { dispatch } = useGlobal();
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    posts: 0,
    totalStock: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Fetch minimal data just to get counts
        const [products, users, posts] = await Promise.all([
          api.getProducts({ limit: 100, skip: 0 }),
          api.getUsers({ limit: 0, skip: 0 }),
          api.getPosts({ limit: 0, skip: 0 })
        ]);

        const stock = products.products?.reduce((acc, curr) => acc + curr.stock, 0) || 0;

        setStats({
          products: products.total,
          users: users.total,
          posts: posts.total,
          totalStock: stock
        });

        // Prepare chart data: Stock by Category (using the 100 fetched products)
        const categoryStock: Record<string, number> = {};
        products.products?.forEach(p => {
          categoryStock[p.category] = (categoryStock[p.category] || 0) + p.stock;
        });

        const data = Object.entries(categoryStock)
          .map(([name, stock]) => ({ name, stock }))
          .slice(0, 7); // Top 7 for display
        
        setChartData(data);

      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.products} icon={Package} color="bg-blue-500" to="/products" />
        <StatCard title="Total Users" value={stats.users} icon={Users} color="bg-green-500" to="/users" />
        <StatCard title="Total Posts" value={stats.posts} icon={FileText} color="bg-purple-500" to="/posts" />
        <StatCard title="Inventory Items" value={stats.totalStock} icon={DollarSign} color="bg-orange-500" to="/products" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Inventory by Category (Sample)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" height={60}/>
              <YAxis />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="stock" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
