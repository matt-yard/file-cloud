import "../styles/App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { processStorageList } from "../util";
import { Storage } from "aws-amplify";

function App() {
  const [fileSystem, setFileSystem] = useState({});
  const [totalStorage, setTotalStorage] = useState(0);
  const [storageBreakdown, setStorageBreakdown] = useState({});
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchMyFiles = async () => {
      try {
        const result = await Storage.vault.list("");

        const { parsedFiles, totalStorageUsed, storageBreakdown } =
          processStorageList(result);
        setFileSystem(parsedFiles);
        setTotalStorage(totalStorageUsed);
        setStorageBreakdown(storageBreakdown);
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) {
      fetchMyFiles();
    }
  }, [currentUser]);

  return (
    <div className="App">
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet
        context={{
          currentUser,
          setCurrentUser,
          fileSystem,
          setFileSystem,
          totalStorage,
          setTotalStorage,
          storageBreakdown,
          setStorageBreakdown,
        }}
      />
    </div>
  );
}

export default App;
