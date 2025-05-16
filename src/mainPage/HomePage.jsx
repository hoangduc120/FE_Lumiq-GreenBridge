import HomeHero from './HomeHero';
import Header from './Header';
import HomeDiscover from './HomeDiscover';
import CountDown from './CountDown';
import Question from './Question';
const Home = () => {
  return (
    <div>
      <Header />
      <HomeHero />
      <HomeDiscover />
      <CountDown />
      <Question />
    </div>
  );
};

export default Home;
