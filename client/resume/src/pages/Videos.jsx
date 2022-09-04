import React, {useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {getVideos} from '../actions/video';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';
import {updateDocumentTitle} from '../helpers';

import '../css/videos.css';

const Movies = () => {
  updateDocumentTitle('Vlogs');
  var [page,setPage] = useState(1);
  const {items,loading} = useSelector(state => state.videos);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVideos());
  },[]);
  const visuals = items.map((v) => {
    return (
      <a href={`https://www.bilibili.com/video/${v.bvid}`} target="_blank" className="bVideo transition full-width text-color perspective-hover" key={v.bvid}>
        <img className="video_img full-width border-radius" src={'https://images.weserv.nl/?url='+v.pic} />
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
        <div className="visual__list display-flex flex-wrap">
          {loading ?<div className="lds-hourglass"></div>:visuals}
        </div>
      </BoxBody>
    </Box>
  );
}
export default Movies;