import React, {useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import './style/Login.sass'
import Feedback from './Feedback'
import parking from '../img/pk-parking.png'

export default withRouter (function ({ onSubmit, error, history }) {
  
    function handleSubmit(event) {
        event.preventDefault()
        
        const { target: {
            username: { value: username },
            password: { value: password }
        } } = event

        onSubmit(username, password)
    }

    const handleToHome = () => {
        history.push('/home')
    }

    

    return <section className="login">
    <div className="login__head">
        <img src={parking} className="login__icon" alt="" onClick={handleToHome}/>
        <h1 className="login__title">StayCar Login:</h1>
    </div>
    <form className="login__form" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="username" className="login__input" />
        <input type="password" name="password" placeholder="password" className="login__input" />
        <button className="login__submit">Login</button>
    </form>
    
    {error && <Feedback message={error} level="error" />}
</section>
})