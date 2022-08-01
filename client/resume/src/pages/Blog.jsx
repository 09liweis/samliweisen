import React, {useState,useEffect} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';

import {updateDocumentTitle} from '../helpers';

const Blog = (props) => {
  const [blog,setBlog] = useState({id:props.match.params.id});
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    axios.get(`/api/blogs/${blog.id}`).then((res) => {
      let v = res.data;
      setBlog(v);
      updateDocumentTitle(v.title);
      setLoading(false);
    });
  },[]);
  return (
    <Box id="movie_detail">
      <BoxTitle>
        <i className="boxIcon fa fa-film" aria-hidden="true"></i>
        <span>{ blog.title || 'Blog Title' }</span>
      </BoxTitle>
      <BoxBody>
        {loading ?
        'Loading':
        <article>
          <section dangerouslySetInnerHTML={{ __html:blog.content }}></section>
        </article>
        }
      </BoxBody>
    </Box>
  );
}
export default Blog;
