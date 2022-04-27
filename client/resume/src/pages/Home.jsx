import React from 'react';
import { useDispatch } from 'react-redux';

import {Box, BoxTitle, BoxBody} from '../components/style.jsx';

import Experiences from '../components/home/Experiences.jsx';
import Skills from '../components/home/Skills.jsx';
import Projects from '../components/home/Projects.jsx';

import '../css/resume.css';
// const Home  = ({characters}) => 
const Home = () => {
  const dispatch = useDispatch();
  return (
    <Box className="home">
      <BoxTitle>
        <i className="boxIcon fa fa-home" aria-hidden="true"></i>
        <span>Home</span>
      </BoxTitle>
      <BoxBody>
        <Experiences />
        <Projects />
        <Skills />
      </BoxBody>
    </Box>
  );
};
export default Home;
