export interface CertificateProps {
  recipientName: string;
  courseTitle: string;
  date: string;
  certNumber: string;
  isPreview?: boolean;
}
const CertificateTemplate1: React.FC<CertificateProps> = ({
  recipientName,
  courseTitle,
  date,
  certNumber,
  isPreview,
}) => {
  return  (
    <div
      style={{
        width: isPreview ? "950px" : "1050px",
        height: isPreview ? "700px" : "850px",
        margin: isPreview ? "0" : "0 auto",
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
            backgroundColor: "#2b00b7",
            padding: "16px",
            paddingBottom: "0",
            height: "fit-content",
          }}
        >
          <div
            style={{
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
                width: isPreview ? "90px" : "110px",
                marginTop: "2.5rem",
              }}
            />
            <h1
              style={{
                fontSize: isPreview ? "2.5rem" : "4rem",
                textTransform: "uppercase",
                marginTop: isPreview ? "1rem" : "-1rem",
              }}
            >
              Certificate
            </h1>
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                marginTop: isPreview ? "-2rem" : "",
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
                of Completion
              </h2>
              <div
                style={{
                  border: "0.57px solid #FFFFFF",
                  width: "500px",
                  position: "absolute",
                  zIndex: 0,
                  top: isPreview ? "50%" : "80%",
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
                marginTop: isPreview ? "0.15rem" : "",
              }}
            >
              This is to certify that
            </p>
            <p
              style={{
                fontSize: isPreview ? "4.3rem" : "6.5rem",
                color: "#4D4D4D",
                marginTop: isPreview?"-4.5rem":"-3rem",
                fontFamily: '"MonteCarlo", cursive',
                paddingBottom: "20px",
                textTransform: "capitalize",
              }}
            >
              {recipientName}
            </p>
            <p
              style={{
                maxWidth: isPreview?"700px":"750px",
                textAlign: "center",
                color: "#4D4D4D",
                fontWeight: 200,
                marginTop: isPreview ? "-7rem" : "-1rem",
              }}
            >
              has successfully completed the RIMI Insurance Training Program
              This achievement reflects the dedication, knowledge, and skills
              demonstrated in understanding insurance principles, policies,
              client servicing, and compliance standards as set by RIMI
              Insurance Training Program
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "30%",
                width: "100%",
                justifyContent: "center",
                color: "#4D4D4D",
                marginTop: isPreview ? "-1rem" : "0.5rem",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#000000" }}>Date of Achievement:</span>
                <span style={{ fontWeight: 200 }}>{date}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#000000" }}>Certificate Number:</span>
                <span style={{ fontWeight: 200 }}>{certNumber}</span>
              </div>
            </div>
            <span
              style={{
                color: "#4D4D4D",
                fontWeight: 200,
                marginTop: isPreview?"0rem":"1rem",
                marginBottom: isPreview?"-1rem":"0.5rem",
                fontSize: isPreview?"16px":"22px",
              }}
            >
              CERTIFICATE WAS AWARDED BY
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
              <div className="flex flex-col w-[300px] text-center justify-center items-center">
                <span>
                  <img src="/signature.png" alt="director" style={{
                      height: isPreview ? "85px" : "96px",
                     }}/>
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
                  <img src="/signature.png" alt="director" style={{
                     height: isPreview ? "85px" : "96px",
                    }}/>
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
      </div>
    </div>
  )
};

export default CertificateTemplate1;