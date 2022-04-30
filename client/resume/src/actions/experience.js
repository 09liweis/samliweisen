import axios from 'axios';

export const getExperiences = () => {
  return dispatch=> {
    axios.get('/api/experiences')
    .then(ex=>
      dispatch({type:'GET_EXPERIENCES',ex:ex.data})
    );
  }
};