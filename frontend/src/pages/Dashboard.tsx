import { useAuthStore } from '../store/authStore';
import { UserRole } from '@shared/types';
import { CustomerDashboard } from '../components/dashboards/CustomerDashboard';
import { MerchantDashboard } from '../components/dashboards/MerchantDashboard';
import { SalespersonDashboard } from '../components/dashboards/SalespersonDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';

export function Dashboard() {
  const { user, hasRole } = useAuthStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (hasRole(UserRole.ADMIN)) {
    return <AdminDashboard />;
  }

  if (hasRole(UserRole.MERCHANT)) {
    return <MerchantDashboard />;
  }

  if (hasRole(UserRole.SALESPERSON)) {
    return <SalespersonDashboard />;
  }

  if (hasRole(UserRole.CUSTOMER)) {
    return <CustomerDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.firstName}!</h1>
        <p className="mt-2 text-gray-600">Your account is being set up. Please wait for activation.</p>
      </div>
    </div>
  );
}

