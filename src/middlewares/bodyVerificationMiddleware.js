export function bodyVerification(req, res, next){
    const body = req.body;
    if(!body){
        res.sendStatus(400)
        return
    }

    next()
}