import React from 'react'
import './style/DeleteUser.sass'
import { withRouter } from 'react-router-dom'
import {Feedback} from '.'


export default withRouter(function({onSubmit, error, history}) {


    const handleDelete = (event) => {

        event.preventDefault()
        const { target: {
            userName: { value: userName },
            password: { value: password}
        } } = event

        onSubmit(userName, password)
    }
   
    return <section className="delete-user">
    <div className="delete-user__head">
        <h1 className="delete-user__title">Delete User:</h1>
    </div>
    <form className="delete-user__form" onSubmit={handleDelete}>
        <input type="text" name="userName" placeholder="username" className="delete-user__input" />
        <input type="password" name="password" placeholder="password" className="delete-user__input" />
        <button className="delete-user__submit">Delete</button>
    </form>
    
    {error && <Feedback message={error} level="error" />}
    </section>
})