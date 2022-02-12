import "./App.css";
import * as SIP from "sip.js";
import { useEffect, useState } from "react";

function App() {
  //Dasha AI
  //TODO: Can turn into env after prod and deploy,just for convenient right now!
  const api = "http://localhost:8000";

  const getAccount = async () => {
    const response = await fetch(`${api}/sip`);
    const { aor, endpoint } = await response.json();
    return { aor, endpoint };
  };

  const createUser = async (aor, server) => {
    const user = new SIP.Web.SimpleUser(server, { aor });
    await user.connect();
    await user.register();
    return user;
  };

  const runCall = async (aor, name) => {
    const data = { aor, name };
    await fetch(`${api}/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const [aor, setAor] = useState();
  const [endpoint, setEndpoint] = useState();

  useEffect(() => {
    const start = async () => {
      const { aor, endpoint } = await getAccount();
      setAor(aor);
      setEndpoint(endpoint);
      const user = await createUser(aor, endpoint);

      const audio = new Audio();
      user.delegate = {
        onCallReceived: async () => {
          await user.answer();
          audio.srcObject = user.remoteMediaStream;
          audio.play();
        },
        onCallHangup: () => {
          audio.srcObject = null;
        },
      };
    };
    start();
  }, []);
  const run = () => {
    runCall(aor, "Peter").catch(() => {});
  };

  return (
    <div className="App">
      <button class="button" id="runButton" onClick={run}>
        Run <div class="button-bg"></div>
      </button>
    </div>
  );
}

export default App;
