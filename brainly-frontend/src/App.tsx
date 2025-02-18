import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import { UserDashBoard } from "./pages/UserDashBoard";
import PrivateRoute from "./components/PrivateRoute";
import PageNotFound from "./pages/PageNotFound";
import LandingPage from "./pages/LandingPage";
import Feedback from "./pages/Feedback";
import Twitter from "./pages/Twitter";
import Youtube from "./pages/Youtube";
import LinkPage from "./pages/LinkPage";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Signin" element={<Signin />} />
          <Route
            path="/Dashboard"
            element={<PrivateRoute element={<Dashboard />} />}
          />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/Dashboard/twitter" element={<Twitter />} />
          <Route path="/Dashboard/youtube" element={<Youtube />} />
          <Route path="/Dashboard/link" element={<LinkPage />} />

          <Route path="/sharebrain/:shareLink" element={<UserDashBoard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
