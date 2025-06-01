// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

import Home from '@/pages/Home'
import Chat from '@/pages/Chat'
import Auth from './pages/Auth'


function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Home />} />

      {/* Protected Route */}
      <Route
        path="/chat"
        element={
          <>
            <SignedIn>
              <Chat />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* Auth Page (Optional if you're using Clerk default routes) */}
      <Route path="/sign-in" element={<Auth />} />

      {/* Catch all - optional */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
