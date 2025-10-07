'use client'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { gymStore } from '@/store/gymStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingOverlay from '@/components/common/LoadingOverlay'

const GymList = observer(() => {
  useEffect(() => {
    gymStore.fetchGyms()
  }, [])

  if (gymStore.loading) {
    return <LoadingOverlay />
  }

  if (gymStore.error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {gymStore.error || 'Failed to load gyms'}
      </div>
    )
  }

  if (gymStore.gyms.length === 0) {
    return <div className="text-center mt-10 text-gray-500">No gyms available at the moment</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {gymStore.gyms.map((gym) => (
        <Card key={gym._id} className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{gym.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              {gym.address.street}, {gym.address.city}, {gym.address.state} - {gym.address.pincode}
            </p>
            {gym.contactNo && <p className="text-sm">📞 {gym.contactNo}</p>}
            {gym.website && (
              <p className="text-sm">
                🌐{' '}
                <a href={gym.website} target="_blank" className="underline text-blue-600">
                  {gym.website}
                </a>
              </p>
            )}
            {gym.images && gym.images.length > 0 && (
              <div className="flex overflow-x-auto space-x-2 mt-2">
                {gym.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Gym ${gym.name} image ${idx + 1}`}
                    className="w-32 h-20 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="default">Join</Button>
            <Button variant="outline">Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
})

export default GymList
