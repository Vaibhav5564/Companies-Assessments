
const validateName = (name) => {
    return typeof name === "string" &&
        name.trim().length >= 20 &&
        name.trim().length <= 60;
};

const validateEmail = (email) => {
    return typeof email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const validateAddress = (address) => {
    return typeof address === "string" &&
        address.length <= 400;
};

const validatePassword = (password) => {
    return typeof password === "string" &&
        password.length >= 8 &&
        password.length <= 16 &&
        /[A-Z]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);
};

const validateRegistration = (req, res, next) => {
    const { name, email, address, password } = req.body;

    if (!validateName(name)) {
        return res.status(400).json({
            message: "Name must be 20-60 characters"
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({
            message: "Invalid email address"
        });
    }

    if (!validateAddress(address)) {
        return res.status(400).json({
            message: "Address must not exceed 400 characters"
        });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            message: "Password must be 8-16 characters with an uppercase letter and special character"
        });
    }

    next();
};

module.exports = {
    validateName,
    validateEmail,
    validateAddress,
    validatePassword,
    validateRegistration
};
