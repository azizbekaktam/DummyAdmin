import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Todo } from '../types';
import { useGlobal } from '../store/GlobalContext';
import { CheckCircle2, Circle, ListFilter } from 'lucide-react';
import Pagination from '../components/Pagination';

type FilterType = 'all' | 'completed' | 'pending';

const Todos: React.FC = () => {
  const { dispatch } = useGlobal();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await api.getTodos({ limit, skip });
        setTodos(res.todos || []);
        setTotal(res.total);
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchTodos();
  }, [dispatch, limit, skip]);

  const filteredTodos = useMemo(() => {
    if (filter === 'all') return todos;
    return todos.filter(todo => filter === 'completed' ? todo.completed : !todo.completed);
  }, [todos, filter]);

  const toggleTodo = (id: number) => {
    // Optimistic update since DummyJSON doesn't persist
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
        
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          {(['all', 'pending', 'completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredTodos.map((todo) => (
            <div 
              key={todo.id} 
              className={`p-4 flex items-center gap-4 group transition-colors ${
                todo.completed ? 'bg-gray-50' : 'hover:bg-indigo-50/30'
              }`}
              onClick={() => toggleTodo(todo.id)}
            >
              <button className={`flex-shrink-0 transition-colors ${todo.completed ? 'text-green-500' : 'text-gray-300 group-hover:text-indigo-500'}`}>
                {todo.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
              <div className="flex-1">
                <p className={`text-base ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {todo.todo}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">Assigned to User #{todo.userId}</span>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${
                todo.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {todo.completed ? 'Done' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
        {filteredTodos.length === 0 && (
          <div className="p-8 text-center text-gray-500">No todos found for this filter.</div>
        )}
      </div>

      <Pagination total={total} limit={limit} skip={skip} onPageChange={setSkip} />
    </div>
  );
};

export default Todos;
