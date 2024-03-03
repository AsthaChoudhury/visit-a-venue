import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import sweetalert from "sweetalert2";

function AdminScreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  });
  return (
    <div className="mt-3 ml-3 mr-5 bs">
      <h1 className="text-center">
        <b>Admin Panel</b>
      </h1>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Bookings" key="1">
          <Bookings />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Rooms" key="2">
          <Rooms />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Add Room" key="3">
          <AddRoom />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Update room" key="4">
          <UpdateRoom />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Users" key="4">
          <Users />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default AdminScreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/bookings/getallbookings");
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-10">
        <h1>Bookings</h1>
        {loading && <Loader />}

        <table className="table table-bordered ">
          <thead className="bs">
            <tr>
              <th>Sl.No</th>
              <th>Booking ID</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 &&
              bookings.map((booking, index) => {
                return (
                  <tr key={booking._id}>
                    <td>{index + 1}</td>
                    <td>{booking._id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.fromdate}</td>
                    <td>{booking.todate}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {bookings.length > 0 && (
          <h1>There are total {bookings.length} bookings</h1>
        )}
        {error && <Error error={error} />}
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        setrooms(response.data);
        setLoading(false);
        sweetalert
          .fire("CONGRATULATIONS", "new room added successfully", "success")
          .then((result) => {
            window.location.href = "/home";
          });
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(error);
        sweetalert.fire("oops", "Something went wrong", "error");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-10">
        {loading && <Loader />}
        {error && <Error />}
        <h1>Rooms</h1>
        {loading && <Loader />}

        <table className="table table-bordered ">
          <thead className="bs">
            <tr>
              <th>Sl.No</th>
              <th>Room ID</th>
              <th>name</th>
              <th>type</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length > 0 &&
              rooms.map((room, index) => {
                return (
                  <tr key={room._id}>
                    <td>{index + 1}</td>
                    <td>{room._id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {rooms.length > 0 && <h1>There are total {rooms.length} rooms</h1>}
        {error && <Error error={error} />}
      </div>
    </div>
  );
}

export function Users() {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/users/getallusers");
        setusers(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-10">
        <h1>users</h1>
        {loading && <Loader />}

        <table className="table table-bordered ">
          <thead className="bs">
            <tr>
              <th>Sl.No</th>
              <th>user ID</th>
              <th>name</th>
              <th>email</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => {
                return (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "YES" : "NO"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {users.length > 0 && <h1>There are total {users.length} users</h1>}
        {error && <Error error={error} />}
      </div>
    </div>
  );
}

function AddRoom() {
  const [name, setroom] = useState("");
  const [rentperday, setrentperday] = useState();
  const [maxcount, setmaxcount] = useState();
  const [phonenumber, setphonenumber] = useState();
  const [type, settype] = useState();
  const [description, setdescription] = useState();
  const [img1, setimg1] = useState();
  const [img2, setimg2] = useState();
  const [img3, setimg3] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function addRoom() {
    const newroom = {
      name,
      rentperday,
      maxcount,
      phonenumber,
      type,
      description,
      imageurls: [img1, img2, img3],
    };
    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/rooms/addroom", newroom)
      ).data;
      console.log(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  }

  return (
    <div className="row">
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="room name"
          value={name}
          onChange={(e) => {
            setInterval(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="rent per day"
          value={rentperday}
          onChange={(e) => {
            setrentperday(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="max count"
          value={maxcount}
          onChange={(e) => {
            setmaxcount(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="phone number"
          value={phonenumber}
          onChange={(e) => {
            setphonenumber(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="type"
          value={type}
          onChange={(e) => {
            settype(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="description"
          value={description}
          onChange={(e) => {
            setdescription(e.target.value);
          }}
        />
      </div>
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="image url"
          value={img1}
          onChange={(e) => {
            setimg1(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="image url"
          value={img2}
          onChange={(e) => {
            setimg2(e.target.value);
          }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="image url"
          value={img3}
          onChange={(e) => {
            setimg3(e.target.value);
          }}
        />
      </div>
      <div className="text-right">
        <button className="btn btn-primary" onClick={addRoom}>
          Add Room
        </button>
      </div>
    </div>
  );
}

function UpdateRoom() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState({
    name: "",
    rentperday: "",
    maxcount: "",
    phonenumber: "",
    type: "",
    description: "",
    imageurls: ["", "", ""],
  });

  useEffect(() => {
    const fetchRoomById = async () => {
      try {
        setLoading(true);
        const result = await axios.post("/api/rooms/getRoomById/:roomid", {
          roomid: "roomId",
        });
        setRoom(result.data.room);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError(error);
      }
    };
    fetchRoomById();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]: value,
    }));
  };

  const handleUpdateRoom = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/rooms/updateRoom/${room._id}`,
        room
      );
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(error);
    }
  };

  return (
    <div className="row">
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="room name"
          name="name"
          value={room.name}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="rent per day"
          name="rentperday"
          value={room.rentperday}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="max count"
          name="maxcount"
          value={room.maxcount}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="phone number"
          name="phonenumber"
          value={room.phonenumber}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="type"
          name="type"
          value={room.type}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="description"
          name="description"
          value={room.description}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="image url"
          name="image1"
          value={room.imageurls[0]}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="image url"
          name="image2"
          value={room.imageurls[1]}
          onChange={handleChange}
        />
        <input
          type="text"
          className="form-control"
          placeholder="image url"
          name="image3"
          value={room.imageurls[2]}
          onChange={handleChange}
        />
      </div>
      <div className="text-right">
        <button className="btn btn-primary" onClick={handleUpdateRoom}>
          Update Room
        </button>
      </div>
    </div>
  );
}
