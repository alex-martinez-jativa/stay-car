import React, { useState, useEffect } from 'react';
import './style/Map.sass'
import {retrieveLots} from '../logic'
import { MapItem, Feedback } from '.'

export default function() {
    const [lots, setLots] = useState([])
    const [err, setErr] = useState()

    function __handleError__(error) {
      
        setErr(error.message)
    }
    
    useEffect(() => {

        const interval = setInterval(() => {

            (async() => {
                try{
                    const lots = await retrieveLots()
                    setLots(lots)
                }catch(error){
                    __handleError__(error)
                    
                }
            })()

            return () => clearInterval(interval)
            
        }, 1000);

    },[setLots])


    return <section className="map">
        <h1 className="map__title">Plates Map:</h1>
        <section className="plates">

            {lots.map(lot => <MapItem key={lot.id} lot={lot} />)}

            {err && <Feedback message={err} level="info" />}
            
        </section>
    </section>

    
}
