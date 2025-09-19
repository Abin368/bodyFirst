import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import OwnerSidebar from '@/components/common/OwnerSidebar'

const OwnerDashboard = () => {
  return (
    <>
      <Header />

      <div className="flex">
        <OwnerSidebar />
        <main className="flex-1 p-6 md:ml-64"></main>
      </div>

      <Footer />
    </>
  )
}

export default OwnerDashboard
