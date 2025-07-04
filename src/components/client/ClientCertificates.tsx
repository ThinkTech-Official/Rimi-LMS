import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { API_BASE } from '../../utils/ulrs';

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
    return <p className="p-8">Loading certificates…</p>;
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Certificates</h1>
      <ul className="space-y-4">
        {certs.map(c => (
          <li key={c.id} className="border p-4 flex justify-between items-center">
            <div>
              <p><strong>{c.course.name}</strong></p>
              <p>Issued: {new Date(c.createdAt).toLocaleDateString()}</p>
              <p>Cert #: {c.certNumber}</p>
            </div>
            <a
              href={`${API_BASE}/uploads/certificates/${c.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white rounded"
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