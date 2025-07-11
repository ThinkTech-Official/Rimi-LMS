import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../utils/adminApi';
import { useAdminContext } from '../context/AdminContext';
import { API_BASE } from '../utils/ulrs';


export const useAdminLogout = () => {
  const { reload } = useAdminContext();
  const navigate = useNavigate();

  return useCallback(async () => {
    try {
      // tell the server to revoke & clear cookies
      await adminApi.post(`${API_BASE}/admin/auth/logout`);
    } catch(error) {
      console.log('Some error in logout', error)
    }
    await reload();
    // navigate to login
    navigate('/adminlogin');
  }, [reload, navigate]);
};