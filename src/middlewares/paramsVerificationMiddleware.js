export function paramsVerification(req, res, next){
    const params = req.params;
    if(!params){
        res.sendStatus(400)
        return
    }

    next()
}