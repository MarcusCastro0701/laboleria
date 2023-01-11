export function queryVerification(req, res, next){
    const query = req.query;
    if(!query){
        res.sendStatus(400)
        return
    }

    next()
}