import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import type { AuthFormProps } from "@/types/auth"

const MemberLanding:React.FC<AuthFormProps>= () => {
  return (
    <>
      <Header />
      <div className="flex flex-col font-sans">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-800 to-blue-600 py-20 sm:py-28 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/soft-wallpaper.png')] opacity-10"></div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
              Discover Your Perfect Gym
            </h1>
            <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Explore verified gyms, compare reviews, and kickstart your fitness journey with ease.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Enter your city or gym name"
                className="flex-1 px-5 py-4 border-none rounded-xl focus:ring-2 focus:ring-indigo-300 bg-white text-gray-900 placeholder-gray-500 text-lg transition-all duration-300"
              />
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-4 px-8 rounded-xl transition-transform duration-300 transform hover:scale-105"
              >
                Search Gyms
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose BodyFirst?</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Unlock a seamless fitness experience with tools designed to help you find and thrive in the perfect gym.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { title: "Verified Gyms", desc: "Access a curated network of high-quality, verified gyms for a safe and reliable experience." },
                { title: "Top Trainers", desc: "Connect with certified trainers to guide you toward your fitness goals." },
                { title: "Flexible Memberships", desc: "Choose plans that fit your lifestyle, from short-term to long-term options." },
                { title: "Track Progress", desc: "Monitor workouts and progress with intuitive, integrated tools." }
              ].map((f, i) => (
                <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
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

        {/* Gym Discovery */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="md:col-span-1 space-y-6 bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Refine Your Search</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <input
                  type="range"
                  className="w-full mt-2 accent-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-4">Facilities</label>
                <ul className="space-y-3 text-sm text-gray-600 mt-2">
                  {["Swimming Pool", "Classes", "Personal Training", "Sauna", "Other"].map((f) => (
                    <li key={f} className="flex items-center">
                      <input type="checkbox" className="mr-2 h-4 w-4 text-indigo-600 rounded" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-4">Minimum Rating</label>
                <input
                  type="number"
                  placeholder="Min stars"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mt-4">Max Distance</label>
                <input
                  type="number"
                  placeholder="Max miles"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900"
                />
              </div>
            </div>

            {/* Gym Listings */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "Fitness First - Downtown", rating: "4.5", reviews: "120", distance: "2 miles", desc: "State-of-the-art equipment and a variety of group classes." },
                { name: "Elite Fitness Center", rating: "4.8", reviews: "250", distance: "3 miles", desc: "Top-tier facilities with expert personal trainers." },
                { name: "Active Life Gym", rating: "4.2", reviews: "80", distance: "5 miles", desc: "Welcoming vibe with diverse fitness programs." }
              ].map((g, i) => (
                <Card key={i} className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-900">{g.name}</h3>
                  <p className="text-yellow-500 flex items-center mt-1">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {g.rating} ({g.reviews} reviews)
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{g.distance}</p>
                  <p className="text-sm text-gray-700 mt-2">{g.desc}</p>
                  <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-transform duration-300 transform hover:scale-105">
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Hear from real users who found their ideal gym with BodyFirst.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { name: "Sarah M.", text: "BodyFirst made finding a gym with great classes so easy and stress-free!" },
                { name: "David L.", text: "The flexible membership options fit perfectly with my busy schedule." },
                { name: "Emily R.", text: "User-friendly platform and affordable plans made my fitness journey a breeze." }
              ].map((t, i) => (
                <Card key={i} className="p-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                  <p className="italic text-gray-700 text-sm">"{t.text}"</p>
                  <p className="mt-4 font-semibold text-gray-900">{t.name}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50 text-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Get started with BodyFirst in just a few simple steps.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Search & Find a Gym", desc: "Use our powerful search tool to locate gyms by city or name." },
                { step: "2", title: "Check Reviews & Ratings", desc: "Read authentic reviews and ratings from fellow members." },
                { step: "3", title: "Choose Membership & Pay", desc: "Select a plan that suits you and pay securely online." },
                { step: "4", title: "Start Your Fitness Journey", desc: "Access top gyms and trainers to kickstart your goals." }
              ].map((s, i) => (
                <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    <span className="text-indigo-600">{s.step}.</span> {s.title}
                  </h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-indigo-600 text-center text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Join BodyFirst Today</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Find your ideal gym and start your fitness journey with confidence.
            </p>
            <Link to="/member/signup">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-100 font-semibold py-4 px-8 rounded-xl transition-transform duration-300 transform hover:scale-105"
              >
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}

export default MemberLanding