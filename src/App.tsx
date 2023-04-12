import { Toaster } from "react-hot-toast";
import Home from "./pages/homePage/homePage";
import "./App.css";

const toastOptions = {
  style: {
    minWidth: 500,
  },
  duration: 3000,
};

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={toastOptions} />
      <Home />
    </>
  );
}

export default App;
