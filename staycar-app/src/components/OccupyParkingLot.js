import React, { useState, useEffect } from 'react'
import Feedback  from './Feedback'
import './style/OccupyParkingLot.sass'

import { retrieveParking } from '../logic'

export default function({onSubmit, error}) {

    const [ lots, setLots ] = useState([])
    const [ number, setNumber ] = useState()

    const handleRetrieveLots = () => {

        (async() => {

            const parking = await retrieveParking()
            let total = []
            parking[0].lots.forEach(res => {
            
            if(res.status === false){

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


   return <section className="occupy-lot">
    <h1 className="occupy-lot__title">Select lot number</h1>
    <form className="occupy-lot__form" onSubmit={handleSubmit}>

        <select name="lotNumber" value={number} className="occupy-lot__input" onChange={handleChangeSelectLot}>
            
            <option value="">--Select lot number--</option>
            
            {lots.map((lot) => 

                <option  key={lot} value={lot}>
                    {lot}
                </option>

            )} 

        </select>

        <button className="occupy-lot__submit">Entry</button>
    </form>

    {error && <Feedback message={error} level="error" />}
    
    </section>
}