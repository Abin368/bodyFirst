import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import MemberSidebar from '@/components/common/MemberSidebar'

const MemberDashboard = () => {
  return (
    <>
      <Header />

      <div className="flex">
        <MemberSidebar />
        <main className="flex-1 p-6 md:ml-64"></main>
      </div>

      <Footer />
    </>
  )
}

export default MemberDashboard
