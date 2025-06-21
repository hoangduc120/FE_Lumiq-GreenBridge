import HomeHero from "./HomeHero";
import HomeDiscover from "./HomeDiscover";
import CountDown from "./CountDown";
import Question from "./Question";
import ContactForm from "./ContactForm";
import HomeBlogSection from "./HomeBlogSection";
const Home = () => {
  return (
    <div>
      <HomeHero />
      <HomeDiscover />
      <HomeBlogSection />
      <CountDown />
      <Question />
      <ContactForm />
    </div>
  );
};

export default Home;
