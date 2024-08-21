import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <div className='message'>
      {message}
    </div>
  )
}

const ErrorMessage = ({message}) => {
  if (message == null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}


const Person = ({person, handleDelete}) => {
  return (
    <div> {person.name} {person.number} 
    <button onClick={() => handleDelete(person.id)}> delete </button>
    </div> 
  )
}

const Persons = ({persons, handleDelete}) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.name} person={person} handleDelete={handleDelete} /> 
      )}
    </div>
  )
}

const PersonForm = ({addPerson, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
      <div> name: <input value ={newName} onChange={handleNameChange}/></div>
      <div> number: <input value = {newNumber} onChange={handleNumberChange}/></div>
      <div> <button type="submit">add</button></div>      
    </form>
  )
}

const Filter = ({filter, handleFilterChange}) => {
  return (
      <div>filter shown with: <input value={filter} onChange={handleFilterChange} /> </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(response => {
      setPersons(response.data)
      })
  }, [])

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))

    const addPerson = (event) => {
      event.preventDefault()
    
      const existingPerson = persons.find(person => person.name === newName)
    
      if (existingPerson) {
        if (confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
          const id = existingPerson.id
          const changedNumber = { ...existingPerson, number: newNumber }
    
          personService.update(id, changedNumber)
          .then(response => {
            setPersons(persons.map(person => 
              person.id !== id ? person : response.data
            ))
            setNotification(`${newName}'s number has been changed successfully!`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
  
        setNewName('')
        setNewNumber('')
      }
      } else {
        const personObject = {
          id: String(persons.length + 1),
          name: newName,
          number: newNumber,
        }
    
        personService.create(personObject)
          .then(response => {
            setPersons(persons.concat(response.data))
            setNewName('')
            setNewNumber('')
          })
          setNotification(`${newName}s has been added successfully!`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
      }
    }
    
  const handleNameChange = (event) => {
    setNewName(event.target.value) 
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    const deletePerson = persons.find(person => person.id == id)
    console.log(deletePerson)
    if (window.confirm(`Delete ${deletePerson.name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification(`${deletePerson.name} has been deleted`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(` ${deletePerson.name} has already been deleted`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <div>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
      </div>
    </div>
  )

}


export default App
