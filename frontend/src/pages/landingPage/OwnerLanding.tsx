import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import Header from "@/components/common/Header"
import Footer from "@/components/common/Footer"
import { motion } from "framer-motion"
import { Users, Dumbbell, CreditCard } from "lucide-react"
import type{ AuthFormProps } from "@/types/auth"

const OwnerLanding: React.FC<AuthFormProps> = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <Header />
      <div className="flex flex-col font-sans">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-gray-50 via-indigo-50 to-white py-16 sm:py-20 md:py-24 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-20"></div>
          <motion.div
            className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              BodyFirst
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              All-in-One Gym Management SaaS — streamline member management, trainer coordination, workouts, payments, and growth in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to={`/owner/signup`}>
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 bg-white text-center">
          <motion.div
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Streamline your gym operations with our comprehensive suite of tools designed for efficiency and growth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: "Member Management", desc: "Effortlessly manage member profiles, track attendance, and communicate with ease.", icon: <Users className="w-6 h-6 text-indigo-600" /> },
                { title: "Workout & Diet Builder", desc: "Craft personalized workout plans and diet recommendations tailored to your members.", icon: <Dumbbell className="w-6 h-6 text-indigo-600" /> },
                { title: "Billing & Payments", desc: "Automate billing, process payments securely, and monitor revenue effortlessly.", icon: <CreditCard className="w-6 h-6 text-indigo-600" /> }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <CardHeader className="flex items-center gap-3">
                      {f.icon}
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">{f.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base text-gray-600">{f.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-indigo-50 text-center">
          <motion.div
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { step: "1", title: "Sign Up as Gym Owner" },
                { step: "2", title: "Add Members & Trainers" },
                { step: "3", title: "Manage & Grow" }
              ].map((s, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                        <span className="text-indigo-600">{s.step}.</span> {s.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 sm:py-20 bg-white text-center">
          <motion.div
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {[
                { title: "Free", price: "$0 /month", features: ["Basic member management", "Limited workout templates", "Payment processing"], cta: "Start Free", highlight: false },
                { title: "Pro", price: "$49 /month", features: ["Advanced member management", "Unlimited workout templates", "Scalable pricing"], cta: "Start Pro", highlight: true },
                { title: "Enterprise", price: "Contact Us", features: ["Custom solutions", "Dedicated support"], cta: "Contact Us", highlight: false }
              ].map((plan, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Card className={`relative border-none shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl ${plan.highlight ? "border-2 border-indigo-600" : ""}`}>
                    {plan.highlight && (
                      <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <CardHeader>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">{plan.title}</CardTitle>
                      <p className="text-lg sm:text-xl font-semibold text-indigo-600">{plan.price}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="mb-6 space-y-2 sm:space-y-3 text-gray-700 text-left text-sm sm:text-base">
                        {plan.features.map((f, idx) => (
                          <li key={idx} className="flex items-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link to={`/owner/signup`}>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 sm:py-3 rounded-xl transition-transform duration-300 transform hover:scale-105">
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-indigo-50 text-center">
          <motion.div
            className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="text-left">
              {[
                { q: "What is BodyFirst?", a: "BodyFirst is an all-in-one gym management SaaS platform designed to simplify and enhance gym operations." },
                { q: "How does the free trial work?", a: "Explore all features at no cost for 14 days, with no credit card required." },
                { q: "What payment methods do you accept?", a: "We accept credit cards, debit cards, and UPI for seamless transactions." },
                { q: "Can I customize the platform?", a: "Yes, our Pro and Enterprise plans offer extensive customization options to fit your needs." },
                { q: "Do you offer support?", a: "Our dedicated support team is available 24/7 to assist you." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-gray-200">
                  <AccordionTrigger className="text-base sm:text-lg font-semibold text-gray-900 hover:text-indigo-600">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-gray-600">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default OwnerLanding
