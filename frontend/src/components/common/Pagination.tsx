import { Button } from '@/components/ui/button'
import { memo } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination = memo(
  ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) => {
    if (totalPages <= 1) return null

    const handlePrev = () => {
      if (currentPage > 1) onPageChange(currentPage - 1)
    }

    const handleNext = () => {
      if (currentPage < totalPages) onPageChange(currentPage + 1)
    }

    return (
      <div className={`flex justify-center mt-10 gap-2 ${className}`}>
        {/* Prev */}
        <Button
          disabled={currentPage === 1}
          onClick={handlePrev}
          className={`px-4 py-2 rounded-full border ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'
          }`}
        >
          Prev
        </Button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1
          return (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-full border transition-all ${
                currentPage === page
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {page}
            </Button>
          )
        })}

        {/* Next */}
        <Button
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className={`px-4 py-2 rounded-full border ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'
          }`}
        >
          Next
        </Button>
      </div>
    )
  }
)

Pagination.displayName = 'Pagination'

export default Pagination
