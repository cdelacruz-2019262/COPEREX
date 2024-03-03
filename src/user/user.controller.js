'use strict'

import User from './user.model.js'
import {
    encrypt,
    checkPassword,
    checkUserUpdate
} from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'


//probar la funcionalidad
export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

//registrar usuario
export const register = async (req, res) => {
    try {
        let data = req.body
        let exist = await User.findOne({
            $or: [
                {user: data.username},
                {email: data.email}
            ]
        })
        if(exist) return res.send({ message: 'username or email is repeat'})
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

//login del usuario
export const login = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let user = await User.findOne({
            //un or para elegir entre uno u otro
            $or: [
                { username },
                { email }
            ]
        })
        //Verifico que la contraseña coincida
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                email: user.email,
                name: user.name
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`,
                    loggedUser,
                    token
                }
            )
        }

        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const update = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUserUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not updated'})
        //Respondo al usuario
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

//borrar usuario
export const erase = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedUser = await User.findOneAndDelete({_id: id}) 
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`}) //status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

