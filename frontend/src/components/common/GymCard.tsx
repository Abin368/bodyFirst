'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { MapPin, Phone, Globe, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { IOwnerGym } from '@/types/owner'

interface GymCardProps {
  gym: IOwnerGym
  index?: number
}

const GymCard: React.FC<GymCardProps> = ({ gym, index = 0 }) => {
  const coverImage = gym.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-400 group-hover:scale-[1.02]">
        {/* Image Section */}
        <div className="relative h-44 md:h-48 overflow-hidden rounded-t-2xl">
          {coverImage ? (
            <>
              <img
                src={coverImage}
                alt={gym.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
              <Dumbbell className="w-10 h-10 text-indigo-400" />
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow-lg">
              {gym.name}
            </h3>
            <div className="flex items-center text-white/90 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {gym.address.city}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 md:p-5 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-indigo-500 mt-1" />
            <p className="text-sm md:text-base text-slate-700 leading-snug">
              {gym.address.street}, {gym.address.city}, {gym.address.state} - {gym.address.pincode}
            </p>
          </div>
          {gym.contactNo && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-indigo-500" />
              <span className="text-sm md:text-base font-semibold text-slate-800">
                {gym.contactNo}
              </span>
            </div>
          )}
          {gym.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <a
                href={gym.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base font-semibold text-indigo-600 hover:text-indigo-700 transition-colors underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0 flex gap-2 md:gap-3">
          <Button className="flex-1 rounded-xl px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition-transform hover:scale-[1.02]">
            Join
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-transform hover:scale-[1.02]"
          >
            Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default GymCard
