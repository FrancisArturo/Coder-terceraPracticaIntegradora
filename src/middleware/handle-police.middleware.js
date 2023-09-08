import passport from "passport";

function handlePolicies(policies) {
    return (req, res, next) => {
        if (policies.length === 1 && policies[0] === "public") {
            return next();
        }

        passport.authenticate("jwt", {session: false}, (err, userJWT, info) => {
            //console.log(userJWT)
            if (err) {
                return next(err);
            }
            if (!userJWT) {
                return res.status(401).send({message: "denied access, invalid token"});
            }
            if (policies.includes(userJWT.user.role)) {
                req.user = userJWT;
                return next()
            } else {
                return res.status(403).send({message: "Unauthorized access"})
            }

        })(req, res, next);
    };
}

export default handlePolicies