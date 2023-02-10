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
            let completed = 0;
            for (let i = 0; i < 5000000; i++) {
                console.log(i)
                completed++;
            }
            return completed;
        })
        .then((completed) => {
            res.json({ message: 'Big process done!', data: { completed } })
        })
        .catch((err) => {
            console.error(err);
        })
        .then(() => {
            pool.terminate();
        });
})

app.get('/small-process', async (req, res) => {
    res.json({ message: 'Small process done!' })
})

app.listen(3000)