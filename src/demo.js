const bcrypt = require('bcrypt')
const b = bcrypt.compare('abc123','2b$08$b5ZzBjzSQV/S0JcyEG0n5..jlCZP9EYSm3/jTjSNIvvbFrY967N6a')
console.log(b);