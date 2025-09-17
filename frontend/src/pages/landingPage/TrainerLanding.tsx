import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import type { AuthFormProps } from '@/types/auth'

const TrainerLanding: React.FC<AuthFormProps> = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col font-sans">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 to-blue-700 py-20 sm:py-28 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
              Elevate Your Training Career with BodyFirst
            </h1>
            <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Connect with clients, streamline schedules, and grow your income — all in one powerful
              platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-3xl mx-auto">
              <Link to="/trainer/signup">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-4 px-8 rounded-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Join as Trainer
                </Button>
              </Link>
              <Link to="/trainer/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:bg-white hover:text-indigo-600 font-semibold py-4 px-8 rounded-xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Trainers Love BodyFirst</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Empower your training business with tools designed to save time and boost success.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Client Management',
                  desc: 'Track client progress, goals, and training plans with ease.',
                },
                {
                  title: 'Scheduling',
                  desc: 'Manage and sync sessions seamlessly with an integrated calendar.',
                },
                {
                  title: 'Payments',
                  desc: 'Secure, automated billing ensures you get paid on time.',
                },
                {
                  title: 'Workout Builder',
                  desc: 'Design and assign custom workout and diet plans effortlessly.',
                },
                {
                  title: 'Analytics',
                  desc: 'Monitor client progress and showcase results to attract more clients.',
                },
                {
                  title: 'Community',
                  desc: 'Network with other trainers and share expertise to grow.',
                },
              ].map((f, i) => (
                <Card
                  key={i}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50 text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works for Trainers</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Get started in just a few simple steps and watch your training business thrive.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Sign Up',
                  desc: 'Create a standout trainer profile to showcase your expertise.',
                },
                {
                  step: '2',
                  title: 'Get Clients',
                  desc: 'Attract members through our platform and book sessions easily.',
                },
                {
                  step: '3',
                  title: 'Train & Manage',
                  desc: 'Deliver top-notch training while managing schedules and progress.',
                },
                {
                  step: '4',
                  title: 'Grow Your Income',
                  desc: 'Expand your client base and earn securely with BodyFirst.',
                },
              ].map((s, i) => (
                <Card
                  key={i}
                  className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    <span className="text-indigo-600">{s.step}.</span> {s.title}
                  </h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Trainers Are Saying</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Hear from trainers who have transformed their businesses with BodyFirst.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                {
                  name: 'Alex J.',
                  text: 'BodyFirst saves me hours on client management, letting me focus on training!',
                },
                {
                  name: 'Priya S.',
                  text: 'The platform makes it so easy to attract new clients and track their progress.',
                },
                {
                  name: 'Michael T.',
                  text: 'Seamless payments mean I can focus on coaching, not chasing invoices.',
                },
              ].map((t, i) => (
                <Card
                  key={i}
                  className="p-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <p className="italic text-gray-700 text-sm">"{t.text}"</p>
                  <p className="mt-4 font-semibold text-gray-900">{t.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-indigo-600 text-center text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Launch Your Training Career Today</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-indigo-100">
              Join BodyFirst and connect with clients ready to achieve their fitness goals with your
              expertise.
            </p>
            <Link to="/trainer/signup">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-4 px-8 rounded-xl transition-transform duration-300 transform hover:scale-105"
              >
                Join as Trainer
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default TrainerLanding
