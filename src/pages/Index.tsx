import { useState } from "react";
import GameResultScreen from "@/components/GameResultScreen";
import DailyStreakPopup from "@/components/DailyStreakPopup";

const MOCK_RANKING = [
  { rank: 1, name: "María López", xp: 2480, avatar: "👩‍🎓" },
  { rank: 2, name: "Carlos Ruiz", xp: 2210, avatar: "🧑‍💻" },
  { rank: 3, name: "Anna Schmidt", xp: 1950, avatar: "👩‍🏫" },
  { rank: 4, name: "Lukas Weber", xp: 1650, avatar: "🧑‍🎤" },
  { rank: 5, name: "Sophie Müller", xp: 1520, avatar: "👩‍🔬" },
];

const MOCK_USER_RANK = { rank: 8, name: "Du", xp: 1120, avatar: "🙋", isCurrentUser: true };

const Index = () => {
  const [showStreak, setShowStreak] = useState(true);

  return (
    <>
      <DailyStreakPopup streakDays={30} open={showStreak} onClose={() => setShowStreak(false)} />
      <GameResultScreen
        xpEarned={85}
        correctAnswers={8}
        totalQuestions={10}
        gameType="Multiple Choice"
        ranking={MOCK_RANKING}
        currentUserRank={MOCK_USER_RANK}
        onPlayAgain={() => console.log("Play again")}
        onContinue={() => console.log("Continue")}
      />
    </>
  );
};

export default Index;
