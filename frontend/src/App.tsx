// import React from 'react'
import './App.css'
import './App2.css'

import { Preview } from './components/Preview'
import { Inputs } from './components/Inputs'
import { LiquidProvider } from './context/liquid'

function App() {
  return (
    <LiquidProvider>
      <Inputs />
      <Preview />
    </LiquidProvider>
  )
}
export default App