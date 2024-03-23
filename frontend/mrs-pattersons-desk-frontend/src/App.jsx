import { BrowserRouter } from "react-router-dom";
import { AuthWrapper } from "./auth/AuthWrapper";

function App() {
  return (
    <div className="row justify-content-center">
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>
    </div>
  )
}

export default App;