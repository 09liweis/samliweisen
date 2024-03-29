import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ReleaseDate = styled.div`
  background: #fff;
  color: #000;
  top: 0;
  right: 0;
  mix-blend-mode:screen;
`;
const VisualContainer = styled.div`
  
`;
const VisualTitle = styled.h3`
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const doubanIcon = 'https://img3.doubanio.com/f/talion/2f3c0bc0f35b031d4535fd993ae3936f4e40e6c8/pics/icon/dou32.png';
const imdbIcon = 'https://cdn0.iconfinder.com/data/icons/social-media-2091/100/social-31-512.png';
const errImg = 'https://www.haitioutreach.org/wp-content/uploads/2016/05/404error-graphic.png';

const Movie = (props) => {
  const handleErrorImg = (e) => {
    e.target.onerror = null;
    e.target.src = errImg;
  }
  const handleLink = (e) => {
    e.stopPropagation();
    return false;
  }
  const v = props.v;
  let status;
  if (v.current_episode == v.episodes) {
    status = 'done';
  }
  if (v.current_episode < v.episodes) {
    status = 'in_progress';
    if (v.current_episode == 0) {
      status = 'not_started';
    }
  }
  const movieHref = "/movie/" + v.id;
  return (
    <VisualContainer className='position-relative box-shadow border-radius bg-white'>
      <span className={`visual__status padding-3 text-white position-absolute border-radius-top-left text-center ${status}`}>{v.current_episode}/{v.episodes}</span>
      <ReleaseDate className='position-absolute padding-3 border-radius-top-right'>{v.release_date.substr(0,4)}</ReleaseDate>
      <Link to={movieHref}>
        <img className="visual__image border-radius-top" loading='lazy' src={'https://images.weserv.nl/?url='+v.poster} alt={v.original_title} onError={(e)=>handleErrorImg(e)} />
      </Link>
      <div className="visual__detail padding-10">
        <VisualTitle className='margin-0 text-color'>{v.title}</VisualTitle>
        <div className="visual__ratings">
          <a className="visual__rating" target="_blank" onClick={(e)=>handleLink(e)} href={'https://movie.douban.com/subject/' + v.douban_id}>
            <img className="visual__rating-icon" src={doubanIcon} alt="" />
            <span className="visual__rating-point">{v.douban_rating}</span>
          </a>
          {v.imdb_id ?
          <a className="visual__rating" target="_blank" onClick={(e)=>handleLink(e)} href={'https://www.imdb.com/title/' + v.imdb_id}>
            <img className="visual__rating-icon" src={imdbIcon} alt="" />
            <span className="visual__rating-point">{v.imdb_rating}</span>
          </a>
          : null}
        </div>
      </div>
    </VisualContainer>
  );
}
export default Movie;