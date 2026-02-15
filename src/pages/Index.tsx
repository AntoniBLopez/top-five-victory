import GameResultScreen from "@/components/GameResultScreen";

const MOCK_RANKING = [
  { rank: 1, name: "María López", xp: 2480, avatar: "👩‍🎓" },
  { rank: 2, name: "Carlos Ruiz", xp: 2210, avatar: "🧑‍💻" },
  { rank: 3, name: "Anna Schmidt", xp: 1950, avatar: "👩‍🏫" },
  { rank: 4, name: "Du", xp: 1820, avatar: "🙋", isCurrentUser: true },
  { rank: 5, name: "Lukas Weber", xp: 1650, avatar: "🧑‍🎤" },
];

const Index = () => {
  return (
    <GameResultScreen
      xpEarned={85}
      correctAnswers={8}
      totalQuestions={10}
      gameType="Multiple Choice"
      ranking={MOCK_RANKING}
      onPlayAgain={() => console.log("Play again")}
      onContinue={() => console.log("Continue")}
    />
  );
};

export default Index;
