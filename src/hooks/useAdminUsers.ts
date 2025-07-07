
// import { useState, useEffect } from 'react';
// import adminApi from '../utils/adminApi';
// import { API_BASE } from '../utils/ulrs';

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   course: string;
//   progress: number;
//   certificateIssued: boolean;
// }




// export const useAdminUsers = () => {
//   const [users, setUsers]     = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState<string>('');

//   useEffect(() => {
//     adminApi.get<User[]>(`${API_BASE}/admin/users`)
//       .then(res => {
//         console.log('from use admin hook ', res.data)
//         setUsers(res.data)}
//     )
//       .catch(err => setError(err.response?.data?.message || err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   return { users, loading, error };
// };





import { useState, useEffect } from 'react';
import adminApi from '../utils/adminApi';
import { API_BASE } from '../utils/ulrs';

export interface User {
  id: number;
  name: string;
  email: string;
  course: string;
  progress: number;
  certificateIssued: boolean;
}

export const useAdminUsers = (
  page: number,
  limit: number,
) => {
  const [data, setData]     = useState<User[]>([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading]= useState(true);
  const [error, setError]   = useState<string>('');

  useEffect(() => {
    setLoading(true);
    adminApi.get<{
      data: User[];
      total: number;
      page: number;
      limit: number;
    }>(`${API_BASE}/admin/users`, { params: { page, limit } })
      .then(res => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, limit]);

  return { users: data, total, loading, error };
};