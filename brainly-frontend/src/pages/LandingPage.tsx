// LandingPage.jsx
"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useSpring } from "framer-motion";
import {
  FaBrain,
  FaLightbulb,
  FaRocket,
  FaFileUpload,
  FaMagic,
  FaSearch,
  FaQuoteLeft,
  FaTwitter,
  FaLinkedinIn,
  FaUsers,
  FaLink,
  FaServer,
  FaGithub,
} from "react-icons/fa";
import Button from "../components/Button";
import { BrainICon } from "../components/Icons/BrainIcon";
import { useNavigate } from "react-router-dom";
import { MoveRight, UserPlus } from "lucide-react";
import FastMarquee from "react-fast-marquee";
import { BackgroundBeams } from "../components/background-beam";
import { cn } from "../components/lib/utils";
type MarqueeProps = React.HTMLAttributes<HTMLDivElement>;
type MarqueeFadeProps = {
  className?: any;
  side: "left" | "right";
  [x: string]: any;
};
type MarqueeContentProps = React.ComponentProps<typeof FastMarquee>;
type MarqueeItemProps = React.HTMLAttributes<HTMLDivElement>;
type SectionWrapperProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

// --- MARQUEE COMPONENTS ---
const Marquee: React.FC<MarqueeProps> = ({ className = "", ...props }) => (
  <div
    className={cn("relative w-full overflow-hidden", className)}
    {...props}
  />
);

const MarqueeContent: React.FC<MarqueeContentProps> = ({
  loop = 0,
  autoFill = true,
  pauseOnHover = true,
  ...props
}) => (
  <FastMarquee
    loop={loop}
    autoFill={autoFill}
    pauseOnHover={pauseOnHover}
    {...props}
  />
);

const MarqueeFade: React.FC<MarqueeFadeProps> = ({
  className,
  side,
  ...props
}) => (
  <div
    className={cn(
      "absolute top-0 bottom-0 z-10 h-full w-24 from-gray-50 to-transparent", // Changed from-background to from-gray-50
      side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l",
      className
    )}
    {...props}
  />
);

const MarqueeItem: React.FC<MarqueeItemProps> = ({
  className = "",
  ...props
}) => (
  <div
    className={cn("mx-4 flex-shrink-0", className)} // Added a bit more margin
    {...props}
  />
);

// --- YOUR BACKGROUND CELL ANIMATION CODE (ADAPTED FOR THE HERO SECTION) ---

// --- REUSABLE COMPONENTS ---

const SectionWrapper = ({ id, children, className }: SectionWrapperProps) => (
  <motion.section
    id={id}
    className={cn("py-20 lg:py-28", className)}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeInOut" }}
    viewport={{ once: true, amount: 0.2 }}
  >
    <div className="container mx-auto px-6">{children}</div>
  </motion.section>
);
type AnimatedCounterProps = {
  value: number;
  suffix?: string;
};

const AnimatedCounter = ({ value, suffix = "" }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { damping: 50, stiffness: 100 });

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
    return unsubscribe;
  }, [spring]);

  return (
    <>
      <span ref={ref}>0</span>
      {suffix}
    </>
  );
};
const testimonials = [
  {
    quote:
      "Second Brain has fundamentally changed how I approach my research. The AI connections are pure magic.",
    name: "Dr. Elena Vance",
    title: "Quantum Physicist",
  },
  {
    quote:
      "As a novelist, my ideas are my currency. This app is the vault that not only stores them but makes them more valuable.",
    name: "Marcus Cole",
    title: "Bestselling Author",
  },
  {
    quote:
      "The ability to just dump my thoughts and have them organized automatically is a game-changer for my productivity.",
    name: "Aisha Khan",
    title: "Lead UX Designer",
  },
  {
    quote:
      "A must-have tool for any student or lifelong learner. It's like having a personal research assistant.",
    name: "Samuel Chen",
    title: "PhD Candidate",
  },
  {
    quote:
      "The interface is beautiful and intuitive. It makes the process of organizing knowledge a joy, not a chore.",
    name: "Isabella Rossi",
    title: "Art Director",
  },
];

// --- MAIN LANDING PAGE COMPONENT ---

