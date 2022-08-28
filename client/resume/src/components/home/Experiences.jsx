import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {getExperiences} from '../../actions/experience';

import {Box, BoxTitle, BoxBody, ExperienceDate} from '../style.jsx';

const Experiences = () => {
  const dispatch = useDispatch();
  const experiences = useSelector(state => state.experiences);
  if (experiences.length == 0) {
    dispatch(getExperiences());
  }
  const exs = experiences.map((e, i) => {
    const duties = e.duty.map((d, j) => {
      return (
        <li key={j}>
          {d}
        </li>
      );
    });
    return (
      <div className="experience margin-bottom-10" key={i}>
        <h3>{e.company} - {e.title}</h3>
    <ExperienceDate><i className="boxIcon fa fa-calendar" aria-hidden="true"></i>{e.start_date} - {e.end_date}</ExperienceDate>
        <ul className="list">
          {duties}
        </ul>
      </div>
    );
  });
  return(
    <Box className="experiences">
        <BoxTitle>
          <i className="boxIcon fa fa-briefcase" aria-hidden="true"></i>
          <span>Experiences</span>
        </BoxTitle>
        <BoxBody>
        {exs}
        </BoxBody>
    </Box>
  );
};
export default Experiences;
