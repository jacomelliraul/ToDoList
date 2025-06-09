import { useState, useEffect, useRef } from 'react'
import './style.css'
import Trash from '../../assets/trash.png'
import Pencil from '../../assets/pencil.png'
import api from '../../services/api'

function Home() {
  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null)

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  async function getUsers() {
    const usersFromAPI = await api.get('/usuarios')
    setUsers(usersFromAPI.data) 
  }

  async function createUsers() {
    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    getUsers()
    clearInputs()
  }

  async function updateUser() {
    await api.put(`/usuarios/${editingUser.id}`, {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    getUsers()
    setEditingUser(null)
    clearInputs()
  }

  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)
    getUsers()
  }

  function handleEdit(user) {
    setEditingUser(user)
    inputName.current.value = user.name
    inputAge.current.value = user.age
    inputEmail.current.value = user.email
  }

  function clearInputs() {
    inputName.current.value = ''
    inputAge.current.value = ''
    inputEmail.current.value = ''
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuarios</h1>
        <input placeholder="Nome" type="text" name='nome' ref={inputName}/>
        <input placeholder="Idade" type="number" name='idade' ref={inputAge}/>
        <input placeholder="Email" type="email" name='email' ref={inputEmail}/>
        
        {editingUser ? (
          <>
            <button type='button' onClick={updateUser}>Atualizar</button>
            <button type='button' onClick={() => {
              setEditingUser(null)
              clearInputs()
            }}>Cancelar</button>
          </>
        ) : (
          <button type='button' onClick={createUsers}>Cadastrar</button>
        )}
      </form>

      {users.map((user) => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.name}</span></p>
            <p>Idade: <span>{user.age}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </div>
          <div className='buttons'>
            <button onClick={() => handleEdit(user)}>
              <img src={Pencil} alt="Editar"/>
            </button>
            <button onClick={() => deleteUsers(user.id)}>
              <img src={Trash} alt="Excluir"/>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home