const LandingPage = () => {
  const navigate = useNavigate();
  const words = ["Knowledge", "Brain", "Creativity", "Potential"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full py-4 z-50 bg-gray-950 backdrop-blur-md border-b border-gray-900">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="flex items-center gap-3"
          >
            <BrainICon className="text-3xl" />
            <h1 className="text-2xl font-bold text-white">Second Brain</h1>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#benefits"
              onClick={(e) => handleNavClick(e, "benefits")}
              className="text-gray-200 hover:text-indigo-600 transition-colors"
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, "how-it-works")}
              className="text-gray-200 hover:text-indigo-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#stats"
              onClick={(e) => handleNavClick(e, "stats")}
              className="text-gray-200 hover:text-indigo-600 transition-colors"
            >
              Stats
            </a>
            <a
              href="#testimonials"
              onClick={(e) => handleNavClick(e, "testimonials")}
              className="text-gray-200 hover:text-indigo-600 transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#cta"
              onClick={(e) => handleNavClick(e, "cta")}
              className="text-gray-200 hover:text-indigo-600 transition-colors"
            >
              CTA
            </a>
          </div>
          <Button
            text="Log In"
            variant="secondary"
            endIcon={<UserPlus size={20} />}
            onClick={() => navigate("/signin")}
          />
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <SectionWrapper
          id="home"
          className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-gray-950 pt-20"
        >
          <BackgroundBeams />
          <div className="relative z-10 p-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl text-white md:text-6xl lg:text-7xl font-bold leading-tight">
                Your AI-Powered
                <br />
                {/* Use an inline-flex container to group the second line and keep it centered */}
                <div className="inline-flex items-center justify-center mr-10 -mt-6">
                  <span className="text-6xl">Second</span>
                  {/* This div creates a fixed-width container for the animated word */}
                  <div className="relative text-left w-52 sm:w-64 md:w-80 lg:w-60 ml-3  md:ml-4">
                    <span className="inline-block text-[#5046e4]  h-20 md:h-24 lg:h-28">
                      <AnimatePresence mode="wait">
                        {/* The motion.span is now positioned absolutely within the fixed-width container */}
                        <motion.span
                          key={words[index]}
                          variants={textVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          className="inline-block absolute left-0 mt-9 text-6xl"
                        >
                          {words[index]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                </div>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto ">
                Transform your scattered thoughts into a powerful,
                interconnected knowledge system that accelerates your learning
                and creativity.
              </p>
              <div className="mt-10">
                <Button
                  className="flex justify-center w-fit ml-149"
                  text="Start building for free"
                  variant="primary"
                  endIcon={
                    <MoveRight size={20} className="flex justify-center mt-1" />
                  }
                  onClick={() => {
                    navigate("/signup");
                  }}
                />
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
        {/* Key Benefits Section */}
        <SectionWrapper id="benefits" className="bg-white">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              Unlock Your Full Potential
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto mt-4">
              Go beyond simple note-taking. Second Brain is an ecosystem for
              your ideas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: FaBrain,
                title: "AI-Powered Insights",
                desc: "Discover hidden connections between your notes with advanced AI algorithms.",
              },
              {
                icon: FaLightbulb,
                title: "Effortless Organization",
                desc: "Capture anything from text to links, and let our system intelligently categorize it for you.",
              },
              {
                icon: FaRocket,
                title: "Boost Productivity",
                desc: "Spend less time searching and more time creating with instant, context-aware retrieval.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group p-8 text-center rounded-2xl bg-gray-50 border border-gray-200 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* How It Works Section */}
        <SectionWrapper id="how-it-works" className="bg-gray-50">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold">
              Simple Steps to Brilliance
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto mt-4">
              Start building your knowledge base in minutes.
            </p>
          </div>
          <div className="mt-20 relative">
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 -translate-x-1/2 hidden md:block" />
            <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-3 md:gap-12">
              {[
                {
                  icon: FaFileUpload,
                  title: "1. Capture Everything",
                  desc: "Easily add notes, articles, images, and documents from any device.",
                },
                {
                  icon: FaMagic,
                  title: "2. AI Connects the Dots",
                  desc: "Our intelligent system automatically links related ideas and surfaces insights.",
                },
                {
                  icon: FaSearch,
                  title: "3. Find Anything, Instantly",
                  desc: "Use natural language search to retrieve information exactly when you need it.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="relative text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 mx-auto bg-white border-4 border-gray-200 rounded-full flex items-center justify-center text-blue-600 text-2xl relative z-10 shadow-lg">
                    <step.icon />
                  </div>
                  <h3 className="text-2xl font-bold mt-6 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* Stats Section */}
        <SectionWrapper id="stats" className="bg-white">
          <h2 className="gap-4 mb-4 text-center text-4xl md:text-5xl font-bold">
            The Numbers Behind the Breakthroughs
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto text-center mb-16">
            We measure our success by the impact we have on your productivity
            and insight.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: FaUsers,
                value: 50,
                suffix: "K+",
                label: "Minds Empowered",
              },
              {
                icon: FaLink,
                value: 10,
                suffix: "M+",
                label: "Insights Discovered",
              },
              {
                icon: FaServer,
                value: 99.9,
                suffix: "%",
                label: "Guaranteed Access",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="text-indigo-500 mx-auto mb-4 w-12 h-12 flex items-center justify-center">
                  <stat.icon className="text-4xl" />
                </div>
                <h3 className="text-5xl font-bold text-indigo-600">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-lg text-gray-500 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* Testimonials Section */}
        <SectionWrapper
          id="testimonials"
          className="bg-gray-50 overflow-hidden"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Loved by Creatives & Thinkers
          </h2>
          <div className="space-y-8">
            {/* Marquee 1: Right to Left */}
            <Marquee>
              <MarqueeFade side="left" />
              <MarqueeContent>
                {testimonials.map((testimonial, i) => (
                  <MarqueeItem key={`ltr-${i}`} className="w-full sm:w-[450px]">
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-lg flex flex-col h-full">
                      <FaQuoteLeft className="text-2xl text-indigo-300 mb-4" />
                      <p className="text-gray-600 flex-grow">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-6">
                        <p className="font-bold text-lg text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </MarqueeItem>
                ))}
              </MarqueeContent>
              <MarqueeFade side="right" />
            </Marquee>

            {/* Marquee 2: Left to Right */}
            <Marquee>
              <MarqueeFade side="left" />
              <MarqueeContent direction="right">
                {[...testimonials].reverse().map((testimonial, i) => (
                  <MarqueeItem key={`rtl-${i}`} className="w-full sm:w-[450px]">
                    <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-lg flex flex-col h-full">
                      <FaQuoteLeft className="text-2xl text-indigo-300 mb-4" />
                      <p className="text-gray-600 flex-grow">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-6">
                        <p className="font-bold text-lg text-gray-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </MarqueeItem>
                ))}
              </MarqueeContent>
              <MarqueeFade side="right" />
            </Marquee>
          </div>
        </SectionWrapper>

        {/* CTA Section */}
        <SectionWrapper id={"cta"} className="bg-white">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-gray-100 border border-gray-200">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Your Second Brain?
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of knowledge enthusiasts transforming their
              learning. Start free, no credit card required.
            </p>
            <Button
              className="w-fit cursor-pointer ml-69 text-md px-12 py-4 "
              text="Claim Your Free Account"
              variant="primary"
              onClick={() => {
                navigate("/signup");
              }}
            />
          </div>
        </SectionWrapper>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-50 text-gray-600 py-8 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
            <div className="md:col-span-2">
              <div className="flex justify-center md:justify-start items-center gap-3 mb-4">
                <BrainICon className="text-2xl text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">
                  Second Brain
                </h1>
              </div>
              <p className="max-w-sm mx-auto md:mx-0">
                The future of knowledge management is here. Connect your ideas
                like never before.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Product
              </h3>
              <div className="space-y-2">
                <a href="#" className="block hover:text-blue-600">
                  Features
                </a>
                <a href="#" className="block hover:text-blue-600">
                  Pricing
                </a>
                <a href="#" className="block hover:text-blue-600">
                  Docs
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Follow Us
              </h3>
              <div className="flex justify-center md:justify-start space-x-4 text-xl">
                <a
                  href="https://x.com/ArihantChougul6"
                  className="hover:text-black"
                  target="_blank"
                >
                  <FaTwitter />
                </a>
                <a
                  href="http://linkedin.com/in/arihant-chougule-50082a33a"
                  className="hover:text-blue-600"
                  target="_blank"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="http://github.com/Arihant09x/"
                  className="hover:text-black"
                  target="_blank"
                >
                  <FaGithub />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Second Brain. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
