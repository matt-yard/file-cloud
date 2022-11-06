import "../styles/App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";

function App() {
  const { currentUser, setCurrentUser } = useAuth();

  return (
    <div className="App">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet context={{ currentUser, setCurrentUser }} />
    </div>
  );
}

export default App;
