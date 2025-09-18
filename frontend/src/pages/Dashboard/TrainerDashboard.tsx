import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import TrainerSidebar from '@/components/common/TrainerSidebar';

const TrainerDashboard = () => {
  return (
    <>
      <Header />

      <div className="flex">
        <TrainerSidebar />
        <main className="flex-1 p-6 md:ml-64">
          
        </main>
      </div>

      <Footer />
    </>
  );
};

export default TrainerDashboard;
