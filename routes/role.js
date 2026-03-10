const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');
const User = require('../schemas/users');

router.get('/', async function (req, res) {
    let data = await Role.find();
    res.send(data);
});

router.get('/:id', async function (req, res) {
    let data = await Role.findOne({
        _id: req.params.id,
    })

    if (!data) {
        return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    res.send(data);
});

router.post('/', async function (req, res) {
    try {
        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id', async function (req, res) {
    try {
        const updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id},
            req.body,
            { new: true }
        );

        if (!updatedRole) {
            return res.status(404).send({ message: 'ID NOT FOUND' });
        }

        res.send(updatedRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id', async function (req, res) {
    try {
        const deletedRole = await Role.findOneAndUpdate(
            { _id: req.params.id},
            { isDeleted: true },
            { new: true }
        );

        if (!deletedRole) {
            return res.status(404).send({ message: 'ID NOT FOUND' });
        }

        res.send(deletedRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.get('/:id/users', async function (req, res) {
    try {
        const role = await Role.findOne({ _id: req.params.id});

        if (!role) {
            return res.status(404).send({ message: 'ROLE ID NOT FOUND' });
        }

        const users = await User.find({ role: req.params.id}).populate('role');
        res.send(users);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
