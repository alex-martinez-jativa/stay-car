import React, {useState} from 'react'

export default ({ticket}) => {

    return <>
        <div class="report__item">
            <p>Ticket id: <span>{ticket.id}</span></p>
            <p>Car plate: <span>{ticket.carPlate}</span></p>
            <p>Validated: <span>{`${ticket.validated}`}</span></p>
            <p>Exit: <span>{`${ticket.exit}`}</span></p>
            {ticket.amount !== undefined && <p>Amount: <span>{`${ticket.amount}`}</span></p>}
        </div>
    </>
}