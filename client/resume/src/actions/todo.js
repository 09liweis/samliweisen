import axios from 'axios';

export const getTodos = () => {
  return dispatch=> {
    axios.get('https://samliweisen.herokuapp.com/api/todos')
    .then(ex=>
      dispatch({type:'GET_TODOS',ex:ex.data})
    );
  }
};