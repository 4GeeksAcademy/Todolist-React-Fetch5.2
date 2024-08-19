import React, { useState, useEffect } from "react"

const Home = () => {

    const [nameValue, setNameValue] = useState("")
    const [userList, setUsersList] = useState([])
    const [switchGetList, setswitchGetList] = useState(false)
    const [taskList, setTaskList] = useState([])
    const [task, setTask] = useState([])

    //Para verificar que esta imprimiendo el input que fue seteado con el onChange y el setNameValue
    // const mostrarNameValue = () => {
    //     console.log(nameValue);//muestra el valor del input value luego del onchange 
    // }

    const createUser = () => {
        if (nameValue === "") {
            return (alert("Debes agregar un usuario primero"))
        }
        fetch(`https://playground.4geeks.com/todo/users/${nameValue}`, {
            method: "POST"
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.name) {
                    alert("Usuario creado con exito")
                    setswitchGetList(prev => !prev)
                    // setNameValue("")
                } else {
                    alert("Hubo inconvenientes, revisa si ya tienes un usuario agregado con ese nombre")
                }
            })
    }

    const deleteUser = () => {
        if (nameValue === "") {
            alert("Por favor, selecciona un usuario");
            return;
        }
        fetch(`https://playground.4geeks.com/todo/users/${nameValue}`, {
            method: "DELETE"
        })
            .then((response) => {
                // console.log(response)
                if (response.ok) {
                    alert("Usuario eliminado con exito");
                    setswitchGetList(prev => !prev)
                    setNameValue("")
                }
            })

    }

    const getUsersList = () => {//guarda la lista de personas en una lista
        fetch("https://playground.4geeks.com/todo/users")
            .then((response) => response.json())
            .then((data) => {
                setUsersList(data.users)
            })

    }

    const getTaskListFromUser = () => {
        // Verificar si se ha seleccionado un usuario
        if (nameValue === "") {
            alert("Por favor, selecciona un usuario");
            return;
        }
        fetch(`https://playground.4geeks.com/todo/users/${nameValue}`)
            .then((response) => response.json())
            .then((data) => {
                setTaskList(data.todos)
            })
    }

    const createNewTask = (e) => {
        if (e.key === "Enter") {
            fetch(`https://playground.4geeks.com/todo/todos/${nameValue}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "label": task,
                    "is_done": false

                })
            })
                .then((response) => response.json())

                .then((data) => {

                    if (data.label) {
                        setTaskList([...taskList, data])
                        setTask("")
                    }
                })
        } else {
            return
        }
    }

    const deleteTask = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE"
        })
            .then((response) => {
                console.log(response)
                if (response.ok) {

                    let listaFiltrada = taskList.filter((item) => item.id !== id)
                    setTaskList(listaFiltrada)
                }
            })

    }

    useEffect(() => {
        getUsersList() // De forma automatica Apenas se ejecuta el componente Home Llama y ejecuta la funcion getUserList y se guarda en una array de un estado local "userList" 
    }, [switchGetList])//useEffect cuando ve que  switchGetList cambia de false a true y de true a false va forzar que obtenga nuevamente la lista


    return (
        <div className="container-fluid p-4 m-0">
            <h1 className="text-center mt-5  fw-light " >Todo List {nameValue}</h1>
            <div className="container mx-auto w-75 p-1">
                <div className="row">
                    <h2>Users</h2>
                    <div className="col">
                        <input type="text" className="form-control  border-0 fw-light" placeholder="Add your name" onChange={(e) => {
                            setNameValue(e.target.value)
                        }} value={nameValue} /> {/*Actualiza nameValue cuando cambia el input  // Imprime el valor actual del input justo cuando ocurre el cambio*/}
                        {/* <button onClick={mostrarNameValue}>Mostrar Valor</button> al hacer click llama a mostrarNameValue al hacer clic */}
                    </div>
                    <div className="col">
                        <button className="btn btn-secondary" onClick={createUser}>Create User</button> {/* Al hacer click llama a createUser al hacer clic */}
                    </div>
                </div>
                <div className="row">
                    <h4>List of User</h4>
                    <div className="col">
                        <select className="form-select dropdown-menu-end mb-5" onChange={(e) => { setNameValue(e.target.value) }} value={nameValue} >
                            <option> Select user</option>
                            {
                                userList.map((item, index) => {
                                    return (
                                        <option key={index}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="col">
                        <button className="btn btn-secondary" onClick={deleteUser}>Delete User</button> {/*Al hacer click llama a deleteUser al hacer clic */}
                        <button className="btn btn-secondary" onClick={getTaskListFromUser}>Get TaskList</button> {/*Al hacer click llama a getListr al hacer clic */}
                    </div>
                </div>
                <div>
                    <h4>{nameValue} Todo list</h4>
                    <ul className="list-group rounded-0 shadow-lg  mb-5 bg-body-tertiary fw-light fs-3">
                        <li className="list-group-item ">
                            <input type="text" className="form-control  border-0 fw-light fs-3" placeholder="What needs to be done?" onChange={(e) => setTask(e.target.value)} value={task} onKeyDown={createNewTask} />
                        </li>
                        {taskList.length === 0 ? (
                            <li className="list-group-item text-center  fw-light fs-3 ">No hay tareas, añadir tareas</li>
                        ) : (
                            taskList.map((item) => {
                                return (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center fs-2">
                                        {item.label}
                                        <i className="fas fa-trash-alt icon" style={{ color: "red" }} onClick={() => deleteTask(item.id)}></i>
                                    </li>
                                )
                            }))
                        }
                        <li className="text-start list-group-item" >{taskList.length} Tasks</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Home