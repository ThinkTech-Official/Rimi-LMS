import { useState, useEffect } from 'react';
import api from '../utils/api';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { API_BASE } from './ulrs';
import Spinner from '../components/loaders/Spinner';

// Client Image Component
interface ClientImageProps {
  courseId: number;
  className?: string;
  alt?: string;
  fallbackSrc?: string;
}

export const ClientImage: React.FC<ClientImageProps> = ({ 
  courseId, 
  className = "", 
  alt = "Image",
  fallbackSrc
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await api.get(`${API_BASE}/files/client/thumbnail/course/${courseId}`, {
          responseType: 'blob'
        });
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
        setError(false);
      } catch (error) {
        console.error('Failed to load thumbnail:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error || !imageSrc) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt} className={className} />;
    }
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
};

// // Client File Download Component
// interface ClientFileDownloadProps {
//   fileId: number;
//   fileName: string;
//   type?: 'document' | 'certificate';
//   children?: React.ReactNode;
//   className?: string;
// }

// // export const ClientFileDownload: React.FC<ClientFileDownloadProps> = ({ 
// //   fileId, 
// //   fileName, 
// //   type = 'document',
// //   children,
// //   className = "cursor-pointer"
// // }) => {
// //   const [downloading, setDownloading] = useState(false);

// //   const handleDownload = async () => {
// //     if (downloading) return;
    
// //     setDownloading(true);
// //     try {
// //       const response = await api.get(`${API_BASE}/files/client/document/${fileId}`, {
// //         responseType: 'blob'
// //       });
      
// //       const url = window.URL.createObjectURL(response.data);
// //       const link = document.createElement('a');
// //       link.href = url;
// //       link.setAttribute('download', fileName);
// //       document.body.appendChild(link);
// //       link.click();
// //       link.remove();
// //       window.URL.revokeObjectURL(url);
// //     } catch (error) {
// //       console.error('Download failed:', error);
// //     } finally {
// //       setDownloading(false);
// //     }
// //   };

// //   return (
// //     <button 
// //       onClick={handleDownload} 
// //       className={className}
// //       disabled={downloading}
// //     >
// //       {children || <FaExternalLinkAlt className="w-4 h-4 fill-primary" />}
// //       {downloading && <span className="ml-1">...</span>}
// //     </button>
// //   );
// // };


// export const ClientFileDownload: React.FC<ClientFileDownloadProps> = ({ 
//   fileId, 
//   fileName, 
//   type = 'document',
//   children,
//   className = "cursor-pointer"
// }) => {
//   const [downloading, setDownloading] = useState(false);

//   const handleDownload = async () => {
//     if (downloading) return;
    
//     setDownloading(true);
//     try {
//       // Build the correct endpoint URL based on type
//       let endpoint: string;
//       if (type === 'certificate') {
//         endpoint = `${API_BASE}/files/certificate/${fileId}`;
//       } else if (type === 'document') {
//         endpoint = `${API_BASE}/files/client/document/${fileId}`;
//       } else {
//         // For any other type, assume it's a direct path like 'client/document'
//         endpoint = `${API_BASE}/files/${type}/${fileId}`;
//       }

//       const response = await api.get(endpoint, {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(response.data);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Download failed:', error);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <button 
//       onClick={handleDownload} 
//       className={className}
//       disabled={downloading}
//     >
//       {children || <FaExternalLinkAlt className="w-4 h-4 fill-primary" />}
//       {downloading && <span className="ml-1"><Spinner /></span>}
//     </button>
//   );
// };


// ============================================
// 2. CLIENT FILE DOWNLOAD COMPONENT (Documents only)
// ============================================
interface ClientFileDownloadProps {
  fileId: number;
  fileName: string;
  children?: React.ReactNode;
  className?: string;
}

export const ClientFileDownload: React.FC<ClientFileDownloadProps> = ({ 
  fileId, 
  fileName, 
  children,
  className = "cursor-pointer"
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    
    setDownloading(true);
    try {
      const response = await api.get(`${API_BASE}/files/client/document/${fileId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      className={className}
      disabled={downloading}
    >
      {children || <FaExternalLinkAlt className="w-4 h-4 fill-primary" />}
      {downloading && <span className="ml-1"><Spinner /></span>}
    </button>
  );
};





// ============================================
// 3. CLIENT CERTIFICATE DOWNLOAD COMPONENT
// ============================================
interface ClientCertificateDownloadProps {
  certificateId: number;
  fileName: string;
  children?: React.ReactNode;
  className?: string;
}

export const ClientCertificateDownload: React.FC<ClientCertificateDownloadProps> = ({ 
  certificateId, 
  fileName, 
  children,
  className = "cursor-pointer"
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    
    setDownloading(true);
    try {
      const response = await api.get(`${API_BASE}/files/certificate/${certificateId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Certificate download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      className={className}
      disabled={downloading}
    >
      {children || <FaExternalLinkAlt className="w-4 h-4 fill-primary" />}
      {downloading && <span className="ml-1"><Spinner /></span>}
    </button>
  );
};