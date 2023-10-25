import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReactPaginate from 'react-paginate'

type Props = {
  pageIndex: number
  pageCount: number
  changePageIndex: (newPageIndex: number) => any
}

export default function Pagination({
  pageIndex,
  pageCount,
  changePageIndex,
}: Props) {
  return (
    <ReactPaginate
      breakClassName='hidden'
      nextLabel={<ChevronLeft />}
      onPageChange={(e) => changePageIndex(e.selected)}
      forcePage={pageIndex}
      pageRangeDisplayed={5}
      pageCount={Math.max(pageCount, 0)}
      previousLabel={<ChevronRight />}
      containerClassName='inline-flex -space-x-px my-2'
      pageClassName='block'
      previousClassName='block'
      nextClassName='block'
      pageLinkClassName='flex items-center justify-center px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
      previousLinkClassName='flex items-center border-l-0 justify-center h-full px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700'
      nextLinkClassName='flex items-center justify-center h-full px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700'
      activeLinkClassName='!bg-gray-100'
      renderOnZeroPageCount={() => null}
      marginPagesDisplayed={1}
      disabledLinkClassName='hover:text-gray-500'
    />
  )
}
