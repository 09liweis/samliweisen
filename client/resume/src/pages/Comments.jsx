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

const Button = styled.button`
  border: none;
  background-color: #06A763;
  padding: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: 0.5 ease;
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
        {comments.map((c) => 
          <Comment key={c._id}>
            <span>{c.name} - {c.created_at}</span>
            <p>{c.content}</p>
          </Comment>
        )}
        <form onSubmit={(e)=>handleSubmit(e)}>
          <div>
            <input style={{'width': '100%', 'padding': '10px', 'marginBottom': '10px', 'fontSize': '16px'}} type="text" name="name" placeholder="请输入你的大名" value={comment.name} onChange={(e)=>handleChange(e)} />
          </div>
          <textarea style={{'width': '100%', 'height': '200px', 'padding': '10px'}} placeholder="请留下你的足印，随便说说" name="content" value={comment.content} onChange={(e) => handleChange(e)}></textarea>
          <Button>Submit</Button>
        </form>
      </BoxBody>
    </Box>
  );
}
export default Comments;