import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Post } from '../types';
import { useGlobal } from '../store/GlobalContext';
import Pagination from '../components/Pagination';
import { Link } from 'react-router-dom';
import { MessageCircle, Eye, ThumbsUp, ArrowRight } from 'lucide-react';

const Posts: React.FC = () => {
  const { dispatch } = useGlobal();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchPosts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await api.getPosts({ limit, skip });
        setPosts(res.posts || []);
        setTotal(res.total);
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchPosts();
  }, [dispatch, limit, skip]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Latest Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                <Link to={`/posts/${post.id}`} className="hover:text-indigo-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4"/> {post.reactions.likes}</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4"/> {post.views}</span>
              </div>
              <Link to={`/posts/${post.id}`} className="text-indigo-600 font-medium text-sm flex items-center hover:underline">
                Read More <ArrowRight className="w-4 h-4 ml-1"/>
              </Link>
            </div>
          </article>
        ))}
      </div>

      <Pagination total={total} limit={limit} skip={skip} onPageChange={setSkip} />
    </div>
  );
};

export default Posts;
