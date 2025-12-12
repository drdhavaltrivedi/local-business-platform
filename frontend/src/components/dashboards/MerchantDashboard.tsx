import { useState, useEffect } from 'react';
import { couponsAPI } from '../../services/api';
import { Coupon } from '../../../../shared/types';

export function MerchantDashboard() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await couponsAPI.getCoupons();
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Coupons</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Create Coupon
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{coupon.title}</h3>
              <p className="text-gray-600 mb-4">{coupon.description}</p>
              <div className="text-sm text-gray-500">
                Status: <span className="font-semibold">{coupon.status}</span>
              </div>
              <div className="text-sm text-gray-500">
                Redemptions: {coupon.currentRedemptions} / {coupon.maxRedemptions || '∞'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

