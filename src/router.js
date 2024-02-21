import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GamePage } from "./pages/GamePage/GamePage";
import { SelectLevelPage } from "./pages/SelectLevelPage/SelectLevelPage";
import { LeaderBoard } from "./pages/LeaderBoard/LeaderBoard";

export const router = (
  <Router basename="/react-memo">
    <Routes>
      <Route path="/" element={<SelectLevelPage />} />
      <Route path="/game/:pairsCount" element={<GamePage />} />
      <Route path="/leaderboard" element={<LeaderBoard />} />
    </Routes>
  </Router>
);
