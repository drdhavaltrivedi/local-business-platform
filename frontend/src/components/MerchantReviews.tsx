import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

interface MerchantReviewsProps {
  merchantId: string;
}

export function MerchantReviews({ merchantId }: MerchantReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [merchantId]);

  const loadReviews = async () => {
    try {
      const response = await api.get(`/reviews/merchant/${merchantId}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
        <div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${
                  star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">{reviews.length} reviews</div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            {review.comment && <p className="text-gray-700">{review.comment}</p>}
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">No reviews yet</div>
      )}
    </div>
  );
}

