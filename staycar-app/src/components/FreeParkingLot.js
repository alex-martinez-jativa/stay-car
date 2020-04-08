import React, { useState, useEffect } from 'react'
import Feedback  from './Feedback'
import './style/FreeParkingLot.sass'

import { retrieveParking } from '../logic'

export default function({onSubmit, error}) {

    const [ lots, setLots ] = useState([])
    const [ number, setNumber ] = useState()

    const handleRetrieveLots = () => {

        (async() => {

            const parking = await retrieveParking()
            let total = []
            parking[0].lots.forEach(res => {
            
            if(res.status === true){

                total.push(res.number)
            }
        })
        setLots(total)

        })()
    }


   useEffect(() => {

    handleRetrieveLots()

   },[])

   const handleChangeSelectLot = (event) => {

    const lotNumber = event.target.value
    
    setNumber(lotNumber)

   }

   const handleSubmit = (event) => {

    event.preventDefault()

    onSubmit(parseInt(number))

   }


   return <section className="free-lot">
    <h1 className="free-lot__title">Select lot number</h1>
    <form className="free-lot__form" onSubmit={handleSubmit}>

        <select name="lotNumber" value={number} className="free-lot__input" onChange={handleChangeSelectLot}>
            
            <option value="">--Select lot number--</option>
            
            {lots.map((lot) => 

                <option  key={lot} value={lot}>
                    {lot}
                </option>

            )} 

        </select>

        <button className="free-lot__submit">Go out</button>
    </form>

    {error && <Feedback message={error} level="error" />}
    
    </section>
}