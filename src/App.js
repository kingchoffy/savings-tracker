import "./index.css";
import { useState } from "react";

const initialGoals = [
  { id: 101, name: "Emergency fund", icon: "💲", saved: 2400, target: 5000 },
  { id: 102, name: "New laptop", icon: "💻", saved: 950, target: 1500 },
  { id: 103, name: "Rent deposit", icon: "🏠", saved: 1800, target: 3000 },
  { id: 104, name: "Phone upgrade", icon: "📱", saved: 800, target: 800 },
];

function Button({ children, onClick, className = "" }) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [goals, setGoals] = useState(initialGoals);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  function handleShowAddGoal() {
    setShowAddGoal((visible) => !visible);
    setSelectedGoal(null);
  }

  function handleAddGoal(goal) {
    setGoals((goals) => [...goals, goal]);
  }

  function handleSelection(goal) {
    setSelectedGoal((cur) => (cur?.id === goal.id ? null : goal));
    setShowAddGoal(null);
  }

  function handleNewDeposit(value) {
    setGoals((goals) =>
      goals.map((goal) =>
        goal.id === selectedGoal.id
          ? { ...goal, saved: goal.saved + value }
          : goal,
      ),
    );
    setSelectedGoal(null);
  }

  return (
    <div className="wrap">
      <Logo goals={goals} />
      <div className="app">
        <div>
          <GoalsList
            goals={goals}
            onSelection={handleSelection}
            selectedGoal={selectedGoal}
          />
          <div className="add-wrap ">
            <Button onClick={handleShowAddGoal} className="alt">
              {showAddGoal ? "Close" : " +Add Goal"}
            </Button>
          </div>
        </div>
        {showAddGoal && <FormNewGoal onAddGoal={handleAddGoal} />}
        {selectedGoal && (
          <FormAddDeposit
            selectedGoal={selectedGoal}
            onDeposit={handleNewDeposit}
          />
        )}
      </div>
    </div>
  );
}

function Logo({ goals }) {
  const totalSaved = goals.reduce(
    (accumulator, goal) => accumulator + goal.saved,
    0,
  );
  return (
    <div className="header">
      <h1>Savings goals </h1>
      <div className="total">
        <small>Total saved</small>
        <b>${totalSaved}</b>
      </div>
    </div>
  );
}

function GoalsList({ goals, onSelection, selectedGoal }) {
  return (
    <ul className="goal-list">
      {goals.map((goal) => (
        <Goal
          goal={goal}
          key={goal.id}
          onSelection={onSelection}
          selectedGoal={selectedGoal}
        />
      ))}
    </ul>
  );
}

function Goal({ goal, onSelection, selectedGoal }) {
  const isSelected = selectedGoal?.id === goal.id;
  const percent = Math.min((goal.saved / goal.target) * 100, 100);
  const isDone = goal.saved === goal.target;
  return (
    <li
      className={`goal  ${isDone ? "done" : ""} ${isSelected ? "selected" : ""}`}
      onClick={() => onSelection(goal)}
    >
      <span className="goal-icon">{goal.icon}</span>
      <span>
        <b>
          {goal.name}
          {isDone ? <p className="badge"> Goal reached</p> : ""}
        </b>
        <small>
          ${goal.saved} of ${goal.target}
        </small>
        <div className="bar">
          <i style={{ width: `${percent}%` }}></i>
        </div>
      </span>
      <span className="goal-pct">{Math.round(percent)}%</span>
    </li>
  );
}

function FormNewGoal({ children, onAddGoal }) {
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [emoji, setEmoji] = useState("💲");

  function handleSubmit(e) {
    e.preventDefault();

    if (!goal || !amount) return;

    const id = crypto.randomUUID();
    const newGoal = {
      id,
      name: goal,
      saved: 0,
      target: Number(amount),
      icon: emoji,
    };
    onAddGoal(newGoal);
    setGoal("");
    setEmoji("💲");
    setAmount("");
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>New goal</h2>
      <p className="sub">What are you saving for?</p>
      <label>Goal name</label>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <label>Target amount</label>
      <input
        type="text"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button>Create Goal</Button>
    </form>
  );
}

function FormAddDeposit({ selectedGoal, onDeposit }) {
  const [deposit, setDeposit] = useState("");
  const remaining = selectedGoal.target - selectedGoal.saved;
  function handleSubmit(e) {
    e.preventDefault();
    if (!deposit) return;
    onDeposit(deposit);
    setDeposit("");
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{selectedGoal.name}</h2>
      <p className="sub">Add a deposit to this goal.</p>
      <div className="stats">
        <div className="stat">
          <small>Saved</small>
          <b>${selectedGoal.saved}</b>
        </div>
        <div className="stat">
          <small>Remaining</small>
          <b>${selectedGoal.target - selectedGoal.saved}</b>
        </div>
      </div>
      <label>Deposit amount</label>
      <input
        type="text"
        value={deposit}
        onChange={(e) =>
          setDeposit(
            Number(e.target.value) > remaining
              ? remaining
              : Number(e.target.value),
          )
        }
      />
      <Button>Add deposit</Button>
    </form>
  );
}
