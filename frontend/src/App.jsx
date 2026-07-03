import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import FriendliesHub from "./pages/FriendliesHub";
import MatchupRoom from "./pages/MatchupRoom";
import TournamentsHub from "./pages/TournamentsHub";
import TournamentRoom from "./pages/TournamentRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/friendlies" element={<FriendliesHub />} />
        <Route path="/friendlies/:rivalId" element={<MatchupRoom />} />
        <Route path="/tournaments" element={<TournamentsHub />} />
        <Route path="/tournaments/:tournamentId" element={<TournamentRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
