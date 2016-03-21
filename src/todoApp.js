var NewTodo = React.createClass({
  getInitialState: function() {
    return {
      inputVal: ''
    }
  },
  addNewItem: function(e) {
    if(e.charCode === 13) {
      this.props.addItem(this.state.inputVal);
      this.setState({inputVal: ''});
    }
  },
  changeStatusOfAll: function(e) {
    this.props.changeStatusOfAll(e.target.checked);
  },
  handleInput: function(e) {
    this.setState({inputVal: e.target.value});
  }, 
  render: function() {
    var selectAllCheckbox = this.props.todosNumber ? <input type='checkbox' checked={!this.props.left} onChange={this.changeStatusOfAll}/> : null;
    return (
      <div className="new-todo">
        {selectAllCheckbox}
        <input type='text' className="new-todo_input" value={this.state.inputVal} onKeyPress={this.addNewItem} placeholder="What needs to be done?" onChange={this.handleInput}/>
      </div>
    )
  }
}),
Todo = React.createClass({
  toggleStatus: function() {
    this.props.toggleStatus(this.props.todoId);
  },
  clearTodo: function() {
    this.props.clearTodo(this.props.todoId);
  },
  render: function() {
    return (
    <div className="todo">
      <input type='checkbox' checked={this.props.todo.completed} onChange={this.toggleStatus}/>
      <span>{this.props.todo.task}</span>
      <span onClick={this.clearTodo} className="todo_cancel">x</span>
    </div>
    )
  }
}),
TodoList = React.createClass({
  showAllTodos: function() {
    var todoListEl = [],
    that = this;
    this.props.todos.forEach(function(todo,index) {
      todoListEl.push(<Todo todo={todo} key={todo.id} todoId={todo.id} toggleStatus={that.props.toggleStatus} clearTodo={that.props.clearTodo}/>);
    });
    return todoListEl; 
  },
  showActiveTodos: function() {
    var todoListEl = [],
    that = this;
    this.props.todos.forEach(function(todo,index) {
      if(!todo.completed) {
        todoListEl.push(<Todo todo={todo} key={todo.id} todoId={todo.id} toggleStatus={that.props.toggleStatus} clearTodo={that.props.clearTodo}/>);
      }    
    });
    return todoListEl;
  },
  showCompletedTodos: function() {
    var todoListEl = [],
    that = this;
    this.props.todos.forEach(function(todo,index) {
      if(todo.completed) {
        todoListEl.push(<Todo todo={todo} key={todo.id} todoId={todo.id} toggleStatus={that.props.toggleStatus} clearTodo={that.props.clearTodo}/>);
      }    
    }); 
    return todoListEl;
  },

  render: function() {
    var filters = {
      showAll: this.showAllTodos,
      showActive: this.showActiveTodos,
      showCompleted: this.showCompletedTodos
    },
    todoListEl = filters[this.props.filter]();
    return (
      <div className="todo-list">
        {todoListEl}
      </div>
      )
  }
}),
Filters = React.createClass({
  getSelectedfilter: function(e) {
    this.props.filterItems(e.currentTarget.value);
  },
  clearAllCompleted: function() {
    this.props.clearAllCompleted();
  },
  render: function() {
    var clearEl = (this.props.left < this.props.total) ? <span onClick={this.clearAllCompleted} className="footer_clear-completed">Clear completed</span> : null; 
    return (
      <div className="footer">
        <span>{this.props.left} items left </span>
        <span className="footer_filters">
          <span><input name="filter" type="radio" defaultChecked value="showAll" onChange={this.getSelectedfilter}/>All </span>
          <span><input name="filter" type="radio" value="showActive" onChange={this.getSelectedfilter}/>Active </span>
          <span><input name="filter" type="radio" value="showCompleted" onChange={this.getSelectedfilter}/>completed </span>
        </span>  
        {clearEl}
      </div>
    )  
  }
   
}),
TodoApp = React.createClass({
  todoId: 0,
  getInitialState: function() {
    return ({todos: [], filter: "showAll"})
  },
  addNewItemInTodoList: function(item) {
    var latestTodos = [].concat(this.state.todos);
    latestTodos.push({id: this.todoId, task: item, completed: false});
    this.setState({todos: latestTodos});
    this.todoId++;
  },
  filterItems: function(filter) {
    this.setState({filter: filter});
  },
  toggleStatus: function(todoId) {
    var latestTodos = [].concat(this.state.todos),
    selectedTodo = latestTodos.filter(function(todo){
      return (todo.id === todoId); 
    });
    selectedTodo[0].completed = !selectedTodo[0].completed;
    this.setState({todos: latestTodos});
  },
  updateAllTodos: function(status) {
    var latestTodos = [].concat(this.state.todos);
    latestTodos.forEach(function(todo) {
      todo.completed = status;
    });
    this.setState({todos: latestTodos})
  },
  clearTodo: function(todoId) {
    var latestTodos = [].concat(this.state.todos),
    selectedTodo = latestTodos.filter(function(todo){
      return (todo.id === todoId); 
    });
    latestTodos.splice(latestTodos.indexOf(selectedTodo[0]),1);
    this.setState({todos: latestTodos});
  },
  clearAllCompleted: function() {
    var latestTodos = [];
    this.state.todos.forEach(function(todo, index) {
      if(!todo.completed) {
        latestTodos.push(todo);
      }
    });
    this.setState({todos: latestTodos});
  },
  getActiveTodosCount: function() {
    var left = 0;
    this.state.todos.forEach(function(todo){
      if(!todo.completed) {
        left++;
      }
    });  
    return left;
  },
  render: function() { 
    var left = this.getActiveTodosCount(),
      filters = this.state.todos.length ? <Filters left={left} clearAllCompleted={this.clearAllCompleted} total={this.state.todos.length} filterItems={this.filterItems}/> : null;
    return (
      <div className="app-container">
        <NewTodo addItem={this.addNewItemInTodoList} todosNumber={this.state.todos.length} changeStatusOfAll={this.updateAllTodos} left={left}/>
        <TodoList todos={this.state.todos} filter={this.state.filter} toggleStatus={this.toggleStatus} clearTodo={this.clearTodo}/>
        {filters}
      </div>
    );
  }
});
ReactDOM.render(<TodoApp />,document.getElementById('content'));
