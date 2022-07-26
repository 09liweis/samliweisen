import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ReleaseDate = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 3px;
`;
const VisualContainer = styled.div`
  border-radius: 5px;
  background-color: #FFFFFF;
  box-shadow: 0 1px 6px rgba(0,0,0,.117647), 0 1px 4px rgba(0,0,0,.117647);
  position: relative;
`;
const VisualTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const doubanIcon = 'https://img3.doubanio.com/f/talion/2f3c0bc0f35b031d4535fd993ae3936f4e40e6c8/pics/icon/dou32.png';
const imdbIcon = 'https://cdn0.iconfinder.com/data/icons/social-media-2091/100/social-31-512.png';
const errImg = 'https://www.haitioutreach.org/wp-content/uploads/2016/05/404error-graphic.png';

export default class Movie extends React.Component {
  constructor(props) {
    super(props);
  }
  handleErrorImg(e) {
    e.target.onerror = null;
    e.target.src = errImg;
  }
  handleLink(e) {
    e.stopPropagation();
    return false;
  }
  render() {
    const v = this.props.v;
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
      <VisualContainer>
        <span className={`visual__status ${status}`}>{v.current_episode}/{v.episodes}</span>
        <ReleaseDate className='bg-color'>{v.release_date.substr(0,4)}</ReleaseDate>
        <Link to={movieHref}>
          <img className="visual__image" src={'https://images.weserv.nl/?url='+v.poster} alt={v.original_title} onError={(e)=>this.handleErrorImg(e)} />
        </Link>
        {/* <img className="visual__image" src={'https://images.weserv.nl/?url='+v.poster} alt={v.original_title} onError={(e)=>this.handleErrorImg(e)} /> */}
        <div className="visual__detail">
          <VisualTitle className='text-color'>{v.title}</VisualTitle>
          <div className="visual__ratings">
            <a className="visual__rating" target="_blank" onClick={(e)=>this.handleLink(e)} href={'https://movie.douban.com/subject/' + v.douban_id}>
              <img className="visual__rating-icon" src={doubanIcon} alt="" />
              <span className="visual__rating-point">{v.douban_rating}</span>
            </a>
            {v.imdb_id ?
            <a className="visual__rating" target="_blank" onClick={(e)=>this.handleLink(e)} href={'https://www.imdb.com/title/' + v.imdb_id}>
              <img className="visual__rating-icon" src={imdbIcon} alt="" />
              <span className="visual__rating-point">{v.imdb_rating}</span>
            </a>
            : null}
          </div>
        </div>
      </VisualContainer>
    );
  }
}