const express = require('express')
const workerpool = require('workerpool');

const app = express()

const pool = workerpool.pool();

app.get('/', (req, res) => {
    res.json({ message: 'Server up and running!' })
})

app.get('/big-process', async (req, res) => {
    pool
        .exec(() => {
            for (let i = 0; i < 50000; i++) {
                console.log(i)
            }
        }, [])
        .then(function () {
            res.json({ message: 'Big process done!' })
        })
        .catch(function (err) {
            console.error(err);
        })
        .then(function () {
            pool.terminate();
        });
})

app.get('/small-process', async (req, res) => {
    res.json({ message: 'Small process done!' })
})

app.listen(3000)