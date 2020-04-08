module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    entryVehicle: require('./entry-vehicle'),
    createParking: require('./create-parking'),
    generateQr: require('./generate-qr'),
    retrieveParking: require('./retrieve-parking'),
    retrieveTicket: require('./retrieve-ticket'),
    validateTicket: require('./validate-ticket'),
    exitVehicle: require('./exit-vehicle'),
    deleteParking: require('./delete-parking'),
    deleteUser: require('./delete-user'),
    retrieveTickets: require('./retrieve-tickets'),
    updateParking: require('./update-parking'),
    ocuppyParkingLot: require('./occupy-parking-lot'),
    freeParkingLot: require('./free-parking-lot'),
    recoverTicket: require('./recover-ticket')
}