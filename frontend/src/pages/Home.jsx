import Hero from "../components/Hero.jsx";
import StatsSection from "../components/StatsSection.jsx";
import AboutTeaser from "../components/AboutTeaser.jsx";
import TechnologyCards from "../components/TechnologyCards.jsx";
import LearningJourney from "../components/LearningJourney.jsx";
import FeaturedProjects from "../components/FeaturedProjects.jsx";
import FromOurClassroom from "../components/FromOurClassroom.jsx";
import CTASection from "../components/CTASection.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <AboutTeaser />
      <TechnologyCards />
      <LearningJourney />
      <FeaturedProjects />
      <FromOurClassroom />
      <CTASection />
    </>
  );
}
