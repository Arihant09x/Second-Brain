import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import { UserDashBoard } from "./pages/UserDashBoard";
import PrivateRoute from "./components/PrivateRoute";
import PageNotFound from "./pages/PageNotFound";
import LandingPage from "./pages/LandingPage";
import Twitter from "./pages/Twitter";
import Youtube from "./pages/Youtube";
import LinkPage from "./pages/LinkPage";
import AskAI from "./pages/AskAI";
import Documents from "./pages/Documents";
import { AuthProvider } from "./contexts/AuthContext";
import Linkedin from "./pages/Linkedin";
import Reddits from "./pages/reddits";

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<PageNotFound />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Signin" element={<Signin />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              path="/dashboard/ask-ai"
              element={<PrivateRoute element={<AskAI />} />}
            />
            <Route
              path="/Dashboard/documents"
              element={<PrivateRoute element={<Documents />} />}
            />
            <Route path="/Dashboard/twitter" element={<Twitter />} />
            <Route path="/Dashboard/linkedin" element={<Linkedin />} />
            <Route path="/Dashboard/reddits" element={<Reddits />} />
            <Route path="/Dashboard/youtube" element={<Youtube />} />
            <Route path="/Dashboard/link" element={<LinkPage />} />

            <Route path="/sharebrain/:shareLink" element={<UserDashBoard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;
