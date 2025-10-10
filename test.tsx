'use client'

import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { gymStore } from '@/store/gymStore'

import LoadingOverlay from '@/components/common/LoadingOverlay'
import { motion } from 'framer-motion'
import GymCard from '@/components/common/GymCard'
import useDebounce from '@/hooks/useDebounce'
import { Search,Dumbbell } from 'lucide-react'

const GymList = observer(() => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm,300)

  useEffect(()=>{
    gymStore.setSearch(debouncedSearch)
  },[debouncedSearch])

  useEffect(() => {
    gymStore.fetchGyms()
  }, [])

  if (gymStore.loading) return <LoadingOverlay />

  const filteredGyms = gymStore.filteredGyms || []

  if (gymStore.error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center shadow-lg">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Gyms</h3>
          <p className="text-slate-600">{gymStore.error}</p>
        </div>
      </div>
    )
  }


  

  return (
    <section className="relative px-4 py-16 md:py-20 bg-gradient-to-br">
      {/* Header + Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-10 px-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-xs md:text-sm mb-4 shadow-lg">
          <Dumbbell className="w-4 h-4 md:w-5 md:h-5" />
          <span className="tracking-wide uppercase">Find Your Fitness Hub</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-light tracking-tight text-slate-900 mb-3">
          Choose Your{' '}
          <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
            Perfect Gym
          </span>
        </h2>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed">
          Discover premium gyms with top-tier facilities, expert trainers, and the perfect vibe to push your limits.
        </p>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-md mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search gyms..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-indigo-200 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm transition-all"
          />
          <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </motion.div>

      {/* Grid of Cards */}
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
      {filteredGyms.length ===0 ?(
        <p className='text-center text-slate-500 col-span-full'> No gyms found matching your search</p>
      ):(
        filteredGyms.map((gym,index)=><GymCard key={gym._id} gym={gym} index={index}></GymCard>)
      )}
    </div>
    </section>
  )
})

export default GymList