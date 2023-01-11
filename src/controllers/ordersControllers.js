import { connectionDB } from "../database/db.js";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import dayjs from 'dayjs'

dayjs.extend(customParseFormat);


export async function postOrder(req, res){

    let today = dayjs().locale('pt-br').format('YYYY-MM-DD');
    const { clientId, cakeId, quantity } = req.body;

    const verificaCake = await connectionDB.query('SELECT * FROM cakes WHERE id=$1;', [cakeId]);
    const verificaClient = await connectionDB.query('SELECT * FROM clients WHERE id=$1;', [clientId]);

    if((verificaCake.rows.length === 0) || (verificaClient.rows.length === 0)){
        console.log("bolo ou cliente não encontrado");
        res.sendStatus(404);
        return;
    }

    
    if((quantity < 0) || (quantity > 5)){
        console.log("numero da quantidade é inválido");
        res.sendStatus(400);
        return
    }

    if(Number.isInteger(quantity) === false){
        console.log("numero da quantidade é inválido");
        res.sendStatus(400);
        return
    }

    try {
        await connectionDB.query('INSERT INTO orders ("clientId", "cakeId", quantity, "createdAt") VALUES ($1, $2, $3, $4);', [clientId, cakeId, quantity, today]);
        console.log("ordem inserida");
        res.sendStatus(201);
        return
    } catch (error) {
        console.log(error, "erro no try/catch de postOrder");
        res.sendStatus(500);
        return
    }

}

export async function getOrders(req, res){

    let arrOrders = [];
    const { date } = req.query;


    try {
        console.log(date)
        if (date) {
            const ordersByDate = await connectionDB.query('SELECT * FROM orders WHERE "createdAt"=$1;', [date]);
            console.log(ordersByDate.rows.length, ordersByDate.rows)
            if (ordersByDate.rows.length === 0) {
                console.log("caiu aqui")
                res.status(404).send([]);
                return
            }

            
            for (let c = 0; c < ordersByDate.rows.length; c++) {
                
                const client = await connectionDB.query('SELECT * FROM clients WHERE id=$1;', [ordersByDate.rows[c].clientId]);
                const cake = await connectionDB.query('SELECT * FROM cakes WHERE id=$1;', [ordersByDate.rows[c].cakeId]);

                const newBody = {
                    client: {
                        id: client.rows[0].id,
                        name: client.rows[0].name,
                        adress: client.rows[0].adress,
                        phone: client.rows[0].phone
                    },
                    cake: {
                        id: cake.rows[0].id,
                        name: cake.rows[0].name,
                        price: cake.rows[0].price,
                        description: cake.rows[0].description,
                        image: cake.rows[0].image
                    },
                    orderId: ordersByDate.rows[c].id,
                    createdAt: ordersByDate.rows[c].createdAt,
                    quantity: ordersByDate.rows[c].quantity
                }

                arrOrders.push(newBody);
                console.log(arrOrders, "arrOrders", newBody, "newBody")

                if (c === (ordersByDate.rows.length - 1)) {
                    console.log("getOrders finalizado (com date)");
                    res.send(arrOrders).status(200);
                    return
                }


            }


        }



        const orders = await connectionDB.query('SELECT * FROM orders;');
        if (orders.rows.length === 0) {
            res.status(404).send([]);
            return;
        }

        for(let c = 0; c < orders.rows.length; c++){

            const client = await connectionDB.query('SELECT * FROM clients WHERE id=$1;', [orders.rows[c].clientId]);
            const cake = await connectionDB.query('SELECT * FROM cakes WHERE id=$1;', [orders.rows[c].cakeId]);

            const newBody = {
                client: {
                    id: client.rows[0].id,
                    name: client.rows[0].name,
                    adress: client.rows[0].adress,
                    phone: client.rows[0].phone
                },
                cake: {
                    id: cake.rows[0].id,
                    name: cake.rows[0].name,
                    price: cake.rows[0].price,
                    description: cake.rows[0].description,
                    image: cake.rows[0].image
                },
                orderId: orders.rows[c].id,
                createdAt: orders.rows[c].createdAt,
                quantity: orders.rows[c].quantity
            }

            arrOrders.push(newBody);
            console.log(arrOrders, "arrOrders", newBody, "newBody")

            if(c === (orders.rows.length -1)){
                console.log("getOrders finalizado");
                res.send(arrOrders).status(200);
                return
            }


        }


    } catch (error) {
        console.log(error, "erro no try/catch de getOrders");
        res.sendStatus(500);
        return
    }

}

export async function getOrdersById(req, res){

    let arrOrders = [];
    const { id } = req.params;

    const verificaCliente = await connectionDB.query('SELECT * FROM clients WHERE id=$1;', [id]);
    if(verificaCliente.rows.length === 0){
        console.log("este usuario nao foi encontrado");
        res.sendStatus(404);
        return
    }

    try {
        
        const orders = await connectionDB.query('SELECT * FROM orders WHERE "clientId"=$1;', [id]);
        if (orders.rows.length === 0) {
            res.send("este cliente nao tem nenhum pedido").status(404);
            return;
        }

        for(let c = 0; c < orders.rows.length; c++){

            const client = await connectionDB.query('SELECT * FROM clients WHERE id=$1;', [orders.rows[c].clientId]);
            const cake = await connectionDB.query('SELECT * FROM cakes WHERE id=$1;', [orders.rows[c].cakeId]);

            const newBody = {
                client: {
                    id: client.rows[0].id,
                    name: client.rows[0].name,
                    adress: client.rows[0].adress,
                    phone: client.rows[0].phone
                },
                cake: {
                    id: cake.rows[0].id,
                    name: cake.rows[0].name,
                    price: cake.rows[0].price,
                    description: cake.rows[0].description,
                    image: cake.rows[0].image
                },
                orderId: orders.rows[c].id,
                createdAt: orders.rows[c].createdAt,
                quantity: orders.rows[c].quantity
            }

            arrOrders.push(newBody);
            console.log(arrOrders, "arrOrders", newBody, "newBody")

            if(c === (orders.rows.length -1)){
                console.log("getOrders finalizado");
                res.send(arrOrders).status(200);
                return
            }


        }

    } catch (error) {
        
        console.log(error, "erro no try/catch de getOrdersById");
        res.sendStatus(500);
        return

    }

}

export async function getClientAndOrders(req, res){

    const { id } = req.params;

    const verificaCliente = await connectionDB.query('SELECT * FROM clients WHERE id=$1;', [id]);
    if(verificaCliente.rows.length === 0){
        console.log("este usuario nao foi encontrado");
        res.sendStatus(404);
        return
    }

    try {

        const join = await connectionDB.query(`
            SELECT orders.id as "orderId", orders.quantity, orders."createdAt", cakes.price*orders.quantity 
            as "totalPrice", cakes.name as cakeName 
            FROM orders
            JOIN cakes ON orders."cakeId"=cakes.id
            WHERE orders."clientId" = $1;
        `, [id])
        res.send(join.rows).status(200);
        return;

    } catch (error) {
        console.log(error, "erro no try/catch de getClientAndOrders");
        res.sendStatus(500)
        return
    }

}
