import React from 'react';
import { connect,useSelector,useDispatch } from 'react-redux';
import styled from 'styled-components';

import {Box, BoxTitle, BoxBody} from '../style.jsx';

const Skill = styled.span`
  background-color: ${props => props.bg};
  padding: 6px;
  color: #ffffff;
  margin-right: 5px;
  margin-bottom: 5px;
  font-size: 12px;
  display: inline-block;
`;

// const Skills = ({skills}) => {
const Skills = () => {
  const skills = useSelector(state => state.skills);
  const sks = skills.map((s, i) => {
    const techs = s.techs.map((t, j) => 
      <Skill bg={t.color} key={j}>{t.name}</Skill>
    );
    return (
      <div className="skills__group margin-bottom-10" key={i}>
        <h3 className="skills__title">{s.category}</h3>
        {techs}
      </div>
    );
  });
  return(
    <Box className="skills">
      <BoxTitle>
        <i className="boxIcon fa fa-pencil" aria-hidden="true"></i>
        <span>Skills</span>
      </BoxTitle>
      <BoxBody>
      {sks}
      </BoxBody>
    </Box>
  );
};
export default Skills;