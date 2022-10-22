import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Experiences from '../components/home/Experiences.jsx';
import Skills from '../components/home/Skills.jsx';
import Projects from '../components/home/Projects.jsx';
import {updateDocumentTitle} from '../helpers';

// const Home  = ({characters}) => 
const Home = () => {
  updateDocumentTitle('Home');
  const dispatch = useDispatch();
  const skills = useSelector(state => state.skills);
  return (
    <div className="home display-flex flex-wrap">
      <Experiences />
      <Projects />
      <Skills skills={skills} />
    </div>
  );
};
export default Home;
