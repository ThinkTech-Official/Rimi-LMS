

// const AdminTrackCertificate = () => {
//   return (
//     <div>AdminTrackCertificate</div>
//   )
// }

// export default AdminTrackCertificate



import React, { useState } from 'react';
import { useAdminCertificateSearch } from '../../hooks/useAdminCertificateSearch';
import { API_BASE } from '../../utils/ulrs';

const AdminTrackCertificate: React.FC = () => {
  const [input, setInput] = useState('');
  const { certificate, loading, error, searchCertificate } = useAdminCertificateSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    searchCertificate(input.trim());
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Certificate</h2>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter certificate number"
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-sm font-semibold text-center">{error}</div>
      )}

      {certificate && (
        <div className="mt-6 border rounded shadow p-4">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Certificate Found</h3>
          <p><span className="font-medium">Name:</span> {certificate.user.name}</p>
          <p><span className="font-medium">Email:</span> {certificate.user.email}</p>
          <p><span className="font-medium">Course:</span> {certificate.course.name}</p>
          <p><span className="font-medium">Issued At:</span> {new Date(certificate.createdAt).toLocaleString()}</p>
          <p><span className="font-medium">Certificate #:</span> {certificate.certNumber}</p>
          {certificate.fileName && (
            <p className="mt-2">
              <a
                href={`${API_BASE}/uploads/certificates/${certificate.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                View PDF
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTrackCertificate;
