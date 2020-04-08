import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'
import './style/RecoverTicket.sass'
import {Feedback} from '.'
import './style/EntryVehicle.sass'
import { useQrEncode } from 'react-qr-hooks'


export default withRouter(function({ history, error, onSubmit, ticket}){

    const [ reset, setReset] = useState()
   debugger
    const handleVehicle = (event) => {
        event.preventDefault()

        const { target: {
            carPlate: {value: carPlate}
        } } = event

        onSubmit(carPlate)

        setReset(true)
    }

    const handleTicket = (event) => {
        
        event.preventDefault()
        
        setReset(false)
        
        history.push('/home')
    }

    const encoded = useQrEncode(ticket)


    return <section className="recover-ticket">
    {ticket && reset && !error ? 
    <> 
    <img src={encoded} className="qr" alt="qr-code"/> 
    <button className="recover-ticket__go-in" onClick={handleTicket}>Ticket</button> </>
    : <>
    <h1 className="recover-ticket__title">Recover ticket</h1>
    <form className="recover-ticket__form" onSubmit={handleVehicle}>
        <input type="text" name="carPlate" placeholder="car plate number" className="recover-ticket__input" />

        <button className="recover-ticket__submit">Get ticket</button>
    </form>
    </>
    }
        {error && <div className="error-container"> <Feedback message={error} level="error" /> </div>}

    </section>
    

})