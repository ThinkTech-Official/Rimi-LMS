import React from "react";

interface CertificateProps {
  recipientName: string;
  courseTitle: string;
  date: string;
  certNumber: string;
}

const CertificateFrench: React.FC<CertificateProps> = ({
  recipientName,
  date,
  courseTitle,
  certNumber,
}) => {
  return (
    <div
      style={{
        width: "1050px",
        margin: "0 auto",
        border: "1px solid #2b00b7",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "#2b00b7",
            padding: "16px",
            paddingBottom: "0",
            height: "fit-content",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              fontFamily: "'Rufina', serif",
              color: "white",
              border: "1px solid #CB5A31",
              borderBottom: "none",
            }}
          >
            <img
              src="/RIMI.svg"
              alt=""
              style={{
                width: "110px",
                marginTop: "2.5rem",
              }}
            />
            <h1
              style={{
                fontSize: "4rem",
                textTransform: "uppercase",
                marginTop: "-1rem",
              }}
            >
              Certificat
            </h1>
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "2rem",
                  textTransform: "uppercase",
                  paddingLeft: "0.25rem",
                  paddingRight: "0.25rem",
                  zIndex: 5,
                  backgroundColor: "#2b00b7",
                  position: "relative",
                }}
              >
                de réussite
              </h2>
              <div
                style={{
                  border: "0.57px solid #FFFFFF",
                  width: "500px",
                  position: "absolute",
                  zIndex: 0,
                  top: "80%",
                }}
              ></div>
            </div>
            <img
              src="/certCurve.svg"
              alt=""
              style={{ marginTop: "1.3rem", marginBottom: "-1px" }}
            />
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#ffffff",
            margin: "1rem",
            marginTop: 0,
          }}
        >
          <div
            style={{
              border: "1px solid #CB5A31",
              borderTop: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "0.75rem",
              paddingBottom: "1.25rem",
              width: "100%",
            }}
          >
            <p
              style={{
                fontSize: "2rem",
                color: "#4D4D4D",
                fontWeight: 200,
              }}
            >
              Ce document certifie que 
            </p>
            <p
              style={{
                fontSize: "6.5rem",
                color: "#4D4D4D",
                marginTop: "-4rem",
                fontFamily: '"MonteCarlo", cursive',
                paddingBottom: "20px",
                textTransform: "capitalize",
              }}
            >
              {recipientName}
            </p>
            <p
              style={{
                maxWidth: "750px",
                textAlign: "center",
                color: "#4D4D4D",
                fontWeight: 200,
                marginTop: "-0.5rem",
              }}
            >
              a complété avec succès la formation intitulée {courseTitle}. Cette réussite témoigne de son engagement, de ses connaissances approfondies et des compétences démontrées dans la compréhension des principes de l'assurance, des politiques internes, du service à la clientèle ainsi que des normes de conformité établies par le programme de formation de RIMI Assurance. 
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30%",
                width: "100%",
                justifyContent: "center",
                color: "#4D4D4D",
                marginTop: "0.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#000000" }}>Date d’obtention:</span>
                <span style={{ fontWeight: 200 }}>{date}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#000000" }}>Numéro du certificat:</span>
                <span style={{ fontWeight: 200 }}>{certNumber}</span>
              </div>
            </div>
            <span
              style={{
                color: "#4D4D4D",
                fontWeight: 200,
                marginTop: "1rem",
                marginBottom: "0.5rem",
                fontSize: "22px",
              }}
            >
              CERTIFICAT DÉLIVRÉ PAR
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10%",
                width: "100%",
                justifyContent: "center",
                color: "#4D4D4D",
                fontWeight: 200,
              }}
            >
              <div className="flex flex-col w-[350px] text-center justify-center items-center">
                <span>
                  <img src="/signature.png" alt="director" className="h-24" />
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    width: "350px",
                    textAlign: "center",
                    borderTop: "1px solid #000000",
                  }}
                >
                  Directeur RIMI
                </span>
              </div>
              <div className="flex flex-col w-[350px] text-center justify-center items-center">
                <span>
                  <img src="/signature.png" alt="director" className="h-24" />
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    width: "350px",
                    textAlign: "center",
                    borderTop: "1px solid #000000",
                    textWrap: "nowrap",
                  }}
                >
                  Responsable Formation & Développement RIMI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateFrench;
