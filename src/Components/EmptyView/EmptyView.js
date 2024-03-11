import React from "react";

import Lottie from "lottie-react-web";
import emptyStatus from "./empty-status.json";
import { Typography } from "@material-ui/core";
import "../common/common.css";

/*Lottie: https://github.com/felippenardi/lottie-react-web*/

const EmptyView = ({ title = "No records found", message = "" }) => {
  return (
    <div className="blockView" style={{ textAlign: "center" }}>
      <Lottie
        width={"25%"}
        options={{
          animationData: emptyStatus,
        }}
      />
      <p />
      <Typography variant={"h4"}>{title}</Typography>
      <Typography variant={"body1"}>{message}</Typography>
    </div>
  );
};

export default EmptyView;
