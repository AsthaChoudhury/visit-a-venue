import React from "react";
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/react";

function Loader() {
  return (
    <div style={{ marginTop: "150px" }}>
      <div className="sweet-loading text-center">
        <HashLoader color="#000" loading={true} css="" size={80} />
      </div>
    </div>
  );
}

export default Loader;
