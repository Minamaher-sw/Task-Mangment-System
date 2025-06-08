import StatusCodes from "../utils/status.codes";
import JSEND_STATUS from "../utils/http.status.message";
const authorize = (roles = []) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user || !user.roles) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: JSEND_STATUS.FAIL,
                    message: "Unauthorized user - no role provided"
                });
            }

            if (!roles.includes(user.roles)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    status: JSEND_STATUS.FAIL,
                    message: "Access denied - insufficient permissions"
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

export default authorize;