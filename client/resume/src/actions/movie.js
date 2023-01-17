import axios from 'axios';

export const getMovies = ({limit,page}) => {
  var limit = limit || 15;
  var page = page || 1;
  return dispatch=> {
    axios.get(`https://what-sam-watched.onrender.com/api/visuals?limit=${limit}&page=${page}`)
    .then(ex=>
      dispatch({type:'GET_MOVIES',ex:ex.data.results})
    );
  }
};