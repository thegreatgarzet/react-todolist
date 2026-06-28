import React from 'react'
import './Todo.css'

const Todo = ({ todo, completeTodo, editTodo, removeTodo }) => {
  return (
    <div className="todo" style={{ textDecoration: todo.isComplete ? "line-through" : "", backgroundColor: todo.isComplete ? "#b2f3b2" : "#fff" }}>
      <div className="content">
        <p>{todo.text}</p>
        <p>{todo.category}</p>
      </div>
      <div>
        <button className='button complete' onClick={() => completeTodo(todo._id)}>Completar</button>
        <button className='button edit' onClick={() => editTodo(todo._id)}>Editar</button>
        <button className='button remove' onClick={() => removeTodo(todo._id)}>X</button>
      </div>
    </div>
  )
}

export default Todo