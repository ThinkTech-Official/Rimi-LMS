interface CertificateProps {
  recipientName: string;
  courseTitle: string;
  date: string;
  certNumber: string;
  isPreview?: boolean;
}
const CertificateTemplate2: React.FC<CertificateProps> = ({
  recipientName,
  courseTitle,
  date,
  certNumber,
  isPreview,
}) => {
  return (
    <div
      style={{
        width: isPreview ? "930px" : "1050px",
        height: isPreview ? "670px" : "850px",
        margin: isPreview ? "0" : "0 auto",
        border: "1px solid #2b00b7",
        padding: "16px",
      }}
    >
      <div
        style={{
          border: "1px solid #CB5A31",
          height: isPreview ? "670px" : "815px",
          display: "flex",
          gap: "2.5rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "auto",
            marginLeft: "1.25rem",
          }}
        >
          <img
            src="/certFrame.png"
            alt="Frame"
            style={{
              height: isPreview ? "105%" : "850px",
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
              bottom: "8%",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "0.875rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span>Date of Achievement:</span>
              <span>{date}</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span>Certificate Number:</span>
              <span>{certNumber}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: isPreview ? "1rem" :"2.5rem",
            paddingBottom: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: isPreview ? "2rem" : "4rem",
              textTransform: "uppercase",
              fontFamily: "'Rufina', serif",
              color: "#4D4D4D",
              fontWeight: "bold",
            }}
          >
            Certificate
          </h1>
          <h2
            style={{
              fontSize: isPreview ? "1.5rem" : "2rem",
              color: "#B57E10",
              textTransform: "uppercase",
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
              zIndex: 5,
            }}
          >
            of Completion
          </h2>
          <div style={{ marginTop: isPreview ? "-1rem" : "1.5rem" }}>
            <p style={{ fontSize: "2rem", color: "#4D4D4D" }}>
              This is to certify that
            </p>
            <p
              style={{
                fontSize: isPreview ? "4.5rem" : "6.5rem",
                color: "#4D4D4D",
                marginTop: isPreview ? "-3rem" : "-2rem",
                fontFamily: '"MonteCarlo", cursive',
                textTransform: "capitalize",
              }}
            >
              {recipientName}
            </p>
            <p
              style={{
                maxWidth: "570px",
                color: "#4D4D4D",
                fontWeight: "200",
                marginTop: isPreview ? "-4rem" : "0.75rem",
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
              fontSize: isPreview ? "1.5rem" : "2rem",
              fontWeight: "500",
              marginTop: isPreview ? "1rem" : "2rem",
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
              marginTop: isPreview ? "1rem" : "3rem",
            }}
          >
            <div className="flex flex-col w-[300px] text-center justify-center items-center">
              <span>
                <img
                  src="/signature.png"
                  alt="director"
                  style={{
                    height: isPreview ? "85px" : "96px",
                  }}
                />
              </span>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  width: isPreview ? "200px" : "300px",
                  textAlign: "center",
                  borderTop: "1px solid #000000",
                }}
              >
                Director RIMI
              </span>
            </div>
            <div className="flex flex-col w-[300px] text-center justify-center items-center">
              <span>
                <img
                  src="/signature.png"
                  alt="director"
                  style={{
                    height: isPreview ? "85px" : "96px",
                  }}
                />
              </span>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  width: isPreview ? "270px" : "300px",
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
    </div>
  );
};
export default CertificateTemplate2;
