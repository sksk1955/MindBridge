
import { SignIn } from '@clerk/clerk-react'

const Auth = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn routing="path" path="/sign-in" />
    </div>
  )
}

export default Auth
