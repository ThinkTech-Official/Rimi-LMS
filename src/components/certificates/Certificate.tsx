import React from "react";

interface CertificateProps {
  recipientName: string;
  courseTitle: string;
  date: string;
  certNumber: string;
}

const Certificate: React.FC<CertificateProps> = ({
  recipientName,
  courseTitle,
  date,
  certNumber,
}) => {

  const certText = `has successfully completed the ${courseTitle}
              This achievement reflects the dedication, knowledge, and skills
              demonstrated in understanding insurance principles, policies,
              client servicing, and compliance standards as set by RIMI
              Insurance Training Program`

  return (
    // <>
    //   <div className="w-[1050px] mx-auto m-4 border">
    //     <div className="flex flex-col bg-white mx-auto">
    //       <div className="w-full bg-primary p-4 pb-0 h-fit">
    //         <div className="w-full flex flex-col items-center justify-center gap-1 font-rufina text-white border border-b-0 border-[#CB5A31]">
    //           <div className="">
    //             <img src="/RIMI.svg" alt="" className="w-[110px] h-[50px] my-2 " />
    //           </div>
    //           {/* <div className=" border-2 flex justify-center items-center text-4xl h-[60px]">
    //             <h1 className="  uppercase my-auto"></h1>
    //           </div> */}
    //           <div className=" w-full flex justify-center items-center ">
    //             {/* <div
    //               className="w-[250px] h-[1px] rounded-s-2xl bg-white"
    //             ></div> */}
    //             <div className=" border-2 text-xl flex justify-center items-center h-[40px]">
    //               <h2 className="  uppercase bg-primary  ">
    //              Certificate of Completion
    //             </h2>
    //             </div>
    //             {/* <div
    //               className="w-[250px] h-[1px] rounded-e-2xl bg-white"
    //             ></div> */}
    //           </div>
    //           {/* <img src="certCurve.svg" alt="" className="mt-4" /> */}
    //         </div>
    //       </div>
    //       <div className="bg-white m-4 mt-0">
    //         <div className="border border-[#CB5A31] border-t-0 flex flex-col  justify-center items-center pt-3  w-full">
    //           <p className="text-[2rem] text-[#4D4D4D] font-[200]">
    //             This is to certify that
    //           </p>
    //          <div className=" w-full flex justify-center items-center py-6">
    //            <p
    //             className=" text-8xl text-[#4D4D4D]"
    //             style={{ fontFamily: '"MonteCarlo", cursive' }}
    //           >
    //             {recipientName}
    //           </p>
    //          </div>
    //           <p className="max-w-[750px] text-center text-[#4D4D4D] font-extralight">
    //             has successfully completed the RIMI Insurance Training Program
    //             This achievement reflects the dedication, knowledge, and skills
    //             demonstrated in understanding insurance principles, policies,
    //             client servicing, and compliance standards as set by RIMI
    //             Insurance Training Program
    //           </p>
    //           <div className="flex items-center gap-[30%] w-full justify-center text-[#4D4D4D] mt-2">
    //             <div className="flex gap-2">
    //               <span className="text-black">Date of Achievement:</span>
    //               <span className="font-extralight">{date}</span>
    //             </div>
    //             <div className="flex gap-2">
    //               <span className="text-black">Certificate Number:</span>
    //               <span className="font-extralight">{certNumber}</span>
    //             </div>
    //           </div>
    //           <span className="text-[#4D4D4D] font-extralight my-4 text-[22px]">
    //             CERTIFICATE WAS AWARDED BY
    //           </span>
    //           <div className="flex items-center gap-[10%] w-full justify-center text-[#4D4D4D] font-extralight mt-3">
    //             <div className="flex flex-col w-[300px] text-center justify-center items-center">
    //               <span>
    //                 <img src="/signature.png" alt="director" className="h-24" />
    //               </span>
    //               <span
    //                 style={{ borderTop: "1px solid #000000" }}
    //                 className="w-full pt-3"
    //               >
    //                 Director RIMI
    //               </span>
    //             </div>
    //             <div className="flex flex-col w-[300px] text-center justify-center items-center">
    //               <span>
    //                 <img src="/signature.png" alt="director" className="h-24" />
    //               </span>
    //               <span
    //                 style={{ borderTop: "1px solid #000000" }}
    //                 className="w-full pt-3"
    //               >
    //                 Head of Training & Development RIMI
    //               </span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>

    // 1
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
              Certificate
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
                of Completion
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
              This is to certify that
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
              {certText}
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
                marginTop: "1rem",
                marginBottom: "1rem",
                fontSize: "22px",
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
      </div>
    </div>

    // 2
    // <div
    //   style={{
    //     width: "1050px",
    //     height: "820px",
    //     margin: "0 auto",
    //     border: "1px solid #2b00b7",
    //     padding: "16px",
    //   }}
    // >
    //   <div
    //     style={{
    //       border: "1px solid #CB5A31",
    //       height: "100%",
    //       display: "flex",
    //       gap: "2.5rem",
    //     }}
    //   >
    //     <div
    //       style={{
    //         position: "relative",
    //         height: "820px",
    //         width: "auto",
    //         marginLeft: "1.25rem",
    //       }}
    //     >
    //       <img
    //         src="/certFrame.png"
    //         alt="Frame"
    //         style={{
    //           height: "100%",
    //           width: "100%",
    //           objectFit: "cover",
    //           marginTop: "-17.5px",
    //         }}
    //       />
    //       <img
    //         src="/RIMI.svg"
    //         alt="RIMI Logo"
    //         style={{
    //           width: "120px",
    //           position: "absolute",
    //           top: "10%",
    //           left: "50%",
    //           transform: "translateX(-50%)",
    //         }}
    //       />
    //       <div
    //         style={{
    //           display: "flex",
    //           flexDirection: "column",
    //           alignItems: "center",
    //           gap: "0.75rem",
    //           width: "100%",
    //           justifyContent: "center",
    //           color: "white",
    //           position: "absolute",
    //           bottom: "10%",
    //           left: "50%",
    //           transform: "translateX(-50%)",
    //           fontSize: "0.875rem",
    //         }}
    //       >
    //         <div style={{ display: "flex", gap: "0.5rem" }}>
    //           <span>Date of Achievement:</span>
    //           <span>{date}</span>
    //         </div>
    //         <div style={{ display: "flex", gap: "0.5rem" }}>
    //           <span>Certificate Number:</span>
    //           <span>{certNumber}</span>
    //         </div>
    //       </div>
    //     </div>
    //     <div
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         paddingTop: "1rem",
    //         paddingBottom: "1rem",
    //       }}
    //     >
    //       <h1
    //         style={{
    //           fontSize: "4rem",
    //           textTransform: "uppercase",
    //           fontFamily: "'Rufina', serif",
    //           color: "#4D4D4D",
    //           fontWeight: "bold",
    //         }}
    //       >
    //         Certificate
    //       </h1>
    //       <h2
    //         style={{
    //           fontSize: "2rem",
    //           color: "#B57E10",
    //           textTransform: "uppercase",
    //           paddingLeft: "0.25rem",
    //           paddingRight: "0.25rem",
    //           zIndex: 5,
    //         }}
    //       >
    //         of Completion
    //       </h2>
    //       <div style={{ marginTop: "1.5rem" }}>
    //         <p style={{ fontSize: "2rem", color: "#4D4D4D" }}>
    //           This is to certify that
    //         </p>
    //         <p
    //           style={{
    //             fontSize: "6.5rem",
    //             color: "#4D4D4D",
    //             marginTop: "-2.5rem",
    //             fontFamily: '"MonteCarlo", cursive',
    //             textTransform: "capitalize",
    //           }}
    //         >
    //           {recipientName}
    //         </p>
    //         <p
    //           style={{
    //             maxWidth: "570px",
    //             color: "#4D4D4D",
    //             fontWeight: "200",
    //             marginTop: "0.75rem",
    //           }}
    //         >
    //           has successfully completed the RIMI  Insurance Training Program
    //           This achievement reflects the dedication, knowledge, and skills
    //           demonstrated in understanding insurance principles, policies,
    //           client servicing, and compliance standards as set by RIMI
    //           Insurance Training Program
    //         </p>
    //       </div>
    //       <span
    //         style={{
    //           color: "#4D4D4D",
    //           fontSize: "2rem",
    //           fontWeight: "500",
    //           marginTop: "2rem",
    //         }}
    //       >
    //         CERTIFICATE WAS AWARDED BY
    //       </span>
    //       <div
    //         style={{
    //           display: "flex",
    //           alignItems: "center",
    //           gap: "1.5rem",
    //           width: "100%",
    //           justifyContent: "center",
    //           color: "#4D4D4D",
    //           fontWeight: "200",
    //           marginTop: "3rem",
    //         }}
    //       >
    //         <div className="flex flex-col w-[300px] text-center justify-center items-center">
    //           <span>
    //             <img src="/signature.png" alt="director" className="h-24" />
    //           </span>
    //           <span
    //             style={{
    //               display: "flex",
    //               flexDirection: "column",
    //               gap: "0.75rem",
    //               width: "300px",
    //               textAlign: "center",
    //               borderTop: "1px solid #000000",
    //             }}
    //           >
    //             Director RIMI
    //           </span>
    //         </div>
    //         <div className="flex flex-col w-[300px] text-center justify-center items-center">
    //           <span>
    //             <img src="/signature.png" alt="director" className="h-24" />
    //           </span>
    //           <span
    //             style={{
    //               display: "flex",
    //               flexDirection: "column",
    //               gap: "0.75rem",
    //               width: "300px",
    //               textAlign: "center",
    //               borderTop: "1px solid #000000",
    //             }}
    //           >
    //             Head of Training & Development RIMI
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Certificate;
