import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';
import {getBlogs} from '../actions/blog';

import '../css/blogs.css';

const Blogs = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs);
  if (blogs && blogs.length === 0) {
    dispatch(getBlogs());
  }
  const lst = blogs.map((b) => {
    return (
      <article className="blog" key={b._id}>
        <h1 className="blog__title">{b.title}</h1>
        <div className="blog__attr">
          <span className="blog__date">{b.created_at.substr(0, 10) }</span>
          <span className="blog__category">{b.category}</span>
        </div>
        {b.image ?
        <img className="blog__image" src={b.image} />
        : null}
        <section dangerouslySetInnerHTML={{ __html:b.content }}></section>
      </article>
    );
  });
  return (
    <Box className="movies">
      <BoxTitle>
        <i className="boxIcon fa fa-film" aria-hidden="true"></i>
        <span>Blogs</span>
      </BoxTitle>
      <BoxBody>
        {lst}
      </BoxBody>
    </Box>
  );
}
export default Blogs;