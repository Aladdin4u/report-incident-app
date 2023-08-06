const { randomBytes, timingSafeEqual } = require("crypto");

const randomToken = randomBytes(32).toString("hex");
const promisify = (a,b) => {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

module.exports = {
    randomToken,
    promisify
}