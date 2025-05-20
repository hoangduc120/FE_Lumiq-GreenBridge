import HomeHero from './HomeHero';
import HomeDiscover from './HomeDiscover';
import CountDown from './CountDown';
import Question from './Question';
import ContactForm from './ContactForm';
const Home = () => {
  return (
    <div>
      <HomeHero />
      <HomeDiscover />
      <CountDown />
      <Question />
      <ContactForm />
    </div>
  );
};

export default Home;
