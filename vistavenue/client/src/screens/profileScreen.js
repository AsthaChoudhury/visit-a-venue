import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import sweetalert from "sweetalert2";
import { Tag } from "antd";

const { TabPane } = Tabs;

const ProfileScreen = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  });
  const items = [
    {
      key: "1",
      label: "profile",
      children: (
        <div>
          <h1>My Profile</h1>
          <h1>Name: {user.name}</h1>
          <h1>Email: {user.email}</h1>
          <h1>isAdmin: {user.isAdmin ? "YES" : "NO"}</h1>
        </div>
      ),
    },
    {
      key: "2",
      label: "bookings",
      children: <MyBookings />,
    },
  ];

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1">
        {items.map((item) => (
          <TabPane tab={item.label} key={item.key}>
            {item.children}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default ProfileScreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setbookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        setbookings(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error);
      }
    };
    fetchBookings();
  });

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/bookings/cancelbooking", { bookingid, roomid })
      ).data;
      console.log(result);
      setLoading(false);
      sweetalert.fire("Booking cancelled", "success").then((result) => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
      sweetalert("Something went wrong", "error");
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {error && <Error />}
          {bookings &&
            bookings.mao((booking) => {
              return (
                <div className="bs">
                  <h1>{booking.room}</h1>
                  <p>
                    <b>Booking id</b>: {booking._id}
                  </p>
                  <p>
                    <b>Check In</b>: {booking.fromdate}
                  </p>
                  <p>
                    <b>Check Out</b>: {booking.todate}
                  </p>
                  <p>
                    <b>Amount</b>: {booking.totalamount}
                  </p>
                  <p>
                    Status:{" "}
                    {booking.status === "cancelled" ? (
                      <Tag color="red">CANCELLED</Tag>
                    ) : (
                      <Tag color="green">CONFIRMED</Tag>
                    )}
                  </p>
                  {booking.status !== "cancelled" && (
                    <div className="text-right">
                      <button
                        class="btn btn-primary"
                        onClick={() => {
                          cancelBooking(booking._id, booking.roomid);
                        }}
                      >
                        CANCEL
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
