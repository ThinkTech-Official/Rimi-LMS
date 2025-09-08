import React from 'react';
import { 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint, 
  FaFileImage, 
  FaFileVideo, 
  FaFileAudio, 
  FaFileCode,
  FaFileArchive,
  FaFile 
} from 'react-icons/fa';

interface FileTypeIconProps {
  fileName: string;
  className?: string;
}

const FileTypeIcon: React.FC<FileTypeIconProps> = ({ fileName, className = "w-6 h-6" }) => {
  const getFileExtension = (filename: string): string => {
    return filename.toLowerCase().split('.').pop() || '';
  };

  const getIconByExtension = (extension: string) => {
    const iconProps = { className };

    switch (extension) {
      // PDF
      case 'pdf':
        return <FaFilePdf {...iconProps} className={`${className} fill-[#EF5350]`} />;
      
      // Word Documents
      case 'doc':
      case 'docx':
        return <FaFileWord {...iconProps} className={`${className} fill-[#2196F3]`} />;
      
      // Excel
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FaFileExcel {...iconProps} className={`${className} fill-[#4CAF50]`} />;
      
      // PowerPoint
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint {...iconProps} className={`${className} fill-[#FF9800]`} />;
      
      // Images
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp':
        return <FaFileImage {...iconProps} className={`${className} fill-[#9C27B0]`} />;
      
      // Videos
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'webm':
      case 'mkv':
        return <FaFileVideo {...iconProps} className={`${className} fill-[#F44336]`} />;
      
      // Audio
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
        return <FaFileAudio {...iconProps} className={`${className} fill-[#FF5722]`} />;
      
      // Code files
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
      case 'json':
      case 'xml':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'php':
      case 'rb':
      case 'go':
      case 'rs':
        return <FaFileCode {...iconProps} className={`${className} fill-[#607D8B]`} />;
      
      // Archives
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <FaFileArchive {...iconProps} className={`${className} fill-[#795548]`} />;
      
      // Text files
      case 'txt':
      case 'rtf':
        return <FaFile {...iconProps} className={`${className} fill-[#757575]`} />;
      
      // Default for unknown types
      default:
        return <FaFile {...iconProps} className={`${className} fill-[#9E9E9E]`} />;
    }
  };

  const extension = getFileExtension(fileName);
  return getIconByExtension(extension);
};

export default FileTypeIcon;