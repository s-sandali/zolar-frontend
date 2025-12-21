import HeroSection from "./components/HeroSection";
import EnergyOverviewSection from "./components/EnergyOverviewSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import FeaturesSection from "./components/FeaturesSection";
import HomeFooter from "./components/HomeFooter";
import ScrollReveal from "./components/ScrollReveal";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <ScrollReveal>
        <section id="about">
          <EnergyOverviewSection />
        </section>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <section id="problem">
          <ProblemSection />
        </section>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <section id="solution">
          <SolutionSection />
        </section>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <section id="features">
          <FeaturesSection />
        </section>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <HomeFooter />
      </ScrollReveal>
    </main>
  );
};

export default HomePage;
