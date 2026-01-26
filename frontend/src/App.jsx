import { Routes, Route } from 'react-router-dom'
import Analyze from './pages/Analyze'
import Navbar from "./components/Navbar"
import Home from "./pages/Home"

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </>
  )
}
