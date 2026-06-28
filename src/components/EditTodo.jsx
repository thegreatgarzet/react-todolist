import React from 'react'
import { useEffect, useState } from 'react'
import "./EditTodo.css";
import CategoryOptions from './CategoryOptions';

const EditTodo = ({ editOpen, onClose, onSave, todo }) => {
    const [editText, setEditText] = useState(todo?.text || "");
    const [editCategory, setEditCategory] = useState(todo?.category || "");

    useEffect(() => {
        if (todo) {
            setEditText(todo.text);
            setEditCategory(todo.category);
        }
    }, [todo]);

    if (!editOpen) return null;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Todo</h2>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                    <CategoryOptions />
                </select>
                <button onClick={() => onSave(editText, editCategory)}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default EditTodo