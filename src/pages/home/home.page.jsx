import HeroSection from "./components/HeroSection";
import EnergyOverviewSection from "./components/EnergyOverviewSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import FeaturesSection from "./components/FeaturesSection";
import HomeFooter from "./components/HomeFooter";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <EnergyOverviewSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HomeFooter />
    </main>
  );
};

export default HomePage;
