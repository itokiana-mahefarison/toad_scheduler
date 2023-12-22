const express = require('express')
const {ToadScheduler, Task, SimpleIntervalJob} = require('toad-scheduler')
const app = express()

const scheduler = new ToadScheduler()

app.use(async (req, res, next) => {
    console.log('Middleware')
    req.scheduler = scheduler
    next()
})

app.get('/task', async (req, res) => {
    const scheduler = req.scheduler
    const task = new Task('simple task', () => {
        // if this task runs long, second one won't be started until this one concludes
        console.log('Task triggered');
    });
    
    const job = new SimpleIntervalJob(
        { seconds: 20, runImmediately: true },
        task,
        { 
            id: 'id_1',
            preventOverrun: true,
        }
    );
    
    //create and start jobs
    scheduler.addSimpleIntervalJob(job);
    return res.status(200).send()
})

app.get('/task/stop', async (req, res) => {
    const scheduler = req.scheduler
    scheduler.stopById('id_1')

    console.log(scheduler.getById('id_1').getStatus());
    return res.status(200).send()
})

app.get('/task/remove', async (req, res) => {
    const scheduler = req.scheduler
    scheduler.removeById('id_1')

    // console.log(scheduler.getById('id_1').getStatus());
    return res.status(200).send()
})

app.listen(5000, () => {
    console.log("Express app running")
})