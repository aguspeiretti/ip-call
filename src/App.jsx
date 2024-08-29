import CallButton from "./CallButton/CallButton";
import ReceiveCall from "./ReseiveCall/ReceiveCall";

function App() {
  return (
    <div className="App">
      <h1>Aplicación de llamadas IP</h1>
      <CallButton />
      <ReceiveCall />
    </div>
  );
}

export default App;
