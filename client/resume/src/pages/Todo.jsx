import React, {useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {CSSTransition,TransitionGroup} from 'react-transition-group';

import {getTodos, addTodo, editTodo, deleteTodo} from '../actions/todo';
import {updateDocumentTitle} from '../helpers';

import '../css/todo.css';

const Todo = () => {
  updateDocumentTitle('Todos');
  const emptyTodo = {name:'',date:'',status:'pending',steps:[]};
  const [showForm,setShowForm] = useState(false);
  const [curTodo, setCurTodo] = useState(emptyTodo)
  const dispatch = useDispatch();
  const loading = false;//if use loading from useSelector, no render animation
  const {items} = useSelector(state => state.todos);
  useEffect(() => {
    dispatch(getTodos());
  },[]);
  if (items && items.length === 0) {
  }
  var errorMsg;
  const handleEdit = (todo, idx) => {
    setShowForm(true);
    var curTodo = Object.assign({},todo);
    curTodo.idx = idx;
    setCurTodo(curTodo);
  }
  const handleComplete = (idx) => {

  }
  const handleRemove = (todoId, idx) => {
    dispatch(deleteTodo(todoId, idx));
  }
  const handleUpsert = () => {
    if (curTodo._id) {
      var idx = curTodo.idx;
      delete curTodo.idx;
      dispatch(editTodo(curTodo, idx));
    } else {
      dispatch(addTodo(curTodo));
    }
    setShowForm(false);
    setCurTodo(emptyTodo);
  }
  const handleChange = (e) => {
    var {value,name} = e.target;
    var todo = Object.assign({},curTodo);
    todo[name] = value;
    setCurTodo(todo);
  }
  const todoForm = (
    <div className="todo__form">
      <input className="todo__input box-shadow" name="name" placeholder="title" value={curTodo.name} onChange={(e)=>handleChange(e)} />
      <input type="date" className="todo__input box-shadow" name="date" placeholder="date" value={curTodo.date} onChange={(e)=>handleChange(e)} />
      <input className="todo__input box-shadow" name="status" placeholder="status" value={curTodo.status} onChange={(e)=>handleChange(e)} />
      {curTodo.steps.length?
        <div className="">
          {curTodo.steps.map((s,i)=>
            <div key={i}>{s.name} - {s.status}</div>
          )}
        </div>
      :null}
      <div className="todo__btn" onClick={()=>handleUpsert()}>OK</div>
    </div>
  );
  const todoList = items.map((todo, idx) => 
    <CSSTransition key={todo._id} timeout={500} classNames="todoAnimation">
      <div className={`todo ${todo.status}`}>
        <span className="todo__complete" onClick={()=>handleComplete(idx)}>{todo.status == 'pending' ? 'Working' : 'Done'}</span>
        <div className="todo__title">{todo.name}</div>
        {todo.status != 'done'?
        <div className="todo__actions">
          <div className="todo__edit" onClick={()=>handleEdit(todo, idx)}>Edit</div>
          <div className="todo__remove" onClick={()=>handleRemove(todo._id,idx)}>Remove</div>
        </div>
        :null}
      </div>
    </CSSTransition>
  );
  return (
    <div className="container">
      {showForm?todoForm:''}
      <h2 className="todos__title">Todo List</h2>
      <div className="todos__container">
        <a className="todo__btn" onClick={()=>setShowForm(true)}>Add New</a>
        <div className="todo__statics">
          <span className="done">Done</span>
          <span className="working">In Progress</span>
          <span className="pending">Pending</span>
        </div>
        {loading ? 
        <div className="todos__loader"></div>
        :
        <TransitionGroup>
        {todoList}
        </TransitionGroup>
        }
        {errorMsg}
      </div>
    </div>
  )
}
export default Todo;