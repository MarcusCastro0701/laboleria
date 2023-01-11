import { connectionDB } from "../database/db.js";
import joi from "joi";

const clientSchema = joi.object({
    name: joi.string().required().min(1),
    adress: joi.string().required().min(1),
    phone: joi.string().min(10).max(11)
});

export async function postClient(req, res) {

    const client = req.body;

    const { error } = clientSchema.validate(client, { abortEarly: false });
    if (error) {
        const errors = error.details.map((details) => details.message);
        console.log(errors, "postSchema inválido em postClient");
        res.status(400).send(errors);
        return
    }

    const verificaCliente = await connectionDB.query('SELECT * FROM clients WHERE name=$1 AND adress=$2 AND phone=$3;', [client.name, client.adress, client.phone])
    if((verificaCliente).rows.length !== 0){
        console.log("ja existe um cliente com estes mesmos dados")
        res.sendStatus(401);
        return
    }


    try {

        await connectionDB.query('INSERT INTO clients (name, adress, phone) VALUES ($1, $2, $3);', [client.name, client.adress, client.phone]);
        console.log("cliente inserido")
        res.sendStatus(201);
        return

    } catch (error) {
        console.log(error, "erro no try/catch de postClient");
        res.sendStatus(500);
        return
    }

}