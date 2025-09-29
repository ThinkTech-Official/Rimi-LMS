import { useState, useEffect } from "react";
import adminApi from "../utils/adminApi";
import { API_BASE } from "./ulrs";
import Spinner from "../components/loaders/Spinner";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";

// Admin Image Component
interface AdminImageProps {
  courseId: number;
  className?: string;
  alt?: string;
  fallbackSrc?: string;
}

export const AdminImage: React.FC<AdminImageProps> = ({
  courseId,
  className = "",
  alt = "Image",
  fallbackSrc,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await adminApi.get(
          `${API_BASE}/files/admin/thumbnail/course/${courseId}`,
          {
            responseType: "blob",
          }
        );
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
        setError(false);
      } catch (error) {
        console.error("Failed to load thumbnail:", error);
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
      <div
        className={`${className} bg-gray-300 animate-pulse flex items-center justify-center`}
      ></div>
    );
  }

  if (error || !imageSrc) {
    if (fallbackSrc) {
      return <img src={fallbackSrc} alt={alt} className={className} />;
    }
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
};

// // Admin File Download Component
// interface AdminFileDownloadProps {
//   fileId: number;
//   fileName: string;
//   type?: 'document' | 'certificate';
//   children?: React.ReactNode;
//   className?: string;
// }

// export const AdminFileDownload: React.FC<AdminFileDownloadProps> = ({ 
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
//       const response = await adminApi.get(`${API_BASE}/files/admin/document/${fileId}`, {
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
// 2. ADMIN FILE DOWNLOAD COMPONENT (Documents only)
// ============================================
interface AdminFileDownloadProps {
  fileId: number;
  fileName: string;
  children?: React.ReactNode;
  className?: string;
}

export const AdminFileDownload: React.FC<AdminFileDownloadProps> = ({ 
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
      const response = await adminApi.get(`${API_BASE}/files/admin/document/${fileId}`, {
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
// 3. ADMIN CERTIFICATE DOWNLOAD COMPONENT
// ============================================
interface AdminCertificateDownloadProps {
  certificateId: number | string;
  fileName: string;
  children?: React.ReactNode;
  className?: string;
}

export const AdminCertificateDownload: React.FC<AdminCertificateDownloadProps> = ({ 
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
      const response = await adminApi.get(`${API_BASE}/files/admin/certificate/${certificateId}`, {
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
      {downloading ?
        <Spinner className="w-5 h-5 mr-2 disabled: cursor-default"/>
       : (
        children || <FaExternalLinkAlt className="w-4 h-4 fill-primary" />
      )}
    </button>
  );
};


// ================== Admin Video LInk =============


// Admin Video Link Component
interface AdminVideoLinkProps {
  courseId: number;
  children: React.ReactNode;
  className?: string;
}

export const AdminVideoLink: React.FC<AdminVideoLinkProps> = ({
  courseId,
  children,
  className = "text-primary hover:underline underline-offset-2 text-lg font-medium",
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleViewVideo = async () => {
    if (downloading) return;

    setDownloading(true);
    try {
      const response = await adminApi.get(
        `${API_BASE}/files/admin/video/course/${courseId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response.data);
      window.open(url, "_blank");

      // Clean up after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Video viewing failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleViewVideo}
      className={className}
      disabled={downloading}
    >
      {children}
      {downloading && <span className="ml-1">...</span>}
    </button>
  );
};
