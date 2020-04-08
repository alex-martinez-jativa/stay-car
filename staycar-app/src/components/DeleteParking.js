import React from 'react'
import './style/DeleteParking.sass'
import { withRouter } from 'react-router-dom'
import {Feedback} from '.'


export default withRouter(function({onSubmit, error, history}) {


    const handleDelete = (event) => {

        event.preventDefault()
        const { target: {
            parkingName: { value: parkingName }
        } } = event

        onSubmit(parkingName)
    }
   
    return <section className="delete-parking">
    <div className="delete-parking__head">
        <h1 className="delete-parking__title">Delete Parking:</h1>
    </div>
    <form className="delete-parking__form" onSubmit={handleDelete}>
        <input type="text" name="parkingName" placeholder="parking name" className="delete-parking__input" />
        <button className="delete-parking__submit">Delete</button>
    </form>
    
    {error && <Feedback message={error} level="error" />}
    </section>
})