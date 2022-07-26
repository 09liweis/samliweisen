import React, {useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {getVideos} from '../actions/video';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';

import '../css/videos.css';

const Movies = () => {
  var [page,setPage] = useState(1);
  const {items,loading} = useSelector(state => state.videos);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVideos());
  },[]);
  const visuals = items.map((v) => {
    return (
      <a href={`https://www.bilibili.com/video/${v.bvid}`} target="_blank" className="bVideo text-color" key={v.bvid}>
        <img className="video_img" src={'https://images.weserv.nl/?url='+v.pic} />
        <h4>{v.title}</h4>
      </a>
    );
  });
  return (
    <Box className="movies">
      <BoxTitle>
        <i className="boxIcon fa fa-film" aria-hidden="true"></i>
        <span>Vlog</span>
      </BoxTitle>
      <BoxBody>
        <div className="visual__list">
          {loading ?<div className="lds-hourglass"></div>:visuals}
        </div>
      </BoxBody>
    </Box>
  );
}
export default Movies;