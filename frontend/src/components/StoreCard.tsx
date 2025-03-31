import { useState } from 'react';
import axios from 'axios';
import { Store } from '../types';
import RatingStars from './RatingStars';

interface StoreCardProps {
    store: Store;
    onRatingSubmitted?: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onRatingSubmitted }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleRate = async (rating: number) => {
        setIsSubmitting(true);
        setError('');

        try {
            await axios.post(
                'http://localhost:5000/api/ratings',
                { storeId: store._id, rating },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);

            if (onRatingSubmitted) {
                onRatingSubmitted();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Store
                    </span>
                </div>

                <p className="text-gray-600 mb-4">
                    {store.description || 'No description provided'}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                    </svg>
                    {store.createdBy?.email || 'Unknown creator'}
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            Rate this store:
                        </label>
                        <RatingStars onRate={handleRate} />
                    </div>

                    {isSubmitting && (
                        <p className="mt-2 text-sm text-gray-600">Submitting rating...</p>
                    )}

                    {showSuccess && (
                        <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                            Rating submitted successfully!
                        </div>
                    )}

                    {error && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreCard;
