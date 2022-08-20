import React,{ Suspense, lazy } from 'react';
import { HashRouter, Switch, Route, browserHistory  } from 'react-router-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
// import { getCharacters } from './reducer/characters/actions';
import './css/resume.css';
import Status from './components/Status.jsx';
import Nav from './components/Nav.jsx';

import Widgets from './components/Widgets.jsx';

import Home from './pages/Home.jsx';
import Todo from './pages/Todo.jsx';
import Videos from './pages/Videos.jsx';
import Movies from './pages/Movies.jsx';
import Movie from './pages/Movie.jsx';
import Blog from './pages/Blog.jsx';
import Blogs from './pages/Blogs.jsx';
import Comments from './pages/Comments.jsx';
// import Transactions from './pages/Transactions.jsx';
// const Home = lazy(() => require('./pages/Home.jsx'));
// const Movies = lazy(() => require('./pages/Movies.jsx'));
// const Todo = lazy(() => require('./pages/Todo.jsx'));
// const Blogs = lazy(() => require('./pages/Blogs.jsx'));
// const Comments = lazy(() => require('./pages/Comments.jsx'));

const store = createStore(reducer, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
));
export default class Main extends React.Component {
  render() {
    return ([
      <Provider store={store} key="provider">
        <HashRouter key="page">
          <React.Fragment>
            <Status key="status"/>
            <Nav key="nav" />
            <div id="display-flex flex-wrap" className="container">
              <Widgets/>
              <main id="main">
                <Route exact path='/' component={Home} />
                <Route path='/todo' component={Todo} />
                <Route path='/movies' component={Movies} />
                <Route path='/movie/:id' component={Movie} />
                <Route path='/blogs' component={Blogs} />
                <Route path='/blog/:id' component={Blog} />
                <Route path='/videos' component={Videos} />
                <Route path='/comments' component={Comments} />
                {/* <Route path='/transactions' component={Transactions} /> */}
              </main>
            </div>
          </React.Fragment>
        </HashRouter>
      </Provider>,
    ]);
  }
}