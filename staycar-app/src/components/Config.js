import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import {Header} from '.'
import { isLoggedIn, retrieveParking } from '../logic'
import './style/Config.sass'
import { ReactComponent as Add } from '../img/add.svg'
import { ReactComponent as User } from '../img/user.svg'
import { ReactComponent as Ticket} from '../img/recibo.svg'

export default withRouter (function({history}) {

    const [parking, setParking] = useState([])

    const handleRetrieveParking = async() => {
        try{
            const res = await retrieveParking()
            if(res){
                setParking(res)
            }else{
                setParking(undefined)
            }
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        handleRetrieveParking()
    })
    
    const handleToCreateParking = () => {
        history.push('/create-parking')
    }

    const handleToCreateUser = () => {
        history.push('/create-user')
    }

    const handleToModifyParking = () => {
        history.push('/modify-parking')
    }

    const handleToRecoverTicket = () => {
        history.push('/recover-ticket')
    }

    return <> 
        <Header user={isLoggedIn() ? 'Login' : 'Logout'}/>
        <section class="config">
            <div class="config__action" onClick={parking.length === 0 ? handleToCreateParking : handleToModifyParking }>
                <Add className="config__image"/>
                <p class="config__text">Manage parking</p>
            </div>
            <div class="config__action" onClick={handleToCreateUser}>
                <User className="config__image"/>
                <p class="config__text">Manage User</p>
            </div>
            <div class="config__action" onClick={handleToRecoverTicket}>
                <Ticket className="config__image"/>
                <p class="config__text">Recover ticket</p>
            </div>
        </section>
    </>
})