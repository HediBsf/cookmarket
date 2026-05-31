"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-11 min-w-11 rounded-sm bg-white px-4 text-sm font-bold text-stone-500 shadow-sm transition hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Page precedente"
      >
        &laquo;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`h-11 min-w-11 rounded-sm px-4 text-sm font-bold shadow-sm transition ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "bg-white text-stone-500 hover:text-orange-600"
          }`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-11 min-w-11 rounded-sm bg-white px-4 text-sm font-bold text-stone-500 shadow-sm transition hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Page suivante"
      >
        &raquo;
      </button>
    </nav>
  );
}
