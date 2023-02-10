const cluster = require('node:cluster');
const { cpus } = require('node:os');

const cpuCount = cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
    })
} else {
    const express = require('express')

    const app = express()

    app.get('/', (req, res) => {
        res.json({message: 'Server up and running!'})
    })

    app.get('/big-process', async (req, res) => {
        for (let i = 0; i < 50000; i++) {
            console.log(i)
        }
        res.json({message: 'Big process done!'})
    })

    app.get('/small-process', async (req, res) => {
        res.json({message: 'Small process done!'})
    })

    app.listen(3000)

    console.log(`Process ${process.pid} started`)
}