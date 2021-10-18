const { campgroundJoiSchema } = require("../joiSchemas");
const ExpressError = require("./ExpressError");

module.exports = (request, response, next) => {
    const { error } = campgroundJoiSchema.validate(request.body);
    if (error) {
        const message = error.details.map((element) => element.message).join(", ");
        throw new ExpressError("Invalid Campground Data: " + message, 400);
    } else {
        next();
    }
};
