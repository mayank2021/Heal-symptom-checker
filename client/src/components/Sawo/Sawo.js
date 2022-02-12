import React, { useEffect } from "react";
import Sawo from "sawo";
import Heal from "../../Images/pharmacy.png";

const LoginPage = () => {
  useEffect(() => {
    var config = {
      // should be same as the id of the container created on 3rd step
      containerID: "sawo-container",
      // can be one of 'email' or 'phone_number_sms'
      identifierType: "email",
      // Add the API key copied from 5th step
      apiKey: "918b89cc-3da2-471a-a075-327713943abb",
      // Add a callback here to handle the payload sent by sdk
      onSuccess: (payload) => {
        window.location = `${window.location.origin}/home`;
      },
    };
    let sawo = new Sawo(config);
    sawo.showForm();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: "3px solid #ff6363",
          width: "140px",
          height: "140px",
          borderRadius: 500,
          boxSizing: "border-box",
          padding: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img style={{ width: "100px" }} src={Heal} alt="heal" />
      </div>
      <h1
        style={{
          color: "#FF6363",
          margin:'10px 0',
          letterSpacing: 3,
        }}
      >
        HEAL
      </h1>
      <div
        id="sawo-container"
        style={{
          height: "200px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>
    </div>
  );
};

export default LoginPage;
