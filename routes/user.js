const express = require('express');
const router = express.Router();
const User = require('../schemas/users');

router.get('/', async function (req, res) {
	let userData = await User.find({ status: false }).populate('role');

    if (!userData) {
        return res.status(404).send({ message: 'NO DATA' });
    }
    res.send(userData);
});

router.post('/enable', async function (req, res) {
	try {
		const { email, username } = req.body;
		const user = await User.findOneAndUpdate(
			{ email, username },
			{ status: true },
			{ new: true }
		);

		if (!user) {
			return res.status(404).send({ message: 'USER NOT FOUND OR INVALID INFO' });
		}

		res.send(user);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

router.post('/disable', async function (req, res) {
	try {
		const { email, username } = req.body;
		const user = await User.findOneAndUpdate(
			{ email, username },
			{ status: false },
			{ new: true }
		);

		if (!user) {
			return res.status(404).send({ message: 'USER NOT FOUND OR INVALID INFO' });
		}

		res.send(user);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

router.get('/:id', async function (req, res) {
	let userData = await User.findOne({
        _id: req.params.id,
        status: false
    }).populate('role');

    if (!userData) {
        return res.status(404).send({ message: 'ID NOT FOUND' });
    }

    res.send(userData);
});

router.post('/', async function (req, res) {
	try {
		const newUser = new User(req.body);
		await newUser.save();
		res.status(201).send(newUser);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

router.put('/:id', async function (req, res) {
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: req.params.id, status: false },
			req.body,
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(404).send({ message: 'ID NOT FOUND' });
		}

		res.send(updatedUser);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

router.delete('/:id', async function (req, res) {
	try {
		const deletedUser = await User.findOneAndUpdate(
			{ _id: req.params.id, status: false },
			{ status: true },
			{ new: true }
		);

		if (!deletedUser) {
			return res.status(404).send({ message: 'ID NOT FOUND' });
		}

		res.send(deletedUser);
	} catch (error) {
		res.status(400).send({ message: error.message });
	}
});

module.exports = router;
