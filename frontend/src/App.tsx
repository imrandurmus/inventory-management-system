import { useState } from "react";
import Landing from "./Landing";
import Login from "./Login";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return showLogin ? <Login onBack={() => setShowLogin(false)} /> : <Landing onSignIn={() => setShowLogin(true)} />;
}

export default App;
