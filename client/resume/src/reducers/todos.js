const todos = (state = {items:[],loading:true}, action) => {
  switch (action.type) {
    case 'GET_TODOS':
      var todos = []
      if (Array.isArray(action.ex)) {
        todos = action.ex;
      }
      return {items:todos,loading:false};
    case 'ADD_TODO':
      var items = [action.ex,...state.items];
      return {items};
    case 'EDIT_TODO':
      var updateTodo = action.ex;
      var idx = action.idx;
      state.items[idx]= updateTodo;
      return {items:state.items};
    case 'DELETE_TODO':
      var idx = action.idx;
      state.items.splice(idx,1);
      return  {items:state.items};
    default:
      return state;
  }
};
export default todos;