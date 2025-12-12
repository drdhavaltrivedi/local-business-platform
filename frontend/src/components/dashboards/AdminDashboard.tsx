import { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface Analytics {
  totalUsers: number;
  totalMerchants: number;
  totalCoupons: number;
  totalRedemptions: number;
  totalRevenue: number;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  status: string;
  created_at: string;
}

interface Coupon {
  id: string;
  title: string;
  status: string;
  merchant_id: string;
  created_at: string;
}

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingCoupons, setPendingCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'coupons'>('overview');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const analyticsRes = await api.get('/admin/analytics');
        setAnalytics(analyticsRes.data.analytics);
      } else if (activeTab === 'users') {
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data.users);
      } else if (activeTab === 'coupons') {
        const couponsRes = await api.get('/admin/coupons/pending');
        setPendingCoupons(couponsRes.data.coupons);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/activate`);
      loadData();
      alert('User activated successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to activate user');
    }
  };

  const handleApproveCoupon = async (couponId: string) => {
    try {
      await api.post(`/admin/coupons/${couponId}/approve`);
      loadData();
      alert('Coupon approved successfully');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to approve coupon');
    }
  };

  const handleRejectCoupon = async (couponId: string) => {
    try {
      await api.post(`/admin/coupons/${couponId}/reject`);
      loadData();
      alert('Coupon rejected');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to reject coupon');
    }
  };

  if (loading && activeTab === 'overview') {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`${
                activeTab === 'coupons'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Coupons
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Merchants</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalMerchants}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Coupons</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalCoupons}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Redemptions</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalRedemptions}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${analytics.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.status !== 'active' && (
                        <button
                          onClick={() => handleActivateUser(user.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            {pendingCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{coupon.title}</h3>
                    <p className="text-sm text-gray-500">Status: {coupon.status}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApproveCoupon(coupon.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectCoupon(coupon.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingCoupons.length === 0 && (
              <div className="text-center py-8 text-gray-500">No pending coupons</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
