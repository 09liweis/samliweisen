import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';
import styled from 'styled-components';

const Comment = styled.div`
  margin-bottom: 10px;
  border: 1px solid #06A763;
  padding: 10px;
  border-radius: 10px;
`;

const Input = styled.input`
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #06A763;
  outline: none;
`;

const Button = styled.button`
  border: none;
  background-color: #06A763;
  padding: 10px;
  color: #ffffff;
  cursor: pointer;
  margin-bottom: 10px;
  transition: 0.5s ease;
  &:hover {
    background-color: #06B763;
  }
`;

const Comments = () => {
  const newComment = {name:'',content:''};
  const [comment, setComment] = useState(newComment);
  const [comments, setComments] = useState([]);
  useEffect(()=>{
    getComments();
  },[]);
  const getComments = () => {
    axios.get('/api/comments').then((res) => {
      if (res.status == 200) {
        setComments(res.data);
      }
    });
  }
  const handleChange = (e) => {
    const v = e.target.value;
    const p = e.target.name;
    let curComment = Object.assign({},comment);
    curComment[p] = v;
    setComment(curComment);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/comments', comment).then((res) => {
      if (res.status == 200) {
        getComments();
        setComment(newComment);
      }
    });
  }
  return(
    <Box className="comments container">
      <BoxTitle>
        <i className="boxIcon fa fa-comments" aria-hidden="true"></i>
        <span>来啦各位帅哥美女，留个言吧，给小弟一些意见</span>
      </BoxTitle>
      <BoxBody>
        <form onSubmit={(e)=>handleSubmit(e)}>
          <Input name="name" placeholder="请输入你的大名" value={comment.name} onChange={(e)=>handleChange(e)} />
          <Input placeholder="请留下你的足印，随便说说" name="content" value={comment.content} onChange={(e) => handleChange(e)} />
          <Button>Submit</Button>
        </form>
        {comments.map((c) => 
          <Comment key={c._id}>
            <span>{c.name} - {c.created_at}</span>
            <p>{c.content}</p>
          </Comment>
        )}
      </BoxBody>
    </Box>
  );
}
export default Comments;