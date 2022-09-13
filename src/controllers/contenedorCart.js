const mongoose = require('mongoose');

const models = require('../models/schemaCart.js');

const contenedorProd = require('./contenedorProd.js');

const moment = require('moment');

mongoose.connect('mongodb+srv://ValentinVicente:kpoctmaster470@cluster0.4hxnz.mongodb.net/Cluster0?retryWrites=true&w=majority')

class Contenedor {
    constructor() {
        this.coleccion = models
    }

    async getAllCarritos(){
        try{

            const objs = await this.coleccion.find();
            return objs;

        }
        catch(err){
            console.log(`${err} Error en la funcion getAllCarritos`);
        }
    }
    
    async getCarritoByID(user){
        try{

            const obj = await this.coleccion.find({id: user},{_id:0, __v:0});
            return obj;

        }
        catch(err){
            console.log(`${err} Error en la funcion getCarritoByID`)
        }
    }

    async crearCarrito(user){
        try{

            const newCarrito ={
                id: user,
                productos:'',
            }

            const add = await this.coleccion.insertMany(newCarrito)
           
            const objs2 = await this.getAllCarritos();
            const carritonuevoID = objs2[objs2.length -1].id;
            console.log(`Carrito ${carritonuevoID} creado exitosamente`);

            return add;

        }
        catch(err){
            console.log(`${err} Error en la funcion crearCarrito`);
        }
    }

    // async deleteCarritoByID(num){
    //     try{

    //         const deleted = await this.coleccion.findOneAndDelete({id:num});
    //         return deleted; 

    //     }
    //     catch(err){
    //         console.log(`${err} Error en la funcion deleteCarritoByID`)
    //     }
    // }

    async prodAlCarrito(id_carrito, id_prod){
        try{
            const arrProducts = await this.getProdsDeUnCarrito(id_carrito)
            const jsonStr = JSON.stringify(arrProducts, null, 2)
            const str = jsonStr.substring(1,jsonStr.length - 1)
            const nose = JSON.parse(str)
            const prod = nose.productos
            console.log(prod)

            if (prod.length > 0) {
                const producto = await contenedorProd.getProdById(id_prod);
                const prodStr = JSON.stringify(producto)
                const str = prodStr.substring(1, prodStr.length - 1)
                const newArray = []
                newArray.push(prod,str)
                const agregado = await this.coleccion.updateOne( {id: id_carrito},{$set: {productos:`${newArray}`}} );
                return agregado;
            } else {
                const producto = await contenedorProd.getProdById(id_prod);
                const stringProd = JSON.stringify(producto)
                const str = stringProd.substring(1, stringProd.length - 1)
                const agregado = await this.coleccion.updateOne( {id: id_carrito},{$set: {productos:str}} );
                return agregado;
            }
        }
        catch(err){
            console.log(`${err} Error en la funcion prodAlCarrito`)
        }
    }

    async deleteProdDeCarrito(id_carrito, id_prod){
        try{

            const producto = await contenedorProd.getProdById(id_prod);

            const string = JSON.stringify(producto);
            
            const hecho = await this.coleccion.updateOne( {id_carrito}, {$pull: {productos: string} } );
            return hecho;
        }
        catch(err){
            console.log(`${err} Error en la funcion deleteProdDeCarrito`)
        }
    }

    async getProdsDeUnCarrito(id) {
        try{
            const elemento = await this.coleccion.find({id: id}, {_id:0, productos: 1})
            return elemento 
        }
        catch(err){
            return err;
        }
    }


};

const Cart = new Contenedor();

module.exports = Cart;