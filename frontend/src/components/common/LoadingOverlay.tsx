import { motion } from 'framer-motion'

interface LoadingOverlayProps {
  message?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[1000]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Colorful spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-yellow-500 border-r-green-500 border-b-blue-500 border-l-purple-500 mb-4"></div>
      <p className="text-gray-800 font-bold text-lg">{message}</p>
    </motion.div>
  )
}

export default LoadingOverlay
