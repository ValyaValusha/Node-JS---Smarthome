const router = require('express').Router();
const Group = require('../models/group');
const Device = require('../models/device');


function groupsAdapter(group) {
    return {
        id: group._id,
        name: group.name,
        state: group.state ? 'on' : 'off',
        devices: group.devices,
        log: group.log
    };
};

router.get('/', async(req, res) => {
    const groups = await Group.find().exec();
    res.json(groups.map(groupsAdapter));
});

router.get('/:id', async(req, res) => {
    const groupId = req.params.id;
    const group = await Group.findById(groupId).exec();

    if (group) {
        res.json(groupsAdapter(group));
    } else {
        res.sendStatus(404);
    };
});

router.get('/log/:id', async(req, res) => {
    const groupId = req.params.id;
    const group = await Group.findById(groupId, 'log').exec();

    if (group) {
        res.json(group.log);
    } else {
        res.sendStatus(404);
    };

});


router.post('/', async(req, res) => {
    const groupData = req.body;
    const group = new Group(groupData);
    await group.save();
    
    res.sendStatus(201);
});

router.delete('/:id', async(req, res) => {
    const groupId = req.params.id;
    await Group.findByIdAndDelete(groupId);

    res.sendStatus(200);
});

router.put('/:id', async(req, res) => {
    const groupId = req.params.id;
    const groupData = req.body;

    try {
        const group = await Group.findById(groupId).exec();

        await group.update({
            ...groupData,
            state: group.state,
            log: group.log,
            
        });

        res.sendStatus(200);
  
    } catch(e) {
        res.sendStatus(404);
    };
});

router.put('/addDevice/:id', async(req, res) => {
    const groupId = req.params.id;
    const deviceId = req.body.id;

    try {
        const group = await Group.findById(groupId).exec();
        const device = await Device.findById(deviceId).exec();

        await group.update({
            $push: { "devices": device }
        });

        res.sendStatus(200);
  
    } catch(e) {
        res.sendStatus(404);
    };
});

router.put('/deleteDevice/:id', async(req, res) => {
    const groupId = req.params.id;
    const devices = req.body;
    try {
        const group = await Group.findById(groupId).exec();
        await group.updateOne(
            {devices: devices}
        );
        res.sendStatus(200);
  
    } catch(e) {
        res.sendStatus(404);
    };
});


router.put('/log/:id', async(req, res) => {
    const groupId = req.params.id;
    const groupData = req.body;
    
    try {
        const group = await Group.findById(groupId).exec();
        const devices = await Device.find().exec();

        group.devices.map(async(item)=> {
            let device = await Device.findById(item.id).exec();
            await device.updateOne(
                {state: groupData.state === 'on' ? true : false}
            );
        });
        
        await group.updateOne({
            state: groupData.state === 'on' ? true : false,
            $push: { "log": { "date": new Date(), "action": groupData.state }}
        });

        res.sendStatus(200);
  
    } catch(e) {
        res.sendStatus(404);
    };
});

module.exports = router;