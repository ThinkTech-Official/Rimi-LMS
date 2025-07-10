import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { API_BASE } from '../../utils/ulrs';
import Spinner from '../Spinner';

interface CertRecord {
  id: number;
  certNumber: string;
  fileName: string;
  createdAt: string;
  course: { id: number; name: string };
}



const ClientCertificates: React.FC = () => {
  const [certs, setCerts] = useState<CertRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<CertRecord[]>(`${API_BASE}/certificates`)
      .then(res => {
        console.log('from client cetificates ', res.data)
        setCerts(res.data)
      })
      .catch(err => {
        console.error('Error fetching certificates:', err);
        setCerts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 items-center"><Spinner className='w-10 h-10'/>Loading certificates…</div>;
  }

  if (!loading && certs.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Certificates</h1>
        <p>No certificates issued yet. Please complete a course to get your certificate.</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-8">
      <h1 className="text-2xl text-text-dark font-bold my-4">My Certificates</h1>
      <ul className="space-y-4">
        {certs.map(c => (
          <li key={c.id} className="border border-inputBorder shadow-md p-4 flex gap-2 flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <p className='text-xl font-semibold text-text-dark'>{c.course.name}</p>
              <p className='text-text-light-2'>Issued: {new Date(c.createdAt).toLocaleDateString()}</p>
              <p className='text-text-light-2'>Cert #: {c.certNumber}</p>
            </div>
            <a
              href={`${API_BASE}/uploads/certificates/${c.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white cursor-pointer w-fit"
            >
              Download PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientCertificates;