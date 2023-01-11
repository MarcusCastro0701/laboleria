import { connectionDB } from "../database/db.js";
import joi from "joi";

const cakeSchema = joi.object({
    name: joi.string().required().min(2),
    price: joi.number().required().min(0.0001),
    image: joi.string().uri().required(),
    description: joi.string()
});

//image tem que ter http:// no link

export async function postCake(req, res){

    const body = req.body;

    const { error } = cakeSchema.validate(body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((details) => details.message);
        console.log(errors, "postSchema inválido");
        res.status(401).send(errors);
        return
    }

    const verificaNome = await connectionDB.query('SELECT * FROM cakes WHERE name=$1;', [body.name]);
    if(verificaNome.rows.length !== 0){
        console.log("ja tem um bolo com este nome")
        res.sendStatus(409);
        return
    }

    try {
        
        await connectionDB.query('INSERT INTO cakes (name, price, image, description) VALUES ($1, $2, $3, $4);', [body.name, body.price, body.image, body.description]);
        console.log("bolo inserido");
        res.sendStatus(201);
        return

    } catch (error) {
        
        console.log(error, "erro no try/catch de postCake");
        res.sendStatus(500);
        return

    }
}