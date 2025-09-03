export const RenderPageNumbers = ({
  setCurrentPage,
  totalPages,
  page,
}: {
  setCurrentPage: (p: number) => void;
  totalPages: number;
  page: number;
}) => {
  const currentPage = page;
  const maxVisiblePages = 4;

  const pages: (number | string)[] = [];

  if (totalPages <= maxVisiblePages) {
    // show all pages if <= 4
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 2) {
      // beginning: 1,2,...,last
      for (let i = 1; i <= 2; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 1) {
      // ending: 1,...,last-1,last
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // middle: 1,...,current,...,last
      pages.push(1);
      pages.push("...");
      pages.push(currentPage);
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages.map((p, idx) =>
    p === "..." ? (
      <span key={`dots-${idx}`} className="px-2 mt-4">
        ...
      </span>
    ) : (
      <button
        key={p}
        onClick={() => setCurrentPage(p as number)}
        className={`px-3 py-2 cursor-pointer ${
          p === currentPage
            ? "bg-primary text-white"
            : "bg-[#F1F0F2] text-[#808080]"
        }`}
      >
        {p}
      </button>
    )
  );
};
