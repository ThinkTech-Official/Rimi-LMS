import React, { useState, useRef } from "react";
import Certificate from "../components/certificates/Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import CertificateFrench from "../components/certificates/CertificateFrench";

/**
 * A standalone component to preview and download the Certificate template
 * by typing in a recipient name.
 */
const TestCertificate: React.FC = () => {
  const [name, setName] = useState("");
  const certRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const selectedLanguage = i18n.language.split("-")[0];
  // Static values for testing
  const courseTitle = "Sample Course";
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const certNumber = `CERT-1-1-${Date.now()}`;

  const handleDownload = async () => {
    if (!certRef.current) return;
    // ensure fonts are loaded
    await document.fonts.ready;
    // render to canvas
    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`certificate-${name || "recipient"}.pdf`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Certificate Preview & Download
      </h1>

      <label htmlFor="recipient" className="block mb-2 font-medium">
        Recipient Name:
      </label>
      <input
        id="recipient"
        type="text"
        placeholder="Enter recipient name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full max-w-lg"
      />

      {name && (
        <>
          <div className="mt-8 mb-4">
            <button
              onClick={handleDownload}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Download PDF
            </button>
          </div>

          <div ref={certRef} className="border p-4 inline-block">
            {selectedLanguage === "en" ? (
              <Certificate
                recipientName={name}
              courseTitle={courseTitle}
              date={date}
              certNumber={certNumber}
              />
            ) : (
              <CertificateFrench
               recipientName={name}
              courseTitle={courseTitle}
              date={date}
              certNumber={certNumber}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TestCertificate;
