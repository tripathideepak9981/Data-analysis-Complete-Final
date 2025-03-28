
import { useState } from 'react'
import './App.css'
import CoustomerRoutes from './Components/CoustomerRoutes/CoustomerRoutes'
import ErrorBoundary from './HandleError/ErrorBoundary';


function App() {
  const [showChatPage, setShowChatPage] = useState(false);
  
  return (
  <>
  <ErrorBoundary>
   <CoustomerRoutes />
   </ErrorBoundary>
  </>
  )
}

export default App
