const NotFound: React.FC = () => {
  return <div className="p-4 fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
    <div className="relative flex flex-col items-center -mt-20">
        <h1 className="text-[10rem] md:text-[18rem] text-[#EBEBEB]">404</h1>
        <img src="/404.png" alt="Not Found" className="w-[4rem] md:w-[8rem] absolute top-[50%] md:top-[45%] left-1/2 transform -translate-x-1/2"/>
        <div className="h-2.5 w-24 md::w-32 rounded-[50%] absolute bottom-1/6 left-1/2 transform -translate-x-1/2"   style={{
    backgroundColor: '#C7C7C7',
    filter: 'blur(1.5px)',
    opacity: 0.9,
  }}></div>
    </div>
   <div className="md:-mt-10 flex flex-col items-center gap-5 md:gap-10">
     <h3 className="text-[1.5rem] md:text-[2rem] text-text-dark font-bold">Oops!, Page not Found</h3>
    <button onClick={() => window.history.back()} className="bg-primary text-white font-semibold py-2 sm:py-3 w-full hover:bg-indigo-700 cursor-pointer">Back To Previous Page</button>
   </div>
  </div>;
};
export default NotFound;
