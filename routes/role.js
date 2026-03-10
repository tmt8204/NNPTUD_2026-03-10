const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');
const User = require('../schemas/users');

router.get('/', async function (req, res) {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.send(roles);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', async function (req, res) {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });

        if (!role) {
            return res.status(404).send({ message: 'ID NOT FOUND' });
        }

        res.send(role);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
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
            { _id: req.params.id, isDeleted: false },
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
            { _id: req.params.id, isDeleted: false },
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
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });

        if (!role) {
            return res.status(404).send({ message: 'ROLE ID NOT FOUND' });
        }

        const users = await User.find({ role: req.params.id, isDeleted: false }).populate('role');
        res.send(users);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
