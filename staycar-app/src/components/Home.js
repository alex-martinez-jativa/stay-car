import React, {useState, useEffect} from 'react'
import { withRouter} from 'react-router-dom'
import './style/Home.sass'
import { Header, Feedback } from '.'
import retrieveParking from '../logic/retrieve-parking'
import { ReactComponent as Access } from '../img/access.svg'
import { ReactComponent as Exit } from '../img/exit.svg'
import { ReactComponent as AtmIcon } from '../img/atm.svg'
import { ReactComponent as Plates } from '../img/plates.svg'
import { ReactComponent as Report } from '../img/report.svg'
import { ReactComponent as Config } from '../img/config.svg'
import { isLoggedIn } from '../logic'


export default withRouter (function({history}) {

    const [state, setState] = useState('free')

    const [err, setErr] = useState()

    function __handleError__(error) {
      
        setErr(error.message)
    }
    
    const handleGoToEntrance = () => {
        history.push('/entrance')
    }

    const handleToConfig = () => {
        history.push('/config')
    }


    const handleToMap = () => {
        history.push('/map')
    }

    const handleToATM = () => {
        history.push('/atm')
    }

    const handleGoToExit = () => {
        history.push('/exit-vehicle')
    }

    const handleGoToReport = () => {
        history.push('/report')
    }

    async function handleParkingFull() {
        try{
            const pk = await retrieveParking()
            if(pk.length === 0){
                history.push('/create-parking')
            }

            if(pk[0].totalLots === pk[0].occupiedLots){
                setState('fully')
            }
            
        }catch(error){  
            __handleError__(error)
        }
    }

    useEffect(() => {
      handleParkingFull()
    },[state])

    return <>
    <Header user={isLoggedIn() ? 'Login' : ''}/>
    <main>
        
        <section className="actions actions--first">

            <div className={state === 'free' ? "actions__action" : "actions__full"} onClick={ state === 'free' ? handleGoToEntrance : ''}>
            
                <Access className="actions__image" />
                <p className="actions__text">{state === 'free' ? 'Acces' : 'Parking full' }</p>
            </div>

            <div className="actions__action" onClick={handleGoToExit}>
                
                <Exit className="actions__image"/>
                <p className="actions__text">Exit</p>
            </div>

            <div className="actions__action" onClick={handleToATM}>
                
                <AtmIcon className="actions__image"/>
                <p className="actions__text">ATM</p>
            </div>

        </section>

        <section className="actions actions--second">
            
            <div className="actions__action" onClick={handleToMap}>
                
                <Plates className="actions__image"/>
                <p className="actions__text">Map</p>
            </div>
               
            <div className="actions__action" onClick={handleGoToReport}>
                
                <Report className="actions__image"/>
                <p className="actions__text">Report</p>
            </div>

            <div className="actions__action" onClick={handleToConfig}>
                
                <Config className="actions__image"/>
                <p className="actions__text">Config</p>
            </div>
                
        </section>

        {err && <Feedback message={err} level="info" />}

    </main>
    </>
})