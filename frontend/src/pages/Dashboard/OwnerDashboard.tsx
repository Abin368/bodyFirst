import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import OwnerSidebar from '@/components/common/OwnerSidebar'
import SubscriptionPage from '../owner/SubscriptionPage'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ownerStore } from '@/store/ownerStore'
import { authStore } from '@/store/authStore'

const OwnerDashboard = () => {
  useEffect(() => {
    if (!authStore.isAuthenticated) return
    ownerStore.fetchProfile()
  }, [authStore.isAuthenticated])

  if (ownerStore.loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <>
      <Header />
      {ownerStore.isSubscribed ? (
        <div className="flex">
          <OwnerSidebar />
          <main className="flex-1 p-6 md:ml-64">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard 🎉</h1>
          </main>
        </div>
      ) : (
        <main className="flex-1 p-6">
          <SubscriptionPage />
        </main>
      )}
      <Footer />
    </>
  )
}

export default observer(OwnerDashboard)
