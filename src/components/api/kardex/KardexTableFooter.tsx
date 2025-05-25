import { ArrowBigLeft, ArrowBigRight } from 'lucide-react'

interface Props {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  kardexCount: number
}

const pages = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' },
  { id: 6, name: '6' },
  { id: 7, name: '7' },
  { id: 8, name: '8' },
  { id: 9, name: '9' },
  { id: 10, name: '10' },
]

const KardexTableFooter = ({ page, setPage, kardexCount }: Props) => {

  

  return (
    <>
    {/* <p>{page}</p>
    <p>{(kardexCount / 10)}</p>
    <p>{Math.ceil(kardexCount / 10)}</p> */}
    {kardexCount && 
    <div className='flex items-center justify-center px-4 py-3 sm:px-6 gap-10 mt-10'>
        <button
          className='cursor-pointer text-gray-500 hover:text-gray-700'
          onClick={() => setPage(prev => prev - 1)}
          disabled={page === 1}
        >
          <ArrowBigLeft />
        </button>
        <div>
        {pages.map((singlePage) => (
          <button
            key={singlePage.id}
            onClick={() => setPage(singlePage.id)}
            className={`mx-1 cursor-pointer rounded-md transition duration-300 border border-gray-300 ${singlePage.name === page.toString() ? 'bg-blue-600 text-slate-50 hover:bg-blue-500' : 'bg-white text-gray-700 hover:bg-gray-50'} px-4 py-2 text-sm font-medium  `}
          >
            {singlePage.name}
          </button>
        ))}
        </div>
        <button
          className='cursor-pointer text-gray-500 hover:text-gray-700'
          onClick={() => setPage(prev => prev + 1)}
          disabled={page === pages.length}
        >
          <ArrowBigRight />
        </button>
    </div>}
    </>
  )
}

export default KardexTableFooter