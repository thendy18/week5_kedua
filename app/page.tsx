'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  // State untuk fitur EDIT
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // 1. READ
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data);
      setLoading(false);
    } catch (error) {
      console.error('Gagal ambil data', error);
    }
  };

  // 2. CREATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo) return;

    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo }),
    });
    setNewTodo('');
    fetchTodos();
  };

  // 3. DELETE
  const handleDelete = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  };

  // 4. UPDATE (Mulai Edit)
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  // 4. UPDATE (Simpan Perubahan)
  const saveEdit = async (id: number) => {
    await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title: editText }),
    });
    setEditingId(null); // Keluar mode edit
    fetchTodos(); // Refresh data
  };

  // BATAL Edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#fff', // Container putih
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)', // Shadow biar elegan
      color: '#333'
    },
    title: { textAlign: 'center' as const, color: '#333', marginBottom: '30px' },
    form: { display: 'flex', gap: '10px', marginBottom: '30px' },
    input: {
      flex: 1,
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px'
    },
    addButton: {
      padding: '12px 24px',
      backgroundColor: '#0070f3',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold' as const
    },
    list: { listStyle: 'none', padding: 0 },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      borderBottom: '1px solid #eee',
      backgroundColor: '#f9f9f9',
      marginBottom: '10px',
      borderRadius: '6px'
    },
    actionButtons: { display: 'flex', gap: '8px' },
    editBtn: {
      backgroundColor: '#f5a623',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteBtn: {
      backgroundColor: '#ff4d4f',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    saveBtn: {
      backgroundColor: '#52c41a',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '5px'
    },
    cancelBtn: {
      backgroundColor: '#888',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TO - DO LIST</h1>
      
      {/* Form Tambah */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Mau ngapain hari ini?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.addButton}>Tambah</button>
      </form>

      {/* Daftar Tugas */}
      {loading ? (
        <p style={{textAlign: 'center'}}>Loading...</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.listItem}>
              
              {/* LOGIKA TAMPILAN: Mode Edit vs Mode Biasa */}
              {editingId === todo.id ? (
                // Tampilan Mode EDIT
                <div style={{display: 'flex', width: '100%', gap: '10px'}}>
                  <input 
                    type="text" 
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)}
                    style={{...styles.input, padding: '8px'}} 
                  />
                  <div>
                    <button onClick={() => saveEdit(todo.id)} style={styles.saveBtn}>Save</button>
                    <button onClick={cancelEdit} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </div>
              ) : (
                // Tampilan Mode BIASA (Baca)
                <>
                  <span style={{fontSize: '18px'}}>{todo.title}</span>
                  <div style={styles.actionButtons}>
                    <button onClick={() => startEditing(todo)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(todo.id)} style={styles.deleteBtn}>Hapus</button>
                  </div>
                </>
              )}
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}