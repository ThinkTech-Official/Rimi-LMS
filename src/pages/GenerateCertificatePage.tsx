import React, { useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Certificate from "../components/certificates/Certificate";
import CertificateFrench from "../components/certificates/CertificateFrench";
import { useGenerateCertificate } from "../hooks/useGenerateCertificate";
import { useAuth } from "../context/AuthContext";
import SquareLoader from "../components/loaders/SquareLoader";
import { useTranslation } from "react-i18next";

interface LocationState {
  courseTitle: string;
  userName: string;
}

export const GenerateCertificatePage: React.FC = () => {
  const { user } = useAuth();

  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const state = location.state as LocationState;
  const certRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const selectedLanguage = i18n.language.split("-")[0];
  // Kick off generation on mount
  const { status, certData } = useGenerateCertificate({
    courseId: courseId!,
    recipientName: state.userName,
    courseTitle: state.courseTitle,
    certRef,
  });

  if (status === "error") {
    return (
      <div className="p-8 text-red-500">{t("Failed to generate certificate")}.</div>
    );
  }

  if (!user?.name) return <p>No User Logged in</p>;

  return (
    <div className="p-8">
      <div className="flex flex-col justify-center items-center gap-3 fixed top-1/2 left-1/2">
        <SquareLoader />
        <p>{t("Processing Certificate")}...</p>
      </div>

      {/* Hidden Certificate for html2canvas */}
      {certData && (
        <div
          ref={certRef}
          style={{ position: "absolute", left: -10000, top: 0 }}
        >
          {selectedLanguage === "en" ? (
            <Certificate
              recipientName={user?.name}
              courseTitle={certData.course.name}
              date={new Date(certData.createdAt).toLocaleDateString()} // certData.createdAt is string
              certNumber={certData.certNumber}
            />
          ) : (
            <CertificateFrench
              recipientName={user?.name}
              courseTitle={certData.course.name}
              date={new Date(certData.createdAt).toLocaleDateString()} // certData.createdAt is string
              certNumber={certData.certNumber}
            />
          )}
        </div>
      )}
    </div>
  );
};
