import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../components/admin/AdminLogin';
import AdminLayout from '../components/admin/AdminLayout';

export default function AdminPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return <AdminLayout />;
}
