import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import './style/EntryVehicle.sass'
import Feedback from './Feedback'
import { useQrEncode } from 'react-qr-hooks'
const { random } = Math


export default withRouter (function({onSubmit, error, history}) {

    const [plate, setPlate] = useState('')
    const [id, setId] = useState()

    const handleVehicle = (event) => {
        event.preventDefault()

        const { target: {
            plateNumber: {value: plateNumber},
            ticketId: {value : ticketId}
        } } = event

        setPlate(plateNumber)
        
        setId(ticketId)

        onSubmit(plateNumber, ticketId)
    }

    const handleGoIn = (event) => {
        event.preventDefault()
        history.push('/home')
    }

    const encoded = useQrEncode(id)


    return <section className="entry-plate">
    {plate && id && !error ? 
    <> 
    <img src={encoded} className="qr" alt="qr-code"/> 
    <button className="entry-plate__go-in" onClick={handleGoIn}>Go in</button> </>
    : <>
    <h1 className="entry-plate__title">Entrance</h1>
    <form className="entry-plate__form" onSubmit={handleVehicle}>
        <input type="text" name="plateNumber" placeholder="car plate number" className="entry-plate__input" />
        <input type="hidden" name="ticketId" value={random()}/>

        <button className="entry-plate__submit">Get ticket</button>
    </form>
    </>
    }
        {error && <div className="error-container"> <Feedback message={error} level="error" /> </div>}

    </section>
})