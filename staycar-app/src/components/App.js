import React, { useEffect, useContext, useState } from 'react';
import { isLoggedIn, login, entryVehicle, createParking, retrieveTicket, registerUser, exitVehicle, modifyParking, deleteParking, deleteUser, logout, recoverTicket } from '../logic'
import { Context } from './ContextProvider'

import './style/App.sass'

import { Home, Login, EntryVehicle, Config, CreateParking, Atm, Map, CreateUser, ExitVehicle, Report, ModifyParking, DeleteParking, DeleteUser, RecoverTicket } from '.'

import { Route, withRouter, Redirect } from 'react-router-dom'


export default withRouter(function ({ history }) {

  const [state, setState] = useContext(Context)

  const [dataTicket, setDataTicket ] = useState()
  const [ticket, setTicket ] = useState() 

  function __handleError__(error) {
      
      setState({...state, error: error.message })

      setTimeout(() => {
        setState({ error: undefined })
      }, 3000)
  }

  function __handleErrorRedirect__(error) {
      
    setState({...state, error: error.message })

    setTimeout(() => {
      setState({ error: undefined })
      history.push('/home')
    }, 4000)
}

  useEffect(() => {
    if (isLoggedIn()) {

        history.push('/home')
  
    } else {
    
      history.push('/login')
    }
  }, [])



  async function handleLogin(username, password) {
    try {
      await login(username, password)

      history.push('/home')
      
    } catch (error) {

      
       __handleError__(error)
       history.push('/login')
    }
  }


  async function handleCreateParking(parkingName, rate, totalLots){
    
    try{
     
      await createParking(parkingName, rate, totalLots)
      
      history.push('/home')
    
    }catch(error){
      
      return __handleError__(error)
    }
  }

  async function handleModifyParking(parkingName, rate, totalLots){
    try{
      await modifyParking(parkingName, rate, totalLots)
      history.push('/home')
    }catch(error){
      __handleError__(error)
    }
  }

  async function handleDeleteParking(parkingName) {
    try{
      await deleteParking(parkingName)
      history.push('/home')
    }catch(error){
      __handleError__(error)
    }
  }

  async function handleEntryVehicle(carPlate, ticketId) {
    try {
      await entryVehicle(carPlate, ticketId)
      setDataTicket(undefined)
  
    
    }catch(error) {
      return __handleErrorRedirect__(error)

    }
  }

  async function handleAtm(ticketId) {
    try{
      const infoTicket = await retrieveTicket(ticketId)
      if(infoTicket.validated) throw new Error('ticket not valid')
      setDataTicket(infoTicket)

    }catch(error){
      return __handleError__(error)
    }
  }

  async function handleCreateUser(name, surname, username, password) {
    try{
      await registerUser(name, surname, username, password)
      history.push('/home')

    }catch(error) {
      __handleError__(error)
    }
  }

  async function handleDeleteUser(userName, password) {
    try{
      await deleteUser(userName, password)
      logout()
      history.push('/login')
    }catch(error){
      __handleError__(error)
    }
  }

  async function handleExitVehicle(ticketId) {
    try{
      await exitVehicle(ticketId)
      setDataTicket(undefined)
      history.push('/home')
      
    }catch(error){
      setDataTicket(undefined)
      __handleError__(error)
    }
  }

  async function handleRecoverTicket(carPlate) {
    try{
      debugger
      const recover = await recoverTicket(carPlate)
      setTicket(recover)
    }catch(error){
      __handleError__(error)
    }
  }

  
  const { error } = state
  
  return <div className="app">
    <Route exact path="/" render={() => isLoggedIn() ? <Redirect to="/home"/> : <Redirect to="/login"/>}/>
    <Route path="/login" render={() => isLoggedIn() ? <Redirect to="/home"/> : <Login onSubmit={handleLogin} error={error} /> }/>
    <Route path="/home" render={() => isLoggedIn() ? <Home /> : <Redirect to="/login" />}/>
    <Route path="/entrance" render={() => isLoggedIn() ? <> <Home error={error} /> <EntryVehicle onSubmit={handleEntryVehicle} error={error}/> </> : <Redirect to="/login"/>} />
    <Route path="/config" render={() => isLoggedIn() ? <Config /> : <Redirect to="/login" /> } />
    <Route path="/create-parking" render={() => isLoggedIn() ? <> <Config /> <CreateParking onSubmit={handleCreateParking} error={error} /> </> : <Redirect to="/login" />}/>
    <Route path="/modify-parking" render={() => isLoggedIn() ? <> <Config /> <ModifyParking onSubmit={handleModifyParking} error={error}/> </> : <Redirect to="/login" />}/>
    <Route path="/delete-parking" render={() => isLoggedIn() ? <> <Config /> <DeleteParking onSubmit={handleDeleteParking} error={error}/> </> : <Redirect to="/login" />} />
    <Route path="/delete-user" render={() => isLoggedIn() ? <> <Config /> <DeleteUser onSubmit={handleDeleteUser} error={error}/> </> : <Redirect to="/login" />} />
    <Route path="/atm" render={() => isLoggedIn() ? <> <Home /> <Atm onSubmit={handleAtm} infoTicket={dataTicket} error={error}/> </> : <Redirect to="/login"/>} />
    <Route path="/map" render= {() => isLoggedIn() ? <> <Home/> <Map error={error}/> </> : <Redirect to="/login" />}/>
    <Route path="/create-user" render={() => isLoggedIn() ? <> <Config /> <CreateUser onSubmit={handleCreateUser} error={error} /> </> : <Redirect to="/login" />}/>
    <Route path="/exit-vehicle" render={() => isLoggedIn() ? <> <Home /> <ExitVehicle onSubmit={handleExitVehicle} error={error} /> </> : <Redirect to="/login" />}/>
    <Route path="/report" render={() => isLoggedIn() ? <> <Home /> <Report /> </> : <Redirect to="/login" />}/>
    <Route path="/recover-ticket" render={() => isLoggedIn() ? <> <Config /> <RecoverTicket onSubmit={handleRecoverTicket} ticket={ticket} error={error}/> </> : <Redirect to="/login" />} />
    </div>

})

