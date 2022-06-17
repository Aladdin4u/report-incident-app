// const name = 'yoshi';

// console.log(global);

// global.setTimeout(() => {
//     console.log('in the timeout')
//     clearInterval(int)
// }, 3000);

// const int = setInterval(() => {
//     console.log('in the interval')
// }, 1000)

// console.log(__dirname)
// console.log(__filename)

// const os = require('os');
// console.log(os)

const fs = require('fs');
// fs.readFile('./docs/blog1.txt', (err, data) => {
//     if(err) {
//         console.log(err)
//     }
//     console.log(data.toString());
// })

fs.writeFile('./docs/blog1.txt', 'hello world', () => {
    console.log('file is written');
})