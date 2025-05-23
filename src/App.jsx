import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Slide, ToastContainer } from "react-toastify";
import AppRoutes from "./routes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
  }, [dispatch]);

  return (
    <div>
      <AppRoutes />
      <ToastContainer
        transition={Slide}
        autoClose={2000}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
    </div>
  );
}

export default App;
