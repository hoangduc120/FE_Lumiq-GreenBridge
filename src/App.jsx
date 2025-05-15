import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './mainPage/homePage'
import LoginPage from './mainPage/Login'
import { Slide, ToastContainer } from 'react-toastify'

function App() {
  return (
    <div className='w-screen min-h-screen h-auto relative dark:bg-[#121212]'>
      <ToastContainer
        transition={Slide}
        autoClose={2000}
        newestOnTop={true}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        limit={5}
      />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
