import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerStore } from '@/store/ownerStore'
import LoadingOverlay from '@/components/common/LoadingOverlay'

const SuccessPayment = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

    const checkSubscription = async () => {
      try {
        ownerStore.loading = true

       
        await Promise.all([
          ownerStore.fetchProfile(),
          delay(3000) 
        ])

        if (ownerStore.isSubscribed) {
          navigate('/owner/dashboard')
        } else {
          console.warn('Subscription not active yet. Please wait a few seconds.')
        }
      } catch (err) {
        console.error('Error fetching profile after payment:', err)
      } finally {
        ownerStore.loading = false
      }
    }

    checkSubscription()
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {ownerStore.loading && <LoadingOverlay />}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Processing your payment...</h1>
      <p className="text-gray-600">Please wait while we activate your subscription.</p>
    </div>
  )
}

export default SuccessPayment
