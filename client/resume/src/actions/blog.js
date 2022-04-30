import axios from 'axios';

export const getBlogs = () => {
  return dispatch=> {
    axios.get('/api/blogs')
    .then(ex=>
      dispatch({type:'GET_BLOGS',blogs:ex.data})
    );
  }
};