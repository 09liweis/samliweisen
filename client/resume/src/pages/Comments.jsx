import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';
import styled from 'styled-components';
import {CSSTransition,TransitionGroup} from 'react-transition-group';
import {updateDocumentTitle} from '../helpers';

const Comment = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  p {
    margin: 5px 0;
  }
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #06A763;
  outline: none;
  .name {
    border-color: red;
  }
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
  updateDocumentTitle('Comments');
  const newComment = {name:'',content:''};
  const [comment, setComment] = useState(newComment);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
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
    if (!comment.name) {
      setError('name');
      return;
    }
    if (!comment.content) {
      setError('content');
      return;
    }
    axios.post('/api/comments', comment).then((res) => {
      if (res.status == 200) {
        getComments();
        setComment(newComment);
        setError('');
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
          <Input className={error} className='border-radius' name="name" placeholder="请输入你的大名" value={comment.name} onChange={(e)=>handleChange(e)} />
          <Input className={error} className='border-radius' placeholder="请留下你的足印，随便说说" name="content" value={comment.content} onChange={(e) => handleChange(e)} />
          <Button>Submit</Button>
        </form>
        <TransitionGroup>
        {comments.map((c) => 
          <CSSTransition key={c._id} timeout={500} classNames="todoAnimation">
          <Comment className='bg-color border-radius' key={c._id}>
            <span className="nm text-capitalize">{c.name} - {c.created_at}</span>
            <p>{c.content}</p>
          </Comment>
          </CSSTransition>
        )}
        </TransitionGroup>
      </BoxBody>
    </Box>
  );
}
export default Comments;