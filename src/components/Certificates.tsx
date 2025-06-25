const Certificates: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 my-10 overflow-auto">
      <div className="w-[1050px] mx-auto m-4 border">
        <div className="flex flex-col bg-white mx-auto">
          <div className="w-full bg-primary p-4 pb-0 h-fit">
            <div className="w-full flex flex-col items-center justify-center gap-1 font-rufina text-white border border-b-0 border-[#CB5A31]">
              <img src="/public/RIMI.svg" alt="" className="w-[110px] mt-10" />
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
                Reciepient Name
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
                  <span className="font-extralight">20-06-2025</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-black">Certificate Number:</span>
                  <span className="font-extralight">1232354664</span>
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
      <div className="w-[1050px] h-[820px] mx-auto p-4 border">
        <div className="border border-[#CB5A31] h-full flex gap-10">
          <div className="relative h-[820px] w-auto ml-5">
            <img
              src="/public/certFrame.png"
              alt="Frame"
              className="h-full w-full object-cover -mt-4"
            />
            <img
              src="/public/RIMI.svg"
              alt="RIMI Logo"
              className="w-[120px] absolute top-[10%] left-[50%] translate-x-[-50%]"
            />
            <div className="flex flex-col items-center gap-3 w-full justify-center text-white absolute bottom-[10%] left-[50%] translate-x-[-50%] text-sm">
              <div className="flex gap-2">
                <span>Date of Achievement:</span>
                <span>20-06-2025</span>
              </div>
              <div className="flex gap-2">
                <span>Certificate Number:</span>
                <span>1232354664</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col py-4">
            <h1 className=" text-[4rem] uppercase mt-2 font-rufina text-[#4D4D4D] font-bold">
              Certificate
            </h1>
            <h2 className=" text-[2rem] text-[#B57E10] uppercase  px-1 z-5">
              of Completion
            </h2>
            <div className="mt-6">
              <p className="text-[2rem] text-[#4D4D4D]">
                This is to certify that
              </p>
              <p
                className="text-[6.5rem] text-[#4D4D4D] -mt-4"
                style={{ fontFamily: '"MonteCarlo", cursive' }}
              >
                Reciepient Name
              </p>
              <p className="max-w-[570px] text-[#4D4D4D] font-extralight mt-3">
                has successfully completed the RIMI  Insurance Training Program
                This achievement reflects the dedication, knowledge, and skills
                demonstrated in understanding insurance principles, policies,
                client servicing, and compliance standards as set by RIMI
                Insurance Training Program
              </p>
            </div>
            <span className="text-[#4D4D4D] text-[2rem] font-medium mt-8">
              CERTIFICATE WAS AWARDED BY
            </span>
            <div className="flex items-center gap-6 w-full justify-center text-[#4D4D4D] font-extralight mt-28">
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
  );
};

export default Certificates;
