import { useState, useEffect } from 'react';
import { couponsAPI } from '../../services/api';
import { Coupon } from '../../../../shared/types';

export function CustomerDashboard() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await couponsAPI.getCoupons({ status: 'active' });
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (couponId: string) => {
    try {
      // Request GPS location if needed
      let location: { latitude?: number; longitude?: number } = {};
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            redeemCoupon(couponId, location);
          },
          () => {
            redeemCoupon(couponId, {});
          }
        );
      } else {
        redeemCoupon(couponId, {});
      }
    } catch (error) {
      console.error('Failed to redeem coupon:', error);
    }
  };

  const redeemCoupon = async (couponId: string, location: { latitude?: number; longitude?: number }) => {
    try {
      await couponsAPI.redeemCoupon(couponId, location);
      alert('Coupon redeemed successfully!');
      loadCoupons();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to redeem coupon');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading coupons...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Available Coupons</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{coupon.title}</h3>
              <p className="text-gray-600 mb-4">{coupon.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`}
                </span>
                <button
                  onClick={() => handleRedeem(coupon.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

