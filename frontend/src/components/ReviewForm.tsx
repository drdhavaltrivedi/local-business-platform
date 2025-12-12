import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface ReviewFormProps {
  redemptionId: string;
  merchantId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ redemptionId, merchantId, onSuccess }: ReviewFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/reviews', {
        redemptionId,
        merchantId,
        rating: parseInt(data.rating),
        comment: data.comment,
      });
      toast.success('Review submitted successfully!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <select
          {...register('rating', { required: 'Rating is required' })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select rating</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Very Good</option>
          <option value="3">3 - Good</option>
          <option value="2">2 - Fair</option>
          <option value="1">1 - Poor</option>
        </select>
        {errors.rating && (
          <p className="text-red-500 text-xs mt-1">{errors.rating.message as string}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment (Optional)
        </label>
        <textarea
          {...register('comment')}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Share your experience..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

