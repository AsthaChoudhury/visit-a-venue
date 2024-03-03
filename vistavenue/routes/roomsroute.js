const express = require("express");
const router = express.Router();

const Room = require("../models/room");

router.get("/getAllRooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    return res.json({ rooms });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getRoomById/:roomid", async (req, res) => {
  const roomid = req.params.roomid;
  try {
    const room = await Room.findOne({ _id: roomid });
    res.json({ room });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/addroom", async (req, res) => {
  try {
    const newroom = new Room(req.body);
    await newroom.save();
    res.send("room added successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put("/updateRoom/:roomid", async (req, res) => {
  const roomid = req.params.roomid;
  try {
    const updatedRoom = await Room.findByIdAndUpdate(roomid, req.body, {
      new: true,
    });
    res.json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
