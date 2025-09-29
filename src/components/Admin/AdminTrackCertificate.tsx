import React, { useEffect, useState } from "react";
import { useAdminCertificateSearch } from "../../hooks/useAdminCertificateSearch";
import { API_BASE } from "../../utils/ulrs";
import { set, useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RxCross2 } from "react-icons/rx";
import { AdminCertificateDownload } from "../../utils/AdminFileComponents";
import { MdOutlineFileDownload } from "react-icons/md";

const AdminTrackCertificate: React.FC = () => {
  const { certificate, loading, searchCertificate, setCertificate } =
    useAdminCertificateSearch();
  const [searchFailed, setSearchFailed] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ certificateNumber: string }>();

  const watchedCertNum = watch("certificateNumber");

  const onSubmit: SubmitHandler<{ certificateNumber: string }> = async (
    data
  ) => {
    await searchCertificate(data.certificateNumber);
    if (!certificate) {
      setSearchFailed(true);
    }
  };

  const handleClearInput = () => {
    setValue("certificateNumber", "");
    setCertificate(null);
    setSearchFailed(false);
  };

  useEffect(() => {
    if (searchFailed && (certificate || watchedCertNum)) {
      setSearchFailed(false);
    }
  }, [watchedCertNum, certificate]);
  const d = certificate?.createdAt
    ? new Date(certificate.createdAt)
    : new Date();
  const formattedDate = [
    String(d.getDate()).padStart(2, "0"),
    String(d.getMonth() + 1).padStart(2, "0"),
    d.getFullYear(),
  ].join("-");

  return (
    <div className="w-[95%] sm:max-w-xl mx-auto p-6 bg-white shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-text-dark">
        {t("Verify Certificate")}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4"
      >
        <div className="relative w-full">
          <input
            type="text"
            {...register("certificateNumber", {
              required: t("Certificate ID is required"),
            })}
            placeholder={t("Enter certificate ID")}
            className="flex-1 px-4 py-2 sm:py-3 border border-inputBorder focus:outline-none focus:ring-1 focus:ring-primary text-text-light-2 w-full"
          />
          {watchedCertNum && (
            <RxCross2
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer h-5 w-5"
              onClick={handleClearInput}
            />
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 sm:py-3 bg-primary text-white cursor-pointer hover:bg-indigo-700 transition-colors delay-100"
        >
          {loading ? `${t("Searching")}...` : `${t("Search")}`}
        </button>
      </form>

      {errors.certificateNumber && (
        <div className="text-red-500">{errors.certificateNumber.message}</div>
      )}

      {certificate ? (
        <div className="mt-6 border border-inputBorder p-2 sm:p-4 relative">
          <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">
            {t("Certificate Found")}
          </h3>
          <p className="text-text-light">
            <span className="font-medium text-text-dark">{t("name")}:</span>{" "}
            {certificate.user.name}
          </p>
          <p className="text-text-light">
            <span className="font-medium text-text-dark">{t("Email")}:</span>{" "}
            {certificate.user.email}
          </p>
          <p className="text-text-light">
            <span className="font-medium text-text-dark">{t("Course")}:</span>{" "}
            {certificate.course.name}
          </p>
          <p className="text-text-light">
            <span className="font-medium text-text-dark">
              {t("Issued at")}:
            </span>{" "}
            {formattedDate}
          </p>
          <p className="text-text-light">
            <span className="font-medium text-text-dark">
              {t("Certificate")} ID:
            </span>{" "}
            {certificate.certNumber}
          </p>
          {certificate.fileName && (
            <p className="mt-2 absolute top-2 right-2">
              {/* <a
                href={`${API_BASE}/uploads/certificates/${certificate.fileName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                {t("View Certificate")}
              </a> */}
              <AdminCertificateDownload
                certificateId={certificate.id}
                fileName={`Certificate-${certificate.id}.pdf`}
              >
                <MdOutlineFileDownload className="w-7 h-7 mr-2 fill-primary cursor-pointer" />
              </AdminCertificateDownload>
            </p>
          )}
        </div>
      ) : (
        searchFailed &&
        watchedCertNum && (
          <p className="text-base text-red-500 mb-2">
            {t("Certificate with this ID not found")}
          </p>
        )
      )}
    </div>
  );
};

export default AdminTrackCertificate;
