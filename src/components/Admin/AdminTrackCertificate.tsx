

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
    <div className="w-[95%] sm:max-w-xl mx-auto p-6 bg-white shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-text-dark">Verify Certificate</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter certificate number"
          className="flex-1 px-4 py-2 sm:py-3 border border-inputBorder focus:outline-none focus:ring-1 focus:ring-primary text-text-light-2"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 sm:py-3 bg-primary text-white cursor-pointer hover:bg-indigo-700 transition-colors delay-100"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-sm font-semibold text-center">{error}</div>
      )}

      {certificate && (
        <div className="mt-6 border border-inputBorder p-2 sm:p-4">
          <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">Certificate Found</h3>
          <p className='text-text-light'><span className="font-medium text-text-dark">Name:</span> {certificate.user.name}</p>
          <p className='text-text-light'><span className="font-medium text-text-dark">Email:</span> {certificate.user.email}</p>
          <p className='text-text-light'><span className="font-medium text-text-dark">Course:</span> {certificate.course.name}</p>
          <p className='text-text-light'><span className="font-medium text-text-dark">Issued At:</span> {new Date(certificate.createdAt).toLocaleString()}</p>
          <p className='text-text-light'><span className="font-medium text-text-dark">Certificate #:</span> {certificate.certNumber}</p>
          {certificate.fileName && (
            <p className="mt-2">
              <a
                href={`${API_BASE}/uploads/certificates/${certificate.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
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
