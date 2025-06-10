// import React from 'react'
import './App.css'
import './App2.css'
import { Navbar } from './components/Navbar'

import { LiquidProvider } from './context/liquid'
import { Liquid } from './routes/Liquid'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sheet } from './routes/Sheet'

function App() {
  return (
    <LiquidProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/liquid" element={<Liquid />} />
          <Route path="/liquid/sheet" element={<Sheet />} />
        </Routes>
      </BrowserRouter>
    </LiquidProvider>
  )
}
export default App