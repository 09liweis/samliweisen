import React, {useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {getMovies} from '../actions/movie';
import {Box, BoxTitle, BoxBody} from '../components/style.jsx';
import Movie from '../components/Movie.jsx';
import {updateDocumentTitle} from '../helpers';
// import MoviePage from './Movie.jsx';

import '../css/movies.css';

const Movies = (props) => {
  var currentId = props.match.params.id;
  var [movieId, setMovieId] = useState(0);
  var [page,setPage] = useState(1);
  const {items,loading} = useSelector(state => state.movies);
  const dispatch = useDispatch();
  useEffect(() => {
    updateDocumentTitle('Movies');
    if (items.length == 0) {
      dispatch(getMovies({limit:15,page}));
    }
    if (currentId) {
      setMovieId(currentId)
    }
  },[]);
  const handleLoadmore = () => {
    page += 1;
    setPage(page);
    dispatch(getMovies({limit:15,page}));
  }
  const handleVisualClick = (id) => {
    // setMovieId(id);
  }
  const visuals = items.map((v) => {
    return (
      <article className="visual padding-10 transition full-width" key={v.id} onClick={()=>handleVisualClick(v.id)}>
        <Movie v={v} />
      </article>
    );
  });
  return (
    <Box id="movies">
      {/* {movieId?
        <React.Fragment>
          <span className="fa fa-times movie_detail_close" onClick={()=>setMovieId(0)}></span>
          <MoviePage id={movieId} />
        </React.Fragment>
      :''} */}
      <BoxTitle>
        <i className="boxIcon fa fa-film" aria-hidden="true"></i>
        <span>What I Watched</span>
      </BoxTitle>
      <BoxBody>
        <section className="visual__list display-flex flex-wrap">
          {loading ?<div className="lds-hourglass"></div>:visuals}
        </section>
        <div className="visual__loadmore" onClick={()=>handleLoadmore()}>Load More</div>
      </BoxBody>
    </Box>
  );
}
export default Movies;