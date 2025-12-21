import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu } from "lucide-react";




export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden font-[Inter] text-white">
      <div className="absolute inset-0">
        <picture>
          <source
            srcSet="/assets/images/solar2.jpg"
            type="image/webp"
          />
        
          <img
            src="/assets/images/solar2.jpg"
            alt="Family walking through a high-efficiency solar farm"
            loading="eager"
            className="h-full w-full object-cover"
          />
        </picture>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/65 to-slate-900/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)]" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-6 py-6 md:px-10 lg:px-16">
        

        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-6"
          >
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Clean Renewable Limitless Energy with Zolar
            </h1>
            <p className="text-base text-white/80 md:text-lg">
              Monitor your home's solar energy with real-time insights & alerts
            </p>            
          </motion.div>
        </div>

        
      </div>
    </section>
  );
}
