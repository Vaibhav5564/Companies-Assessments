
const {
    validateName,
    validateEmail,
    validateAddress,
    validatePassword
} = require("../middleware/validate");

const validateStore = (store) => {
    return (
        typeof store.name === "string" &&
        store.name.trim().length > 0 &&
        typeof store.email === "string" &&
        validateEmail(store.email) &&
        validateAddress(store.address)
    );
};

const validateRating = (rating) => {
    return Number.isInteger(rating) &&
        rating >= 1 &&
        rating <= 5;
};

const validateUser = (user) => {
    return validateName(user.name) &&
        validateEmail(user.email) &&
        validateAddress(user.address) &&
        validatePassword(user.password);
};

module.exports = {
    validateStore,
    validateRating,
    validateUser
};
