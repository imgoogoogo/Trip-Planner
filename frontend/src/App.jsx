import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import { Main } from "./pages/main/main";
import AuthCallback from "./pages/auth/AuthCallback";
import { CreateTrip } from "./pages/create-trip/create-trip";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/create-trip" element={<CreateTrip />} />
      </Routes>
    </Router>
  );
}

export default App;
