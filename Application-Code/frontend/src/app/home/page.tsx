"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import {
  ArrowRight,
  CheckCircle,
  MessageSquare,
  FileText,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function HomePage() {
  const [scrolled, setScrolled] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observers for various sections
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [howItWorksRef, howItWorksInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [pricingRef, pricingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Head>
        <title>JobBoost AI | Enhance Your Applications and Interviews</title>
        <meta
          name="description"
          content="JobBoost AI helps you optimize your applications and prepare for interviews with artificial intelligence assistance."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navigation with animation */}
      <motion.header
        className={`sticky top-0 z-50 border-b border-gray-100 backdrop-blur-lg transition-all duration-300 ${
          scrolled ? "bg-white/90 py-2 shadow-md" : "bg-white/80 py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center">
            <motion.div
              className="text-2xl font-bold text-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <a href="#">
                JobBoost<span className="text-indigo-600">AI</span>
              </a>
            </motion.div>
          </div>

          <nav className="hidden space-x-8 md:flex">
            {["Features", "How It Works", "Testimonials", "Pricing"].map(
              (item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gray-700 transition hover:text-blue-600"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                </motion.a>
              ),
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                className="hidden text-gray-600 transition hover:text-blue-600 md:inline-block"
                href="/auth/signin"
              >
                Login
              </Link>
            </motion.div>
            <motion.a
              href="/auth/signin"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition hover:bg-blue-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with animations */}
      <section className="pb-24 pt-20 md:pb-36 md:pt-32">
        <div className="container mx-auto ">
          <div className="flex flex-col items-center md:flex-row">
            <motion.div
              className="mb-12 md:mb-0 md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Enhance Your{" "}
                <motion.span
                  className="text-blue-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  Applications
                </motion.span>{" "}
                and{" "}
                <motion.span
                  className="text-indigo-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  Interviews
                </motion.span>
              </h1>
              <motion.p
                className="mb-8 text-lg text-gray-600 md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Boost your career with our AI that optimizes your resumes, and
                prepares you for job interviews.
              </motion.p>
              <motion.div
                className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.a
                  href="#"
                  className="flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-white shadow-md transition hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try for free <ArrowRight className="ml-2 h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#how-it-works"
                  className="flex items-center justify-center rounded-lg border border-blue-200 bg-white px-8 py-3 text-blue-600 shadow-sm transition hover:bg-blue-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  How It Works
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div
              className="md:w-1/2 md:pl-12"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="p-6">
                    <div className="mb-4 flex items-center border-b border-gray-100 pb-4">
                      <motion.div
                        className="mr-4 rounded-full bg-blue-100 p-2"
                        whileHover={{ rotate: 10 }}
                      >
                        <FileText className="h-6 w-6 text-blue-600" />
                      </motion.div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Interview Preparation
                        </h3>
                        <p className="text-sm text-gray-500">
                          Practice with our AI interview simulator
                        </p>
                      </div>
                    </div>
                    <motion.div
                      className="space-y-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {[
                        "Personalized questions",
                        "Multiple-choice quizzes",
                        "Professional CV builder",
                      ].map((text, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start"
                          variants={fadeIn}
                          custom={index}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <CheckCircle className="mr-2 mt-0.5 h-5 w-5 text-green-500" />
                          </motion.div>
                          <p className="text-gray-700">{text}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -bottom-6 -right-6 z-0 h-36 w-36 rounded-2xl bg-[#EAF8FC]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                />
                <motion.div
                  className="absolute -left-6 -top-14 z-0 h-24 w-24 rounded-full bg-[#EAF8FC]"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with animations */}
      <section id="features" className=" bg-white py-20 " ref={featuresRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Our Features
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              AI-powered tools to help you at every stage of your job search
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {/* Feature cards */}
            {[
              {
                icon: <FileText className="h-8 w-8 text-blue-600" />,
                title: "CV Optimization",
                desc: "Our AI analyzes your resume and suggests improvements to make it more attractive and relevant for the target position.",
                list: [
                  "ATS analysis",
                  "Keyword suggestions",
                  "Style corrections",
                ],
                iconBg: "bg-blue-100",
              },
              {
                icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
                title: "Interview Preparation",
                desc: "Practice with our AI interview simulator and get instant feedback to improve your answers.",
                list: [
                  "Personalized questions",
                  "Communication analysis",
                  "Improvement tips",
                ],
                iconBg: "bg-indigo-100",
              },
              {
                icon: <User className="h-8 w-8 text-blue-600" />,
                title: "QCM Generation",
                desc: "Create personalized multiple-choice quizzes based on topic and difficulty level, and receive a score at the end.",
                list: [
                  "Various topics and difficulty levels",
                  "Automatic quiz generation",
                  "Instant evaluation with score",
                ],
                iconBg: "bg-blue-100",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm"
                variants={featureCardVariants}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className={`mb-6 inline-block rounded-xl ${feature.iconBg} p-3`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mb-6 text-gray-600">{feature.desc}</p>
                <ul className="space-y-2">
                  {feature.list.map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      </motion.div>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section with animations */}
      <section
        id="how-it-works"
        className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20"
        ref={howItWorksRef}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              A simple process to boost your job search
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
          >
            {[
              {
                step: 1,
                title: "Upload Your CV",
                desc: "Import your current CV and let our AI analyze it to identify improvement points.",
              },
              {
                step: 2,
                title: "Receive Suggestions",
                desc: "Get personalized recommendations to improve your CV and cover letter.",
              },
              {
                step: 3,
                title: "Prepare for Interviews",
                desc: "Practice with our AI interview simulator and refine your answers with feedback.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm"
                variants={featureCardVariants}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
                }}
              >
                <motion.div
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ delay: 0.2 + index * 0.2, duration: 0.6 }}
                >
                  {step.step}
                </motion.div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section with animations */}
      <section
        id="testimonials"
        className="bg-white py-20"
        ref={testimonialsRef}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              What Our Users Say
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Thousands of professionals have already improved their job search
              journey
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
          >
            {[
              {
                initials: "ML",
                name: "Marie L.",
                title: "Web Developer",
                quote:
                  "Thanks to JobBoost AI, I completely transformed my CV and cover letter. I received three times more interview invitations than before!",
              },
              {
                initials: "TM",
                name: "Thomas M.",
                title: "Project Manager",
                quote:
                  "The interview simulator helped me gain confidence and better structure my answers. I got my dream job after just one month of use!",
              },
              {
                initials: "SC",
                name: "Sophie C.",
                title: "Marketing Manager",
                quote:
                  "The ATS analysis made all the difference. My CV is now noticed by recruiters and I finally landed several interviews with top companies.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm"
                variants={featureCardVariants}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="mb-4 flex items-center">
                  <motion.div
                    className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {testimonial.initials}
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
                <motion.p
                  className="text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                >
                  "{testimonial.quote}"
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section with animations */}
      <section
        id="pricing"
        className="bg-gradient-to-br from-indigo-50 to-blue-50 py-20"
        ref={pricingRef}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Our Plans
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Offers tailored to all job search needs
            </p>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
          >
            {/* Free Plan */}
            <motion.div
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
              variants={featureCardVariants}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
              }}
            >
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Free</h3>
              <p className="mb-6 text-gray-600">Basic job search tools</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">€0</span>
              </div>
              <motion.ul
                className="mb-8 space-y-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[
                  "1 technical & 1 HR interview per day",
                  "Max 10 quiz questions (easy only)",
                  "1 CV generation per day (no AI)",
                  "1 ATS-optimized CV per day",
                  "Challenges (no results/rankings)",
                  "No chat feature",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    variants={fadeIn}
                    custom={idx}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <CheckCircle className="mr-2 mt-0.5 h-5 w-5 text-green-500" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.a
                href="/auth/signin"
                className="block rounded-lg border border-gray-200 bg-gray-100 px-6 py-3 text-center text-blue-600 shadow-sm transition hover:bg-gray-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Start for free
              </motion.a>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              className="scale-105 transform rounded-2xl bg-blue-600 p-8 text-white shadow-lg"
              variants={featureCardVariants}
              whileHover={{
                y: -10,
                scale: 1.08,
                boxShadow:
                  "0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.15)",
              }}
              animate={{
                y: [0, -10, 0],
                transition: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                },
              }}
            >
              <motion.div
                className="mb-4 inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-medium"
                animate={{
                  scale: [1, 1.05, 1],
                  transition: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                  },
                }}
              >
                POPULAR
              </motion.div>
              <h3 className="mb-2 text-2xl font-bold">Premium</h3>
              <p className="mb-6 text-blue-100">For serious job seekers</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">€19</span>
                <span className="text-blue-100">/month</span>
              </div>
              <motion.ul
                className="mb-8 space-y-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[
                  "10 technical & HR interviews per day",
                  "20 quiz questions (easy & medium)",
                  "Sweet notes feature",
                  "10 CVs per day (no AI)",
                  "10 ATS-optimized CVs per day",
                  "Challenges (see others' results)",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    variants={fadeIn}
                    custom={idx}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <CheckCircle className="mr-2 mt-0.5 h-5 w-5 text-blue-300" />
                    </motion.div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.a
                href="#"
                className="block rounded-lg border border-blue-500 bg-white px-6 py-3 text-center text-blue-600 shadow-sm transition hover:bg-blue-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe now
              </motion.a>
            </motion.div>

            {/* Ultimate Plan */}
            <motion.div
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
              variants={featureCardVariants}
              whileHover={{
                y: -10,
                boxShadow:
                  "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)",
              }}
            >
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Ultimate
              </h3>
              <p className="mb-6 text-gray-600">For maximum success</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">€39</span>
                <span className="text-gray-600">/month</span>
              </div>
              <motion.ul
                className="mb-8 space-y-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {[
                  "Unlimited technical & HR interviews",
                  "20 quiz questions (all difficulties)",
                  "Unlimited AI-powered CV generation",
                  "Unlimited ATS-optimized CVs",
                  "Challenges with rankings",
                  "Chat feature included",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    variants={fadeIn}
                    custom={idx}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <CheckCircle className="mr-2 mt-0.5 h-5 w-5 text-green-500" />
                    </motion.div>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.a
                href="/checkout/ultimate"
                className="block rounded-lg border border-gray-200 bg-gray-100 px-6 py-3 text-center text-blue-600 shadow-sm transition hover:bg-gray-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Ultimate
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white" ref={ctaRef}>
        <motion.div
          className="container mx-auto px-4 text-center"
          variants={fadeIn}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
        >
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Boost Your Career?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
            Join thousands of professionals who have already transformed their
            job search with JobBoost AI.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <a
              href="#"
              className="flex items-center justify-center rounded-lg bg-white px-8 py-3 text-blue-600 shadow-md transition hover:bg-blue-50"
            >
              Start for free <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#"
              className="flex items-center justify-center rounded-lg border border-blue-300 bg-transparent px-8 py-3 text-white transition hover:bg-blue-700"
            >
              See a demo
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 text-xl font-bold text-white">
                JobBoost<span className="text-blue-500">AI</span>
              </div>
              <p className="mb-4">
                Boost your career with artificial intelligence assistance.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 transition hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition hover:text-white"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1. 064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.123-.06h.08c2.643 0 2.987.012 4.043.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.056-.06-1.4-.06-4.043v-.08c0-2.643.012-2.987.06-4.043z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="transition hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="transition hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-white">
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-white">Newsletter</h3>
              <p className="mb-4">
                Receive the latest updates and opportunities directly in your
                mailbox.
              </p>
              <form className="flex">
                <input
                  type="email"
                  className="w-full rounded-l border border-gray-700 bg-gray-800 p-2 text-white"
                  placeholder="Your email"
                />
                <button
                  type="submit"
                  className="rounded-r bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
            &copy; 2024 JobBoostAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
export default HomePage;
