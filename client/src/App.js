import "./App.css";
import { Route, Routes } from "react-router-dom";
import Sawo from "./components/Sawo/Sawo";
import Home from "./Pages/Home/Home";
import Result from "./Pages/Result/Result";
import Convo from "./Pages/Convo/Convo";

function App() {
  return (
    <Routes>
    <Route path="/" element={<Sawo/>} />
    <Route path="/home" element={<Home/>} />
    <Route path="/convo" element={<Convo/>} />
    <Route path="/result" element={<Result/>} />
    </Routes>
  );
}

export default App;
