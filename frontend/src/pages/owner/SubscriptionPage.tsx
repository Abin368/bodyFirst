import { observer } from 'mobx-react-lite'
import { ownerStore } from '@/store/ownerStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Toast } from '@/components/common/Toast'
import LoadingOverlay from '@/components/common/LoadingOverlay'

const plans = [
  {
    id: 'basic',
    title: 'Basic Plan',
    price: '₹999 / month',
    stripePriceId: import.meta.env.VITE_PUBLIC_STRIPE_PRICE_BASIC,
    description: 'Ideal for small gyms starting their digital journey.',
    features: ['Member Management', 'Basic Workout Builder', 'Payment Processing', 'Email Support'],
    active: true,
    popular: true,
  },
  {
    id: 'pro',
    title: 'Pro Plan',
    price: 'Coming Soon',
    description: 'Advanced tools for growing fitness centers.',
    features: [
      'Advanced Member Management',
      'Unlimited Workout Templates',
      'Analytics Dashboard',
      'Priority Support',
    ],
    active: false,
    popular: false,
  },
  {
    id: 'enterprise',
    title: 'Enterprise Plan',
    price: 'Contact Us',
    description: 'Tailored solutions for large gyms and chains.',
    features: [
      'Custom Integrations',
      'Dedicated Account Manager',
      'Multi-Location Support',
      '24/7 Premium Support',
    ],
    active: false,
    popular: false,
  },
]

const SubscriptionPage = observer(() => {
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [showToast, setShowToast] = useState(false)

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1000)
  }

  const handlePayment = async (priceId: string) => {
    try {
      ownerStore.loading = true
      showToastMessage('Redirecting to secure checkout...')
      await ownerStore.handlePayment(priceId)
    } catch (err) {
      console.error(err)
      showToastMessage('Payment failed. Please try again.', 'error')
    } finally {
      ownerStore.loading = false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Power Your Gym with <span className="text-indigo-600">BodyFirst</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Choose the plan that fits your gym’s needs and start transforming your operations today.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
        {plans.map((plan) => {
          const isAlreadySubscribed = ownerStore.isSubscribed && plan.active

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 ${
                plan.active ? 'border-2 border-indigo-500' : 'opacity-80'
              }`}
            >
              {/* Most Popular Tag */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-sm font-semibold px-5 py-1.5 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              {/* Header */}
              <CardHeader className="text-center pt-10">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.title}</CardTitle>
                <p className="text-3xl font-extrabold text-indigo-600 mt-4">{plan.price}</p>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </CardHeader>

              {/* Features */}
              <CardContent className="flex flex-col items-center px-6 pb-10">
                <ul className="space-y-4 text-gray-700 text-sm mb-8 text-left w-full">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
                    plan.active && !isAlreadySubscribed
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!plan.active || isAlreadySubscribed}
                  onClick={() => handlePayment(plan.stripePriceId!)}
                >
                  {isAlreadySubscribed
                    ? 'Subscribed'
                    : plan.active
                      ? 'Subscribe Now'
                      : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {ownerStore.loading && <LoadingOverlay />}

      <Toast message={toastMessage} type={toastType} show={showToast} />
    </div>
  )
})

export default SubscriptionPage
