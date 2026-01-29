import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Post, Comment } from '../types';
import { useGlobal } from '../store/GlobalContext';
import { ArrowLeft, MessageCircle, User as UserIcon } from 'lucide-react';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useGlobal();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [postData, commentsData] = await Promise.all([
          api.getPost(Number(id)),
          api.getPostComments(Number(id))
        ]);
        setPost(postData);
        setComments(commentsData.comments || []);
      } catch (error: any) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [id, dispatch]);

  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Posts
      </button>

      <article className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{post.title}</h1>
        <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed">
          {post.body}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
           <span>Posted by User #{post.userId}</span>
           <div className="flex gap-4">
             <span>Likes: {post.reactions.likes}</span>
             <span>Views: {post.views}</span>
           </div>
        </div>
      </article>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Comments ({comments.length})
        </h3>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">{comment.user.username}</span>
                </div>
                <p className="text-gray-600 text-sm">{comment.body}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && <p className="text-gray-500 italic">No comments yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
