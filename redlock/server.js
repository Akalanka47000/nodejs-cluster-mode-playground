const express = require('express')

const app = express()

const Client = require("ioredis");
const Redlock = require('redlock').default


const client = new Client({ host: "127.0.0.1" });

const redlock = new Redlock(
    [client],
    {
        driftFactor: 0.01,
        retryCount: 1,
        retryDelay: 4000,
        retryJitter: 200,
        automaticExtensionThreshold: 500,
    }
);

app.get('/', (req, res) => {
    res.json({ message: 'Server up and running!' })
})

const KEY = 'locked'

app.get('/lockable', async (req, res) => {
    try {

        const locked = await client.get(KEY)

        if (locked === 'true') {
            res.json({ message: 'Resource locked!' })
        } else {
            const lock = await redlock.acquire([KEY], 5000);
            await client.set(KEY, true, 'ex', 15)
            await new Promise(resolve => setTimeout(async () => {
                await lock.release()
                await client.set(KEY, false)
                resolve()
            }, 5000))
            res.json({ message: 'Resource unlocked!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ message: error.message })
    }
})

app.listen(3000, () => {
    console.log('Server up and running on port 3000!')
})