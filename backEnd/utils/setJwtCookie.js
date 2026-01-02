import jwt from "jsonwebtoken";

async function setJwtTokenCookie(res, user) {
    try {

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,

            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,     
            sameSite: "lax",   
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log("cookie Set sucesfully")
    }
    catch (error) {
        console.log("Error Occred in setting Cookie ", error)
    }
}

export default setJwtTokenCookie