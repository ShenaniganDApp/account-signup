import { useSession } from "next-auth/react"


function Auth({ children }) {
  const { data: session, status } = useSession({required: true})
  const isUser = !!session?.user


  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

export default Auth