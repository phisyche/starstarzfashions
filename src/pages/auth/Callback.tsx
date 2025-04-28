
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/context/SupabaseContext';

export default function Callback() {
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
        return;
      }
      
      navigate('/account');
    };

    handleAuthCallback();
  }, [navigate, supabase]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Login</h1>
        <p className="text-gray-600">Please wait while we complete your authentication...</p>
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
}
