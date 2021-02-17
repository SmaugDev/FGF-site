const  db  = require("../../models/db");
const errors = require('../requests-errors')

let Request = class Request{

    static getMemberRequests(userId){
        return new Promise((resolve,reject) => {
            if(!userId) reject(errors.missing.userId)
            db.query("SELECT * FROM staff WHERE user_id = ?",[userId],(err,resultStaff) =>{
                if(err) reject(new Error(err.message))
                else {
                    db.query("SELECT * FROM partenaires WHERE user_id = ?",[userId],(err,resultPartner) =>{
                        if(err) reject(new Error(err.message))
                        else resolve({jobs : resultStaff, partners : resultPartner})
                    })
                }
            })
        })
    }
    static getGenerals(userPermissions,page){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!page) reject(errors.missing.page)
            if(userPermissions < 3) reject(errors.badPermissions)
            const skip = (page * 10) -10;
            db.query("SELECT * FROM demandes LIMIT 10 OFFSET ?",[skip],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getJobs(userPermissions,page){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!page) reject(errors.missing.page)
            if(userPermissions < 3) reject(errors.badPermissions)
            const skip = (page * 10) -10;
            db.query("SELECT * FROM staff LIMIT 10 OFFSET ?",[skip],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getPartners(userPermissions,page){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!page) reject(errors.missing.page)
            if(userPermissions < 3) reject(errors.badPermissions)
            const skip = (page * 10) -10;
            db.query("SELECT * FROM partenaires LIMIT 10 OFFSET ?",[skip],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getGeneral(userPermissions,requestId){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!requestId) reject(errors.missing.authorId)
            if(userPermissions < 3) reject(errors.badPermissions)
            db.query("SELECT * FROM demandes WHERE id = ?",[requestId],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getJob(userPermissions,requestId){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!requestId) reject(errors.missing.requestId)
            if(userPermissions < 3) reject(errors.badPermissions)
            db.query("SELECT * FROM staff WHERE id = ?",[requestId],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static getPartner(userPermissions,requestId){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!requestId) reject(errors.missing.requestId)
            if(userPermissions < 3) reject(errors.badPermissions)
            db.query("SELECT * FROM partenaires WHERE id = ?",[requestId],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

    static postGeneral(name,email,message){
        return new Promise((resolve,reject) => {
            if(!name) reject(errors.missing.pseudo)
            if(!email) reject(errors.missing.email)
            if(!message) reject(errors.missing.q1)
            const time = Date.now()
            db.query("INSERT INTO demandes (`pseudo`, `mail`, `demande`, `statut`, `date_insert`) VALUES (?,?,?,?,?)",[name,email,message,0,time],(err,result) => {
                if(err) reject(err.message)
                else resolve(true)
            })
        })
    }
    static postPartner(pseudo,email,age,q1,q2,q3,q4,q5,q6,authorId){
        return new Promise((resolve,reject) => {
            if(!pseudo) reject(errors.missing.pseudo)
            if(!email) reject(errors.missing.email)
            if(!age) reject(errors.missing.age)
            if(!q1) reject(errors.missing.q1)
            if(!q2) reject(errors.missing.q2)
            if(!q3) reject(errors.missing.q3)
            if(!q4) reject(errors.missing.q4)
            if(!q5) reject(errors.missing.q5)
            if(!q6) reject(errors.missing.q6)
            if(!authorId) reject(errors.missing.authorId)
            const time = Date.now()
            db.query("INSERT INTO `partenaires`(`user_id`,`pseudo`, `mail`, `majeur`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `statut`, `date_insert`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",[authorId,pseudo,email,age,q1,q2,q3,q4,q5,q6,0,time],(err,result) => {
                if(err) reject(err.message)
                else resolve(true)
            })
        })
    }
    static postJob(q1,q2,q3,q4,q5,q6,authorId){
        return new Promise((resolve,reject) => {
            if(!q1) reject(errors.missing.q1)
            if(!q2) reject(errors.missing.q2)
            if(!q3) reject(errors.missing.q3)
            if(!q4) reject(errors.missing.q4)
            if(!q5) reject(errors.missing.q5)
            if(!q6) reject(errors.missing.q6)
            if(!authorId) reject(errors.missing.authorId)
            const time = Date.now()
            db.query("INSERT INTO `staff`(`user_id`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `statut`, `date_insert`) VALUES (?,?,?,?,?,?,?,?,?)",[authorId,q1,q2,q3,q4,q5,q6,0,time],(err,result) => {
                if(err) reject(err.message)
                else resolve(true)
            })
        })

    }
    static updateGeneral(userPermissions,requestId,statut){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!requestId) reject(errors.missing.authorId)
            if(userPermissions < 3) reject(errors.badPermissions)
            db.query("UPDATE demandes SET statut = ? WHERE id = ?",[statut,requestId],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static updateJob(userPermissions,requestId,statut){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!requestId) reject(errors.missing.authorId)
            if(userPermissions < 3) reject(errors.badPermissions)
            db.query("UPDATE staff SET statut = ? WHERE id = ?",[statut,requestId],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }
    static updatePartner(userPermissions,requestId,statut){
        return new Promise((resolve,reject) => {
            if(!userPermissions) reject(errors.badPermissions)
            if(!requestId) reject(errors.missing.authorId)
            if(userPermissions < 3) reject(errors.badPermissions)
            db.query("UPDATE partenaires SET statut = ? WHERE id = ?",[statut,requestId],(err,result) =>{
                if(err) reject(new Error(err.message))
                else resolve(result)
            })
        })
    }

}


module.exports = Request
