const verifyRole = (role) => {
    return (req, res, next) => {

        if (req.user.role !== role) {


            return res.status(403).json({ message: "Access denied .You do not have required permission" });
        }
        next();
    }
}

module.exports = verifyRole;