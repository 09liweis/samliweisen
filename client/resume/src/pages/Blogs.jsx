import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';
import {getBlogs} from '../actions/blog';
import {updateDocumentTitle} from '../helpers';

import '../css/blogs.css';

const Blogs = () => {
  updateDocumentTitle('Blogs');
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs);
  if (blogs && blogs.length === 0) {
    dispatch(getBlogs());
  }
  const lst = blogs.map((b) => {
    return (
      <article className="blog" key={b._id}>
        <Link className="blog__title text-color" to={`/blog/${b._id}`}>{b.title}</Link>
        <div className="blog__attr">
          <span className="blog__date">{b.created_at}</span>
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