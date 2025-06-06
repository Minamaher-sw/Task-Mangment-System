const authorize = (roles = []) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

        if (!user || !user.roles) {
            return res.status(401).json({ message: "Unauthorized user - no role provided" });
        }

        if (!roles.includes(user.roles)) {
            return res.status(403).json({ message: "Access denied - insufficient permissions" });
        }

        next();
        } catch (err) {
        next(err);
        }
    };
};

export default authorize;