import "./App.css";
// import Chat from "./Chat";
import { Route, Routes } from "react-router-dom";
import Sawo from "./components/Sawo/Sawo";
import Home from "./Pages/Home/Home";
import Convo from "./Pages/Convo/Convo";
import Chat from "./Chat";

function App() {
  return (
    <Routes>
    <Route path="/" element={<Sawo/>} />
    <Route path="/home" element={<Home/>} />
    <Route path="/convo" element={<Convo/>} />
    <Route path="/chat" element={<Chat/>} />
    </Routes>
      // {/* <button class="button" id="runButton" onClick={run}>
      //   Run <div class="button-bg"></div>
      // </button> */}
      // <Home/>
      // <Sawo/>
      // {/* <Chat/> */}

  );
}

export default App;
