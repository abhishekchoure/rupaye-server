export const userCookieCheck = (req, res, next) => {
    const userCookie = req.cookies.user
    if(userCookie === undefined){
        res.status(401).send()
        return;
    }
    next();
}