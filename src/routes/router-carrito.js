const express = require('express');
const { Router } = express;
const Ruta2 = new Router;

const contenedorCart = require('../controllers/contenedorCart.js');

//ENDPOINTS------------------------------------------------------


// Ruta2.get('/:id/productos', async(req, res) =>{
//     try{
//         res.send( await contenedorCart.getCarritoProds(req.params.id))
//     }
//     catch(err){

//     }
// })

// Ruta2.get('/:id?', async(req, res) =>{
//     try{
//         if(req.params.id){
//             res.send(await contenedorCart.getCarritoByID(parseInt(req.params.id)));
//         }
//         else{
//             res.send(await contenedorCart.getAllCarritos())
    
//         }
//     }
//     catch(err){

//     }
// })


Ruta2.get('/', async (req, res) => {
    try{
    const user = req.user.user
    const email = req.user.email
    const datos = { user, email }
    const prodsdelcarrito = await contenedorCart.getProdsDeUnCarrito(user)
    const stringify = JSON.stringify(prodsdelcarrito, null, 2)
    const str = stringify.substring(1,stringify.length -1)

    const nose = JSON.parse(str, null, 2)
    const cart = nose.productos
    const objetos = JSON.parse('[' + cart + ']')

    console.log(objetos)
    res.render('carrito', {datos, objetos})  
    }
    catch(err){
        res.redirect('/login')
        // res.send(err)
    }
    
})

Ruta2.post('/:id/productos/:id_prod', async(req, res) =>{
    try{
        await contenedorCart.prodAlCarrito(req.params.id, req.params.id_prod);
        res.send(`Producto ${req.params.id_prod} agregado al carrito ${req.params.id}`)
    }
    catch(err){
        res.send(`${err} Error en el routerCarrito post-producto-al-carrito`)
    }
})

Ruta2.delete('delete/:id/productos/:id_prod', async(req, res) =>{
    try{
        await contenedorCart.deleteProdDeCarrito(req.params.id, req.params.id_prod);
        res.send(`Producto ${req.params.id_prod} borrado del carrito ${req.params.id} correctamente`)
    }
    catch(err){
        res.send(`${err} Error en el routerCarrito delete-prod-del-carrito`)
    }
})

module.exports = Ruta2;