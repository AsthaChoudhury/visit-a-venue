import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker } from "antd";
import { Link } from "react-router-dom";
import "antd/dist/reset.css";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromdate, setfromdate] = useState();
  const [todate, setenddate] = useState();
  const [dupes, setdupes] = useState();
  const [search, setsearch] = useState("");
  const [type, settype] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getAllRooms");
        setRooms(response.data.rooms);
        setdupes(response.data.rooms);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const filterByDate = (dates) => {
  //   const fromdate = moment(dates[0].format("DD-MM-YYYY"));
  //   console.log(fromdate);
  //   const todate = moment(dates[1].format("DD-MM-YYYY"));
  //   console.log(todate);
  //   setfromdate(fromdate);
  //   setenddate(todate);
  // };

  const filterByDate = (dates) => {
    const fromdate = moment(dates[0].$d).format("LL");
    const todate = moment(dates[1].$d).format("LL");
    setfromdate(fromdate);
    setenddate(todate);

    var temprooms = [];
    var available = false;
    for (let room of dupes) {
      if (room.currentbookings.legth > 0) {
        for (let booking of room.currentbookings) {
          if (
            !moment(fromdate).isBetween(booking.fromdate, booking.todate) &&
            !moment(todate).isBetween(booking.fromdate, booking.todate)
          ) {
            if (
              moment(dates[0]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[0]).format("DD-MM-YYYY") !== booking.todate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.fromdate &&
              moment(dates[1]).format("DD-MM-YYYY") !== booking.todate
            ) {
              available = true;
            }
          }
        }
      }
      if (available == true || room.currentbookings.length == 0) {
        temprooms.push(room);
      }
      setRooms = temprooms;
    }
  };

  function filterBySearch() {
    const temprooms = dupes.filter((room) =>
      room.name.toLowerCase().includes(search.toLowerCase())
    );
    setRooms(temprooms);
  }

  function filterByType(e) {
    if (e !== "all") {
      const temprooms = dupes.filter(
        (room) => room.type.toLowerCase() == e.toLowerCase()
      );
      setRooms(temprooms);
    } else {
      setRooms(dupes);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="search rooms"
            value={search}
            onChange={(e) => {
              setsearch(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
            <option value="all">"all</option>
            <option value="deluxe">"deluxe</option>
            <option value="non-deluxe">"non deluxe</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : (
          rooms.map((room) => (
            <div className="col-md-9 mt-3" key={room._id}>
              <Room room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homescreen;
