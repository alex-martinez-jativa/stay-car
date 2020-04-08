import React, {useState} from 'react'
import './style/ValidateTicket.sass'
import validateTicket from '../logic/validate-ticket'
import {Feedback} from '.'
import {withRouter} from 'react-router-dom'

export default withRouter (function({history, infoTicket}) {

    const [error, setError] = useState()

    function __handleError__(error) {
      
        setError({ error: error.message })
  
        setTimeout(() => {
          setError({ error: undefined })
        }, 3000)
    }

    async function handleValidate(event) {
        try{

            event.preventDefault()
            let ticketid = infoTicket.ticketId
            let amount = infoTicket.amount
            validateTicket(ticketid, amount)

            history.push('/home')

        }catch(error){
            __handleError__(error)
        }
    }


    return <section className="validate">
    <h1 className="validate__title">Validate Ticket</h1>

    <form className="validate__form" onSubmit={handleValidate}>
        <input type="text" name="price" value={`${infoTicket.amount.toFixed(2)}€`} className="validate__price"/>
        <button className="validate__submit">Validate</button>
    </form>
    
    {error && <Feedback message={error} level="warn"/>}
</section>

})