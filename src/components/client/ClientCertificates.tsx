import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { API_BASE } from "../../utils/ulrs";
import Spinner from "../Spinner";

interface CertRecord {
  id: number;
  certNumber: string;
  fileName: string;
  createdAt: string;
  course: { id: number; name: string };
}

const ClientCertificates: React.FC = () => {
  const [certs, setCerts] = useState<CertRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<CertRecord[]>(`${API_BASE}/certificates`)
      .then((res) => {
        console.log("from client cetificates ", res.data);
        setCerts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching certificates:", err);
        setCerts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 items-center">
        <Spinner className="w-10 h-10" />
        Loading certificates…
      </div>
    );
  }

  if (!loading && certs.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Certificates</h1>
        <p>
          No certificates issued yet. Please complete a course to get your
          certificate.
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-8">
      <h1 className="text-2xl text-text-dark font-bold my-4">
        My Certificates
      </h1>
      <ul className="flex flex-col items-center w-full sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:w-fit">
        {certs.map((c) => (
          <li
            key={c.id}
            title={c.course.name}
            className="border border-inputBorder p-2 max-w-[320px]"
          >
            <div className="flex flex-col gap-1">
              <img
                src="/certDummy.png"
                alt={c.course.name}
                className="w-full aspect-video h-44 border border-[#CB5A31]"
              />
              <h3 className="font-semibold text-text-dark line-clamp-1 mt-2">{c.course.name}</h3>
              <div className="text-sm text-text-dark font-semibold">
                Certificate ID:{" "}
                <span className="text-text-light font-normal">{c.certNumber}</span>
              </div>
              <div className="flex justify-between">
                <div className="text-sm text-text-dark font-semibold">
                  Issue Date:{" "}
                  <span className="text-text-light font-normal">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
               <a
              href={`${API_BASE}/uploads/certificates/${c.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 mt-2 bg-primary text-white cursor-pointer w-full text-center"
            >
              Download PDF
            </a>
            </div>
            
            {/* <div>
              <p className='text-xl font-semibold text-text-dark line-clamp-1'>{c.course.name}</p>
              <p className='text-text-light-2'>Issued: {new Date(c.createdAt).toLocaleDateString()}</p>
              <p className='text-text-light-2'>Cert #: {c.certNumber}</p>
            </div>
            <a
              href={`${API_BASE}/uploads/certificates/${c.fileName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white cursor-pointer w-fit"
            >
              Download PDF
            </a> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientCertificates;
