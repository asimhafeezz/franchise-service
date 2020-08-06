const mongoose = require('mongoose')

const franchiseSchema = new mongoose.Schema({
    franchiseName: String,
    franchiseAltitude: String,
    franchiseImagePath: String,
    franchiseLatitude: String,
    franchiseDescription: String,
    })

const Franchise = mongoose.model('franchise', franchiseSchema)

module.exports.FranchiseSchema = franchiseSchema 
module.exports.Franchise = Franchise 