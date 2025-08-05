import { useParams } from "react-router-dom";
import certificateTemplates from "./certifcateTemplates/templates";
import type { CertificateProps } from "./certifcateTemplates/certificateTemplate1";

const ViewCertificate = () => {
  const { id } = useParams();
  const data = {
    recipientName: "John Doe",
    courseTitle: "Insurance Mastery",
    date: "July 31, 2025",
    certNumber: "RIMI-2025-001",
  };
  const Component = certificateTemplates.find((template) => template.id == id)
    ?.component as React.FC<CertificateProps>;
  return (
    <div
      className="py-5 sm:py-10"
    >
    <Component {...data} isPreview={false}/>

    </div>
  );
};

export default ViewCertificate;
