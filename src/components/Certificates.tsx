import { useTranslation } from "react-i18next";

const Certificates: React.FC = () => {
  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language.split("-")[0];
  return (
    <div className="flex flex-col gap-10 my-10 overflow-auto m-2">
      {selectedLanguage === "en" ? (
        <div className="w-[1050px] mx-auto m-4 border">
          <div className="flex flex-col bg-white mx-auto">
            <div className="w-full p-4 pb-0 h-fit">
              <div className="w-full flex flex-col items-center justify-center gap-1 font-rufina text-[#4D4D4D] border border-b-0 border-[#CB5A31]">
                <img src="/rimilogo.png" alt="" className="w-[110px] mt-10" />
                <h1 className=" text-[4rem] uppercase mt-2">Certificate</h1>
                <div className="relative w-full flex justify-center">
                  <h2 className=" text-[2rem] -mt-5 uppercase px-1 z-5 text-[#4D4D4D]">
                    of Completion
                  </h2>
                  <div
                    className="w-[500px] absolute top-1/6 z-0"
                    style={{ border: "0.57px solid #FFFFFF" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white m-4 mt-0">
              <div className="border border-[#CB5A31] border-t-0 flex flex-col gap-4 justify-center items-center pt-3 pb-5 w-full">
                <p className="text-[2rem] text-[#4D4D4D] font-[200]">
                  This is to certify that
                </p>
                <p
                  className="text-[6.5rem] text-[#4D4D4D] -mt-8"
                  style={{ fontFamily: '"MonteCarlo", cursive' }}
                >
                  Reciepient Name
                </p>
                <p className="max-w-[750px] text-center text-[#4D4D4D] font-extralight">
                  has successfully completed the RIMI  Insurance Training
                  Program This achievement reflects the dedication, knowledge,
                  and skills demonstrated in understanding insurance principles,
                  policies, client servicing, and compliance standards as set by
                  RIMI Insurance Training Program
                </p>
                <div className="flex items-center gap-[30%] w-full justify-center text-[#4D4D4D] mt-2">
                  <div className="flex gap-2">
                    <span className="text-black">Date of Achievement:</span>
                    <span className="font-extralight">20-06-2025</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-black">Certificate Number:</span>
                    <span className="font-extralight">1232354664</span>
                  </div>
                </div>
                <span className="text-[#4D4D4D] font-extralight my-4 text-[24px]">
                  CERTIFICATE WAS AWARDED BY
                </span>
               <span className="text-[#4D4D4D] text-lg -mt-3">Head of Training & Development RIMI</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[1050px] mx-auto m-4 border bg-white">
  <div className="flex flex-col bg-white mx-auto">

    {/* HEADER */}
    <div className="w-full p-4 pb-0 h-fit">
      <div className="w-full flex flex-col items-center justify-center gap-1 font-rufina text-[#4D4D4D] border border-b-0 border-[#CB5A31]">
        <img src="/rimilogo.png" alt="" className="w-[110px] mt-10" />

        <h1 className="text-[4rem] uppercase mt-2">Certificat</h1>

        <div className="relative w-full flex justify-center">
          <h2 className="text-[2rem] uppercase -mt-5 px-1 z-10">
            de réussite
          </h2>
          <div
            className="w-[500px] absolute top-[55%] z-0"
            style={{ border: "0.57px solid #FFFFFF" }}
          ></div>
        </div>
      </div>
    </div>

    {/* BODY */}
    <div className="bg-white m-4 mt-0">
      <div className="border border-[#CB5A31] border-t-0 flex flex-col gap-4 justify-center items-center pt-3 pb-5 w-full">
        
        <p className="text-[2rem] text-[#4D4D4D] font-[200]">
          Ce document certifie que
        </p>

        <p
          className="text-[6.5rem] text-[#4D4D4D] -mt-8"
          style={{ fontFamily: '"MonteCarlo", cursive' }}
        >
          Reciepient Name
        </p>

        <p className="max-w-[750px] text-center text-[#4D4D4D] font-extralight">
          a complété avec succès la formation intitulée Rimi Training Program.
          Cette réussite témoigne de son engagement, de ses connaissances
          approfondies et des compétences démontrées dans la compréhension des
          principes de l'assurance, des politiques internes, du service à la
          clientèle ainsi que des normes de conformité établies par le
          programme de formation de RIMI Assurance.
        </p>

        {/* DATE + CERT # */}
        <div className="flex items-center gap-[30%] w-full justify-center text-[#4D4D4D] mt-2">
          <div className="flex gap-2">
            <span className="text-black">Date d’obtention:</span>
            <span className="font-extralight">01-09-2025</span>
          </div>

          <div className="flex gap-2">
            <span className="text-black">Numéro du certificat:</span>
            <span className="font-extralight">123456789</span>
          </div>
        </div>

        <span className="text-[#4D4D4D] font-extralight my-4 text-[24px]">
          CERTIFICAT DÉLIVRÉ PAR
        </span>

        <span className="text-[#4D4D4D] text-lg -mt-3">
          Responsable de la formation et du développement RIMI
        </span>
      </div>
    </div>
  </div>
</div>

      )}
      {/* 1 */}

      {/* certificate french */}

      {/* 2 */}
      {/* <div
        style={{
          width: "1050px",
          height: "820px",
          margin: "0 auto",
          border: "1px solid #2b00b7",
          padding: "16px",
        }}
      >
        <div
          style={{
            border: "1px solid #CB5A31",
            height: "100%",
            display: "flex",
            gap: "2.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              height: "820px",
              width: "auto",
              marginLeft: "1.25rem",
            }}
          >
            <img
              src="/certFrame.png"
              alt="Frame"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
                marginTop: "-17.5px",
              }}
            />
            <img
              src="/RIMI.svg"
              alt="RIMI Logo"
              style={{
                width: "120px",
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
                width: "100%",
                justifyContent: "center",
                color: "white",
                position: "absolute",
                bottom: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.875rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span>Date of Achievement:</span>
                <span>20-06-2025</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span>Certificate Number:</span>
                <span>1232354664</span>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: "1rem",
              paddingBottom: "1rem",
            }}
          >
            <h1
              style={{
                fontSize: "4rem",
                textTransform: "uppercase",
                marginTop: "0.5rem",
                fontFamily: "'Rufina', serif",
                color: "#4D4D4D",
                fontWeight: "bold",
              }}
            >
              Certificate
            </h1>
            <h2
              style={{
                fontSize: "2rem",
                color: "#B57E10",
                textTransform: "uppercase",
                paddingLeft: "0.25rem",
                paddingRight: "0.25rem",
                zIndex: 5,
              }}
            >
              of Completion
            </h2>
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ fontSize: "2rem", color: "#4D4D4D" }}>
                This is to certify that
              </p>
              <p
                style={{
                  fontSize: "6.5rem",
                  color: "#4D4D4D",
                  marginTop: "-0.75rem",
                  fontFamily: '"MonteCarlo", cursive',
                }}
              >
                Reciepient Name
              </p>
              <p
                style={{
                  maxWidth: "570px",
                  color: "#4D4D4D",
                  fontWeight: "200",
                  marginTop: "0.75rem",
                }}
              >
                has successfully completed the RIMI  Insurance Training Program
                This achievement reflects the dedication, knowledge, and skills
                demonstrated in understanding insurance principles, policies,
                client servicing, and compliance standards as set by RIMI
                Insurance Training Program
              </p>
            </div>
            <span
              style={{
                color: "#4D4D4D",
                fontSize: "2rem",
                fontWeight: "500",
                marginTop: "2rem",
              }}
            >
              CERTIFICATE WAS AWARDED BY
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                width: "100%",
                justifyContent: "center",
                color: "#4D4D4D",
                fontWeight: "200",
                marginTop: "2rem",
              }}
            >
               <div className="flex flex-col w-[300px] text-center justify-center items-center">
                <span>
                  <img src="/signature.png" alt="director" className="h-24" />
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    width: "300px",
                    textAlign: "center",
                    borderTop: "1px solid #000000",
                  }}
                >
                  Director RIMI
                </span>
              </div>
               <div className="flex flex-col w-[300px] text-center justify-center items-center">
                <span>
                  <img src="/signature.png" alt="director" className="h-24" />
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    width: "300px",
                    textAlign: "center",
                    borderTop: "1px solid #000000",
                  }}
                >
                  Head of Training & Development RIMI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Certificates;
