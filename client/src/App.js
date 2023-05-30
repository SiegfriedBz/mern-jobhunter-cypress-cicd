import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAppContext, useUserContext } from './contextAPI/context'
import { Home, Register, About, Error } from './pages'
import { SharedLayout, AddJob, AllJobs, Profile, Stats } from './pages/dashboard'
import { ProtectedRoute, Header, Logo, FormRow, FlashMessage, Navbar, Footer } from './components'

const App = () => {

    const { token } = useUserContext()
    // const { flash } = useAppContext()

    return (
        <div
            data-bs-theme='light'
            id='app'
        >
            <Router>
                <Header />
                {/*{ flash && flash.showFlash && <FlashMessage /> }*/}
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/dashboard' element={
                        <ProtectedRoute>
                            <SharedLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Stats />} />
                        <Route path='profile' element={<Profile />} />
                        <Route path='add-job' element={<AddJob />} />
                        <Route path='all-jobs' element={<AllJobs />} />
                    </Route>
                    <Route path='/register' element={<Register />} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<Error />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
