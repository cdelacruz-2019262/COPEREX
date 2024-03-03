'use strict'

import { Schema, model } from "mongoose";

const companySchema = Schema({
    name: {
        type: String,
        unique: true,  
        required: true
    },
    impactLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGHT'],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    //debido a que los años de trayectoria, pueden cambiar conforme pase el tiempo 
    //es mas efectivo poner una fecha gracias a que esta no deberia cambiar por culpa 
    //del tiempo
    inauguration: {
        type: Date,
        required:true
    },
    category: {
        type: String,
        required: true
    }
})

export default model('company', companySchema)