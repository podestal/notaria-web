import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface Props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  itemsCount: number;
  itemsPerPage?: number;
  refetch?: () => void;
}

const Paginator = ({ page, setPage, itemsCount, itemsPerPage=10, refetch }: Props) => {
  const totalPages = Math.ceil(itemsCount / itemsPerPage);
  const maxVisiblePages = 10;

  // Calculate dynamic page range based on current page
  const getVisiblePages = () => {
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    itemsCount > 0 && (
      <div className='flex flex-wrap items-center justify-center gap-4 border-t border-slate-200 bg-slate-50/80 px-4 py-4 sm:px-6'>
        <p className='rounded-md bg-white px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200'>{`${page} de ${totalPages}`}</p>
        <button
          type='button'
          className='cursor-pointer rounded-md border border-slate-300 bg-white p-2 text-slate-600 transition hover:border-sky-400 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed'
          onClick={() => {
            setPage(prev => Math.max(1, prev - 1))
            refetch?.()
          }}
          disabled={page === 1}
        >
          <ArrowBigLeft />
        </button>

        <div className='flex flex-wrap items-center justify-center gap-1'>
          {visiblePages.map(p => (
            <button
              type='button'
              key={p}
              onClick={() => setPage(p)}
              className={`cursor-pointer rounded-md transition duration-200 border ${
                page === p
                  ? 'bg-sky-600 border-sky-700 text-white shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              } px-3 py-1.5 text-xs font-semibold`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type='button'
          className='cursor-pointer rounded-md border border-slate-300 bg-white p-2 text-slate-600 transition hover:border-sky-400 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed'
          onClick={() => {
            setPage(prev => Math.min(totalPages, prev + 1))
            refetch?.()
          }}
          disabled={page === totalPages}
        >
          <ArrowBigRight />
        </button>
      </div>
    )
  );
}

export default Paginator