import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  CheckSquare, 
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/posts', icon: FileText, label: 'Posts' },
    { to: '/todos', icon: CheckSquare, label: 'Todos' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            DummyAdmin
          </h1>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => onClose()} // Close on mobile when clicked
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
