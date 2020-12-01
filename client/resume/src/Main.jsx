import React,{ Suspense, lazy } from 'react';
import { HashRouter, Switch, Route, browserHistory  } from 'react-router-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
// import { getCharacters } from './reducer/characters/actions';

import BackgroundCanvas from './components/BackgroundCanvas.jsx';
import Nav from './components/Nav.jsx';

import Widgets from './components/Widgets.jsx';

import Home from './pages/Home.jsx';
import Todo from './pages/Todo.jsx';
import Movies from './pages/Movies.jsx';
import Movie from './pages/Movie.jsx';
import Blogs from './pages/Blogs.jsx';
import Comments from './pages/Comments.jsx';
import Transactions from './pages/Transactions.jsx';
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
          <div>
            <BackgroundCanvas />
            <Nav key="nav" />
            <div id="mainContainer" className="container">
              <Widgets/>
              <main id="main">
                <Route exact path='/' component={Home} />
                <Route path='/todo' component={Todo} />
                <Route path='/movies' component={Movies} />
                <Route path='/movie/:id' component={Movie} />
                <Route path='/blogs' component={Blogs} />
                <Route path='/comments' component={Comments} />
                <Route path='/transactions' component={Transactions} />
              </main>
            </div>
          </div>
        </HashRouter>
      </Provider>,
    ]);
  }
}