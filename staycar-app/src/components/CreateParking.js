import React from 'react'
import './style/CreateParking.sass'

import {Feedback} from '.'


export default ({onSubmit, error}) => {


    const handleSubmit = (event) => {

        event.preventDefault()
        const { target: {
            parkingName: { value: parkingName },
            rate: { value: rate },
            totalLots: { value: totalLots}
        } } = event

        onSubmit(parkingName, parseFloat(rate), parseFloat(totalLots))
    }
   
    return <section className="create-parking">
    <div className="create-parking__head">
        <h1 className="create-parking__title">Create Parking:</h1>
    </div>
    <form className="create-parking__form" onSubmit={handleSubmit}>
        <input type="text" name="parkingName" placeholder="parking name" className="create-parking__input" />
        <input type="text" name="rate" placeholder="rate" className="create-parking__input" />
        <input type="text" name="totalLots" placeholder="total lots" className="create-parking__input" />
        <button className="create-parking__submit">Create</button>
    </form>
    
    {error && <Feedback message={error} level="error" />}
    </section>
}