import ApiResponse from "../utils/ApiResponse.js";

async function handelUserAuthorization(req, res , next) {
    try {

        const role = req.user.role;

        if (role != "seller") {
            res.status(401).json(
                new ApiResponse( 401 , {} ,"Access denied. Only seller can access this route.")
            )
        }

        next()
    }
    catch (error) {
        res.status(500).json(
            new ApiResponse( 500 , {} , "Something went wrong")
        )
    }
}

export default handelUserAuthorization