import React from 'react';
import { useDispatch } from 'react-redux';

import Experiences from '../components/home/Experiences.jsx';
import Skills from '../components/home/Skills.jsx';
import Projects from '../components/home/Projects.jsx';

// const Home  = ({characters}) => 
const Home = () => {
  const dispatch = useDispatch();
  return (
    <div className="home">
      <Experiences />
      <Projects />
      <Skills />
    </div>
  );
};
export default Home;
