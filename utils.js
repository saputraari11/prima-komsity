const generateRandom = (limit,n = 1) => {
    let array = []
    for (let index = 0; index < n; index++) {
        const random = Math.random() * limit
        if(!array.includes(random)) {
            array.push(random.toFixed(0))
        }
    }

    return array
} 

module.exports = {
    generateRandom
}