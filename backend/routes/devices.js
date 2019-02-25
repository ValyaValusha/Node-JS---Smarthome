const http = require('http');
const router = require('express').Router();
const devices = require('../models/devices');
const Device = require('../models/device');


function sendRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(res.statusCode)
            } else {
                resolve();
            };
        });
    });
};

function deviceAdapter(device) {
    return {
        id: device._id,
        name: device.name,
        address: device.address,
        port: device.port,
        state: device.state ? 'on' : 'off'
    };
};

router.get('/', async(req, res) => {
    const devices = await Device.find().exec();
    res.json(devices.map(deviceAdapter));
});

router.get('/:id', async(req, res) => {
    const deviceId = req.params.id;
    const device = await Device.findById(deviceId).exec();

    if (device) {
        res.json(deviceAdapter(device));
    } else {
        res.sendStatus(404);
    };
});

router.post('/', async(req, res) => {

    const deviceData = req.body;
    // devices.addDevice(deviceData);
    // res.sendStatus(201);
    const device = new Device(deviceData);
    await device.save();
    
    res.sendStatus(201);
});

router.delete('/:id', async(req, res) => {
    const deviceId = req.params.id;
    await Device.findByIdAndDelete(deviceId);
    // devices.deleteDevice(deviceId);

    res.sendStatus(200);
});

router.put('/:id', async(req, res) => {
    const deviceId = req.params.id;
    const deviceData = req.body;

    try {
        const device = await Device.findById(deviceId).exec();

        await device.update({
            ...deviceData,
            state: deviceData.state === 'on' ? true : false
        })

        // await Device.findByIdAndUpdate(deviceId, {
        //     ...deviceData,
        //     state: deviceData.state === 'on' ? true : false
        // });  

        const url = `http://${device.address}:${device.port}`;
        const command = device.state ? 'Power off' : 'Power On';

        await sendRequest(`${url}/cm?cmnd=${command}`)
        res.sendStatus(200);
  
    } catch(e) {
        res.sendStatus(404);
    };
    // if (devices.getDeviceById(deviceId)) {
    //     devices.updateDevice(deviceId, deviceData);
    //     res.sendStatus(200);
    // } else {
    //     res.sendStatus(404);
    // }
});

module.exports = router;