import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home, Register, About, Error } from './pages'
import {
  SharedLayout,
  AddJob,
  AllJobs,
  Profile,
  Stats,
} from './pages/dashboard'
import ProtectedRoute from './components/utils/ProtectedRoute'
import Header from './components/layout/Header'

const App = () => {
  return (
    <div data-bs-theme="light" id="app">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-job" element={<AddJob />} />
            <Route path="all-jobs" element={<AllJobs />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
