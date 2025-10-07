import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import MemberSidebar from '@/components/common/MemberSidebar'
import { authStore } from '@/store/authStore'

import { memberStore } from '@/store/memberStore'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import CreateProfile from '../member/CreateProfile'
import GymList from '../member/GymList'

const MemberDashboard = observer(() => {
  useEffect(() => {
    if (!authStore.isAuthenticated) return
    memberStore.fetchMemberProfile()
  }, [authStore.isAuthenticated])

  if (memberStore.loading) {
    return <LoadingOverlay />
  }

  return (
    <>
      <Header />

      {memberStore.memberView === 'create' && (
        <main className="flex-1 p-6">
          <CreateProfile />
        </main>
      )}

      {memberStore.memberView === 'listGyms' && (
        <main className="flex-1 p-6">
          <GymList />
        </main>
      )}

      {memberStore.memberView === 'dashboard' && (
        <div className="flex">
          <MemberSidebar />
          <main className="flex-1 p-6 md:ml-64">
            <h1 className="text-2xl font-bold">Welcome to your Dashboard 🎉</h1>
          </main>
        </div>
      )}

      <Footer />
    </>
  )
})

export default MemberDashboard
