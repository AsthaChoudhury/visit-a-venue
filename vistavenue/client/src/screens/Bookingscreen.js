import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import sweetalert from "sweetalert2";

function Bookingscreen({ match }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState({});
  const [totalamount, settotalamount] = useState();

  const { roomid, fromdate, todate } = useParams();

  const userData = localStorage.getItem("currentUser");
  let user;
  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    user = null;
  }

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      window.location.reload = "/login";
    }
    const fetchRoomById = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/rooms/getRoomById/${roomid}`);

        setRoom(data.room);
        setLoading(false);
        sweetalert
          .fire("Congratulation, room booked", "success")
          .then((result) => {
            window.location.href = "/bookings";
          });
      } catch (error) {
        setLoading(false);
        sweetalert.fire("something went wrong", "error");
        setError(true);
      }
    };

    fetchRoomById();
  }, [roomid]);

  {
    loading && <Loader />;
  }
  {
    error && <Error />;
  }
  if (!room || !room.imageurls || room.imageurls.length === 0)
    return <Error message="Room not found" />;

  const roomimg = room.imageurls[0];

  const totaldays = moment(todate).diff(moment(fromdate), "days") + 1;
  const totalamt = room.rentperday * totaldays;

  // async function bookRoom() {
  //   if (!user || !user.data) {
  //     console.error("User data not found");
  //     // Handle case where user data is not available
  //     return;
  //   }

  //   const bookingdetails = {
  //     room,
  //     userid: user.data._id,
  //     fromdate,
  //     todate,
  //     totalamount: { totalamt },
  //     totaldays,
  //   };
  //   try {
  //     const result = await axios.post("/api/bookings/bookroom", bookingdetails);
  //   } catch (error) {
  //     console.error("Error booking room:", error);
  //   }
  // }

  async function onToken(token) {
    console.log(token);

    if (!user || !user.data) {
      console.error("User data not found");
      return;
    }

    const bookingdetails = {
      room,
      userid: user.data._id,
      fromdate,
      todate,
      totalamount: { totalamt },
      totaldays,
      token,
    };
    try {
      setLoading(true);

      const result = await axios.post(
        "/api/bookings/bookroom",
        bookingdetails,
        token
      );
      setLoading(false);
    } catch (error) {
      console.error("Error booking room:", error);
    }
    setLoading(false);
  }

  return (
    <div className="m-5">
      <div className="row justify-content-center mt-5 bs">
        <div className="col-md-6">
          <img src={roomimg} className="bigimg" alt={room.name} />
        </div>
        <div className="col-md-6">
          <div>
            <h1>Booking Details</h1>
            <hr />
            <p>Name: {user && user.data ? user.data.name : "Unknown"}</p>
            <p>From Date: {moment(fromdate).format("DD-MM-YYYY")}</p>
            <p>To Date: {moment(todate).format("DD-MM-YYYY")}</p>
            <p>Max count: {room.maxcount}</p>
          </div>
          <div>
            <h1>Amount</h1>
            <hr />
            <p>Total days: {totaldays}</p>
            <p>Rent per day: {room.rentperday}</p>
            <p>Total Amount: {room.rentperday * totaldays}</p>
          </div>
          <div>
            <StripeCheckout
              amount={totalamount * 100}
              token={onToken}
              currency="INR"
              stripeKey="publidh_stripekey" //copy key from stipe account not adding mine
            >
              <button className="btn btn-primary">Pay Now </button>
            </StripeCheckout>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
