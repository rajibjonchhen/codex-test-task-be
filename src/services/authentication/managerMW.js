import createHttpError  from "http-errors"

export const managerMW = async(req, res, next) => {
    if(req.user.role === "manager") {
        next()
    } else {
        next(createHttpError(401, "not authorised"))
    }
}