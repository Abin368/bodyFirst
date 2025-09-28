import { AnimatePresence, motion } from 'framer-motion'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  show: boolean
}
export const Toast = ({ message, type = 'success', show }: ToastProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
