import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import RatingStars from '../components/RatingStars';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  rating: number;
  userRating?: number;
  ratingCount: number;
}

const Stores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchStores();
  }, [navigate]);

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stores', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStores(res.data);
    } catch (error) {
      setError('Failed to fetch stores. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (storeId: string, rating: number) => {
    try {
      await axios.post(
        `http://localhost:5000/api/stores/${storeId}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchStores(); // Refresh store data
    } catch (error) {
      setError('Failed to submit rating. Please try again.');
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse Stores</h2>
        
        <FormInput
          label="Search Stores"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or address..."
          className="mb-6"
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredStores.map(store => (
            <div key={store.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.address}</p>
                  <div className="mt-2 flex items-center">
                    <RatingStars rating={store.rating} />
                    <span className="ml-2 text-sm text-gray-600">
                      ({store.ratingCount} ratings)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {store.userRating ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Your Rating:</p>
                      <RatingStars
                        rating={store.userRating}
                        interactive
                        onChange={(rating) => handleRating(store.id, rating)}
                      />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/stores/${store.id}/rate`)}
                    >
                      Rate Store
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No stores found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;
