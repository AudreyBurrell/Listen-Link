const express = require('express');
const router = express.Router();
const Room = require('../models/Rooms');
const authenticateToken = require('../middleware/auth');

router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { roomName } = req.body;
        if(!roomName || roomName.trim() === '') {
            return res.status(400).json({ message: 'Room name is required' });
        }
        const room = new Room({
            name: roomName,
            createdBy: req.user.userId,
            participants: [req.user.userId]
        });
        await room.save();
        res.status(201).json({
            message: 'Room created successfully',
            room: {
                id: room._id,
                name: room.name,
                createdAt: room.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get('/list', authenticateToken, async (req, res) => {
    try {
        const rooms = await Room.find({ isActive: true })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1});
        res.json({
            rooms: rooms.map(room => ({
                id: room._id,
                name: room.name,
                createdBy: room.createdBy.username,
                participantCount: room.participants.length,
                createdAt: room.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/join/:roomId', authenticateToken, async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if(!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if(!room.isActive) {
            return res.status(400).json({ message: 'Room is not active' });
        }
        if(!room.participants.includes(req.user.userId)) {
            room.participants.push(req.user.userId);
            await room.save();
        }
        res.json({
            message: 'Joined room successfully',
            room: {
                id: room._id,
                name: room.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete('/delete/:roomId', authenticateToken, async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if(!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        if(room.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Only the room creator can delete this room' });
        } 
        room.isActive = false;
        await room.save();
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;