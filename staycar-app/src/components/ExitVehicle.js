import React, {useState} from 'react'
import './style/ExitVehicle.sass'
import QrReader from 'react-qr-reader'
import { Feedback } from '.'


export default function({onSubmit ,error}) {

    const [result, setResult] = useState()

    const handleScan = data => {
      if (data) {
        setResult(data)
      }
    }
    
    const handleError = err => {
      console.error(err)
    }

    const handleExitVehicle = (event) => {
      event.preventDefault()
      
      const { target: {
        ticketId: {value: ticketId}
      } } = event

      onSubmit(ticketId)

    }

    return <section className="exit-plate">
    <h1 className="exit-plate__title">Exit: </h1>
    <form action="" method="" className="exit-plate__form" onSubmit={handleExitVehicle}>
        <input type="text" placeholder="ticket id" className="exit-plate__input" name="ticketId" value={result} />
        <button className="exit-plate__submit">Exit</button>
    </form>

    {error && <Feedback message={error} level="error"/>}

    <QrReader
      className="qr"
        delay={300}
        onError={handleError}
        onScan={handleScan}
      />
</section>
}