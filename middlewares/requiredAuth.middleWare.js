import { authService } from "../services/auth.service.js"

export function requiredAuth(req, res, next) {
    // Get the encrypted loginToken cookie from incoming request
    const { loginToken } = req.cookies
    // Decrypt and parse the token using validateToken func
    // If the token is valid, loggedinUser will be actual user object id/fullname/isAdmin
    // If invalid token it will be null
    const loggedinUser = authService.validateToken(loginToken)

    // If user is not authorized (null), respond with a 401 Unathorized and stop the flow
    if (!loggedinUser) return res.status(401).send('Not Authenticated!')

    // If token is valid, we attach the decoded user to req
    req.loggedinUser = loggedinUser
    next()
}