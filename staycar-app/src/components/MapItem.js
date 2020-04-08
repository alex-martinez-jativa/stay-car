import React from 'react'
import { ReactComponent as Car } from '../img/car.svg'

export default ({lot}) => {

    return <div className={`plates__plate--${lot.status}`}>
        <Car className="plates__car"/>
        <p className="plates__text">Plate Number: <span className="plates__number">{lot.number}</span></p>
    </div>
}