import React, {useState, useEffect} from 'react'
import './style/Report.sass'
import {retrieveTickets} from '../logic'
import { ReportItem , Feedback} from '.'

export default function() {

    const [tickets, setTickets] = useState([])
    const [err, setErr] = useState()

    function __handleError__(error) {
      
        setErr(error.message)
    }

    async function handleRetrieveTickets() {
        try{
            const res = await retrieveTickets()
            if(res.length===0) throw new Error('there are not tickets')
            setTickets(res)
        }catch(error){
            __handleError__(error)
        }
    }

    useEffect(() => {

        handleRetrieveTickets()
       
    }, [])


    return <section className="report">
    <h1 className="report__title">Report</h1>

    {tickets.map(ticket => <ReportItem key={ticket.id} ticket={ticket} />)}
    {err && <Feedback message={err} level="info" />}

</section>
}