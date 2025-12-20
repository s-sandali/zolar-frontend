import imgWindTurbine from "./wind-turbine.png";
import { Sailboat, Shield, Triangle, Wind } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="bg-white px-12 font-[Inter]">
      {/* Navigation Bar */}
      
      {/* Main Content */}
      <main className="px-4 py-4 md:px-6 md:py-16">
        <div>
          {/* Hero Section */}
          <div className="mb-12 md:mb-24">
            <h1 className="text-4xl leading-tight font-bold text-black sm:text-5xl sm:leading-20 md:text-7xl md:leading-32 xl:text-8xl">
              <div>Monitor Your Home's</div>
              <div className="flex flex-row items-center gap-4 sm:gap-8">
                <span>Solar Energy</span>
                <div className="relative">
                  <img
                    src={imgWindTurbine}
                    alt="Solar panels on a house roof"
                    className="max-h-8 rounded-xl object-cover sm:max-h-16 md:max-h-20 md:rounded-2xl"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-8">
                <span>with Real-Time</span>
              </div>
              <div className="flex flex-row items-center gap-4 sm:gap-8">
                <span>Insights & Alerts</span>
                
              </div>
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
}
