import { useEffect, useState } from 'react'
import "./TodoListPage.css";

//Components
import Todo from '../components/Todo/Todo.jsx';
import TodoForm from '../components/TodoForm';
import Search from '../components/Search';
import Filter from '../components/Filter';
import EditTodo from '../components/EditTodo';
//

//Utils
import { categories } from '../utils/categories.js';
import authFetch from '../utils/authFetch.js'
//

function TodoListPage() {
  const defaultTodo = {
    id: 0,
    text: "",
    category: "",
    isComplete: false,
  }

  const [refreshes, setRefreshes] = useState(0)

  const [todos, setTodos] = useState([])

  const [search, setSearch] = useState("")

  const [filter, setFilter] = useState("All")

  const [sort, setSort] = useState("Asc");

  const [todoInEdit, setTodoInEdit] = useState(defaultTodo);

  const [editOpen, setEditOpen] = useState(false);

  const addTodo = async (text, category) => {
    try {
      const newGeneratedTodo = {
        text,
        category,
        isComplete: false,
      };

      const responseFetch = await authFetch(`${import.meta.env.VITE_API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGeneratedTodo),
      });

      console.log(responseFetch);

      const response = await responseFetch.json();

      setRefreshes(currentRefresh => currentRefresh + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const removeTodo = async (id) => {
    try {
      const responseFetch = await authFetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: '',
      });

      setRefreshes(currentRefresh => currentRefresh + 1);
    } catch (error) {
      console.log(error);
    }
  }

  const completeTodo = async (id) => {
    try {
      const currentTodos = [...todos];

      const todoToComplete = currentTodos.find(entry => entry._id === id);

      if (todoToComplete) {

        const todoToCompleteEdited = {
          text: todoToComplete.text,
          category: todoToComplete.category,
          isComplete: !todoToComplete.isComplete,
        }

        const responseFetch = await authFetch(`${import.meta.env.VITE_API_URL}/todos/${todoToComplete._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoToCompleteEdited),
        });

        const response = await responseFetch.json();

        console.log(response);

        setRefreshes(currentRefresh => currentRefresh + 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getNewID = () => {
    return Math.floor(Math.random() * 100000);
  }

  const handleCompletionFilter = (todos) => {
    return todos.filter((todo) => filter === "All" ? true : filter === "Complete" ? todo.isComplete : !todo.isComplete);
  }

  const handleSearchFilter = (todos) => {
    return todos.filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase()));
  }

  const handleAlphabeticFilter = (todos) => {
    return todos.sort((a, b) => sort === "Asc" ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text));
  }

  const openEdit = (todoID) => {
    const todo = todos.find((todo) => todo._id === todoID);

    if (!todo) return;

    setTodoInEdit(todo);
    setEditOpen(true);
  }

  const saveAndCloseEdit = async (newText, newCategory) => {
    try {
      if (todoInEdit) {
        const todoEdited = {
          text: newText,
          category: newCategory,
          isComplete: todoInEdit.isComplete,
        }

        const responseFetch = await authFetch(`${import.meta.env.VITE_API_URL}/todos/${todoInEdit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(todoEdited),
        });

        const response = await responseFetch.json();

        console.log(response);

        setRefreshes(currentRefresh => currentRefresh + 1);
      }
    } catch (error) {
      console.log(error);
    }

    closeEdit();
  }

  const closeEdit = () => {
    setTodoInEdit(defaultTodo);
    setEditOpen(false);
  }

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const responseFetch = await authFetch(`${import.meta.env.VITE_API_URL}/todos`);

        const jsonRes = await responseFetch.json();

        if (!responseFetch.ok) {
          console.log("Erro durante request");

          setTodos([]);

          return;
        }

        setTodos(jsonRes);
      } catch (error) {
        setTodos([]);
        console.log("Falha na req: ", error);
      }
    };

    fetchTodos();
  }, [refreshes]);



  return (
    <div className='app'>
      <h1>Lista de Tarefas</h1>
      <Search search={search} setSearch={setSearch} />
      <Filter filter={filter} setFilter={setFilter} setSort={setSort} />
      <div className="todo-list">
        {handleAlphabeticFilter(handleSearchFilter(handleCompletionFilter(todos)))
          .map((todo) => (
            <Todo key={todo._id} todo={todo} completeTodo={completeTodo} editTodo={openEdit} removeTodo={removeTodo} />
          ))}
      </div>
      <TodoForm addTodo={addTodo} />
      <EditTodo editOpen={editOpen} onClose={closeEdit} onSave={saveAndCloseEdit} todo={todoInEdit} />
    </div>
  )
}

export default TodoListPage
