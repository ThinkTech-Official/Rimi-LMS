import { useNavigate } from "react-router-dom";
import Frame from "react-frame-component";
import { type CertificateProps } from "./certifcateTemplates/certificateTemplate1";
import certificateTemplates from "./certifcateTemplates/templates";
import { useState } from "react";

export default function Certificates() {
  const navigate = useNavigate();
  const [activeTemplateId, setActiveTemplateId] = useState<string>("");
  const data = {
    recipientName: "John Doe",
    courseTitle: "Insurance Mastery",
    date: "July 31, 2025",
    certNumber: "RIMI-2025-001",
  };

  const handleViewCertificate = (id: string) => {
    navigate(`/admin/view-cert/${id}`);
  };
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-fit"
      style={{
        padding: "1rem",
        justifyItems: "start",
        alignItems: "start",
      }}
    >
      {certificateTemplates.map((template) => (
        <div className="flex flex-col border border-inputBorder shadow-md bg-[#fbfbfc]">
          <CertificatePreview
            key={template.id}
            isActive={activeTemplateId === template.id}
            TemplateComponent={template.component}
            data={data}
          />
          <div className="flex flex-col gap-2 px-2 pb-2">
            <h3 className="font-semibold text-text-dark">{template.title}</h3>
            <div className="flex justify-between flex-col gap-2">
              <button
                className="bg-primary text-white px-4 py-2 font-semibold hover:bg-indigo-700 transition-all duration-200 cursor-pointer"
                onClick={() => handleViewCertificate(template.id)}
              >
                {activeTemplateId === template.id ? "Activated" : "Activate"}
              </button>
              <button className="border border-inputBorder px-4 py-2 font-semibold cursor-pointer hover:text-text-light-2 hover:border-primary transition-all duration-200"
                onClick={() => navigate(`/admin/view-cert/${template.id}`)}
              >
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const CertificatePreview = ({
  TemplateComponent,
  isActive,
  data,
}: {
  TemplateComponent: React.FC<CertificateProps>;
  isActive: boolean;
  data: Omit<CertificateProps, "isPreview">;
}) => (
  <div style={{ width: `${980 * 0.3}px`, height: `${760 * 0.3}px` }}>
    <Frame
      style={{
        width: "980px",
        height: "760px",
        transform: "scale(0.3)",
        transformOrigin: "top left",
        pointerEvents: "none",
        overflow: "hidden",
      }}
      head={
        <>
          <link
            href="https://fonts.googleapis.com/css2?family=MonteCarlo&family=Rufina&display=swap"
            rel="stylesheet"
          />
        </>
      }
    >
      <TemplateComponent {...data} isPreview={true} />
    </Frame>
  </div>
);
