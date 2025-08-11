const NotFound: React.FC = () => {
  return (
    <div className="p-4 fixed w-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <img src="/PageError.png" alt="Not Found" className="w-32 md:w-48" />
      <div className=" flex flex-col items-center gap-5 md:gap-10 mt-5 sm:mt-10">
        <h3 className="text-[1.5rem] md:text-[2rem] text-text-dark font-bold">
          Oops!, Page not Found
        </h3>
        <button
          onClick={() => window.history.back()}
          className="bg-primary text-white font-semibold py-2 sm:py-3 w-full hover:bg-indigo-700 cursor-pointer"
        >
          Back To Previous Page
        </button>
      </div>
    </div>
  );
};
export default NotFound;
