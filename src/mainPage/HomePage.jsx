import HomeHero from './HomeHero';
import Header from '../components/header/Header';
import HomeDiscover from './HomeDiscover';
import CountDown from './CountDown';
import Question from './Question';
const Home = () => {
  return (
    <div>
      <HomeHero />
      <HomeDiscover />
      <CountDown />
      <Question />
    </div>
  );
};

export default Home;
