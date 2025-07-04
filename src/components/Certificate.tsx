import React from 'react';




interface CertificateProps {
  recipientName: string;
  courseTitle:   string;
  date:          string;
  certNumber:    string;
}





const Certificate: React.FC<CertificateProps> = (
    {
  recipientName,
  courseTitle,
  date,
  certNumber,
}
) => {
  return (
    <>
    

    <div className="w-[1050px] mx-auto m-4 border">
        <div className="flex flex-col bg-white mx-auto">
          <div className="w-full bg-primary p-4 pb-0 h-fit">
            <div className="w-full flex flex-col items-center justify-center gap-1 font-rufina text-white border border-b-0 border-[#CB5A31]">
              <img src="/RIMI.svg" alt="" className="w-[110px] mt-10" />
              <h1 className=" text-[4rem] uppercase mt-2">Certificate</h1>
              <div className="relative w-full flex justify-center">
                <h2 className=" text-[2rem] -mt-5 uppercase bg-primary px-1 z-5">
                  of Completion
                </h2>
                <div
                  className="w-[500px] absolute top-1/3 z-0"
                  style={{ border: "0.57px solid #FFFFFF" }}
                ></div>
              </div>
              <img src="certCurve.svg" alt="" className="mt-4" />
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
                {recipientName}
              </p>
              <p className="max-w-[750px] text-center text-[#4D4D4D] font-extralight">
                has successfully completed the RIMI  Insurance Training Program
                This achievement reflects the dedication, knowledge, and skills
                demonstrated in understanding insurance principles, policies,
                client servicing, and compliance standards as set by RIMI
                Insurance Training Program
              </p>
              <div className="flex items-center gap-[30%] w-full justify-center text-[#4D4D4D] mt-2">
                <div className="flex gap-2">
                  <span className="text-black">Date of Achievement:</span>
                  <span className="font-extralight">{date}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black">Certificate Number:</span>
                  <span className="font-extralight">{certNumber}</span>
                </div>
              </div>
              <span className="text-[#4D4D4D] font-extralight my-4 text-[22px]">
                CERTIFICATE WAS AWARDED BY
              </span>
              <div className="flex items-center gap-[10%] w-full justify-center text-[#4D4D4D] font-extralight mt-6">
                <div
                  className="flex flex-col space-y-3 w-[300px] text-center"
                  style={{ borderTop: "1px solid #000000" }}
                >
                  <span></span>
                  <span>Director RIMI</span>
                </div>
                <div
                  className="flex flex-col space-y-3 w-[300px] text-center"
                  style={{ borderTop: "1px solid #000000" }}
                >
                  <span></span>
                  <span>Head of Training & Development RIMI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </>
  )
}

export default Certificate




