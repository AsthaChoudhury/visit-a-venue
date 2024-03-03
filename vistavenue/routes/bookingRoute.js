const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const stripe = require("stripe");
const { v4: uuidv4 } = require("uuid");
const Room = require("../models/room");
router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays } = req.body;

  try {
    const customer = await stripe.customers.crete({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "INR",
        receipt_email: token.email,
      },
      {
        idempotencykey: uuidv4(),
      }
    );

    if (payment) {
      try {
        const newbooking = new Booking({
          room: room.name,
          roomid: room._id,
          userid,
          fromdate: moment(fromdate).fromat("DD-MM-YYY"),
          todate: moment(todate).fromat("DD-MM-YYY"),
          totalamount,
          totaldays,
          transactionid: "1234",
        });
        const booking = await newbooking.save();

        const roomtemp = await room.findOne({ _id: room._id });
        roomtemp.currentbookings.push({
          bookingid: booking._id,
          fromdate: moment(fromdate).fromat("DD-MM-YYY"),
          todate: moment(todate).fromat("DD-MM-YYY"),
          userid: userid,
          status: booking.status,
        });

        await roomtemp.save();

        res.send("Booked");
      } catch (error) {
        res.error.statue(400).json({ error });
      }
    }
    res.send("payment successful,bookrf");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const bookingg = await booking.findOne({ _id: bookingid });
    bookingg.status = "cancelled";
    await bookingg.save();
    const room = await Room.findOne({ _id: roomid });
    const bookings = room.currentbookings;
    const temp = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );
    room.currentbookings = temp;
    await room.save();
    res.send("Cancelled successfullt");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
