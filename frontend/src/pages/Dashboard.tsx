import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../types';
import Button from '../components/Button';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, statsRes, storesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/stores', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUser(userRes.data);
        setStats(statsRes.data);
        setStores(storesRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Stores</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats?.totalStores || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Ratings</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.totalRatings || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
          onClick={() => navigate('/admin/stores')}
          variant="success"
          size="lg"
          className="w-full"
        >
          Manage Stores
        </Button>
        <Button
          onClick={() => navigate('/admin/users')}
          variant="primary"
          size="lg"
          className="w-full"
        >
          Manage Users
        </Button>
      </div>
    </div>
  );

  const renderStoreOwnerDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Average Rating</h4>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {stores.find(s => s.id === user.storeId)?.rating.toFixed(1) || '0.0'}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Total Ratings</h4>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stores.find(s => s.id === user.storeId)?.ratingCount || 0}
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={() => navigate('/store/ratings')}
        variant="primary"
        size="lg"
        className="w-full"
      >
        View Store Ratings
      </Button>
    </div>
  );

  const renderNormalUserDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Recent Activity</h3>
        <div className="space-y-4">
          {stores.slice(0, 3).map(store => (
            <div key={store.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{store.name}</h4>
                <p className="text-sm text-gray-500">{store.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Rating: {store.rating.toFixed(1)}</p>
                <Button
                  onClick={() => navigate(`/stores/${store.id}/rate`)}
                  variant="outline"
                  size="sm"
                >
                  Rate Store
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={() => navigate('/stores')}
        variant="primary"
        size="lg"
        className="w-full"
      >
        Browse All Stores
      </Button>
    </div>
  );

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-600 mt-1">{user.email}</p>
          </div>
          <div className="px-3 py-1 bg-blue-100 rounded-full">
            <span className="text-sm font-medium text-blue-800 capitalize">{user.role}</span>
          </div>
        </div>
      </div>

      {user.role === 'admin' && renderAdminDashboard()}
      {user.role === 'store_owner' && renderStoreOwnerDashboard()}
      {user.role === 'normal' && renderNormalUserDashboard()}

      <div className="mt-6">
        <Button
          onClick={() => navigate('/profile')}
          variant="outline"
          size="md"
          className="w-full"
        >
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;