import React, {useState,useEffect} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';

import '../css/movie.css';

const Poster = styled.img`
  width: 180px;
  display: block;
  margin: auto;
  border-radius: 10px;
`;

const Casts = styled.div`
  display: flex;
  .cast {
    width: 90px;
    margin-right: 10px;
    text-align: center;
    img {
      width: 100%;
      border-radius: 10px;
    }
  }
`;

const Movie = (props) => {
  const [visual,setVisual] = useState({id:props.match.params.id});
  const [loading,setLoading] = useState(true);
  function getSummary(douban_id,cb) {
    axios.post('/api/visuals/summary',{douban_id}).then((res) => {
      return cb(res);
    });
  }
  useEffect(()=>{
    axios.get(`https://what-i-watched.herokuapp.com/api/visual/${visual.id}`).then((res) => {
      const {douban_id} = res.data.result;
      let v = res.data.result;
      getSummary(douban_id,(res)=> {
        if (res && res.data && res.data.douban_id) {
          v = Object.assign(v,res.data);
        }
        setVisual(v);
        setLoading(false);
      });
    });
  },[]);
  return (
    <Box id="movie_detail">
      <BoxTitle>
        <i className="boxIcon fa fa-film" aria-hidden="true"></i>
        <span>{ visual.title || 'Movie Title' }</span>
      </BoxTitle>
      <BoxBody>
        {loading ?
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>:
        <div style={{position:'relative'}}>
          <Poster src={'https://images.weserv.nl/?url='+visual.poster} />
          <div style={{padding:'20px 10px 10px',marginTop:'-20px',backgroundColor:'#ccc',border:'1px solid',borderRadius:'10px'}}>
            <div>{visual.release_date} {visual.duration}min</div>
            <div className="visual__rating">{visual.douban_rating}</div>
            <p>{visual.summary}</p>
            {visual.casts?
            <Casts>
              {visual.casts.map((c)=>
                <div className="cast" key={c.id}>
                  <img src={'https://images.weserv.nl/?url='+c.avt} />
                  <span>{c.name}</span>
                  <span>{c.role}</span>
                </div>
              )}
            </Casts>
            :null}
            {visual.comments?
            <div className="comments">
              {visual.comments.map((c)=>
                <div className="comment" key={c.author}>{c.author}: {c.text}</div>
              )}
            </div>
            :null}
            {visual.reviews?
            <div className="reviews">
              {visual.reviews.map((r)=>
                <div className="review" key={r.title}>
                  <h5>{r.title}</h5>
                  <p>{r.content}</p>
                </div>
              )}
            </div>
            :null}
          </div>
        </div>
        }
      </BoxBody>
    </Box>
  );
}
export default Movie;
