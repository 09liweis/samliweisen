import React from 'react';
import { useDispatch } from 'react-redux';

import Experiences from '../components/home/Experiences.jsx';
import Skills from '../components/home/Skills.jsx';
import Projects from '../components/home/Projects.jsx';
import {updateDocumentTitle} from '../helpers';

// const Home  = ({characters}) => 
const Home = () => {
  updateDocumentTitle('Home');
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
