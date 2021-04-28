import Amplify, { Auth } from "aws-amplify"
import awsconfig from "./aws-exports"

import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignOut,
} from "@aws-amplify/ui-react"
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components"
import { useEffect, useState } from "react"
import Map from "./component/Map"
import "./App.css"
Amplify.configure(awsconfig)
function App() {
  const [authState, setAuthState] = useState()
  const [user, setUser] = useState()
  //user information
  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState)
      setUser(authData)
    })
  }, [])
  console.log(user)

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <div className="signOut">
        <div className="greeting">Hello, {user.attributes.email}</div>
        <button
          className="signoutBtn"
          onClick={() => {
            Auth.signOut()
          }}
        >
          Sigo Out
        </button>
      </div>

      <Map />
    </div>
  ) : (
    <AmplifyAuthenticator>
      <AmplifySignUp
        slot="sign-up"
        formFields={[
          { type: "username" },
          { type: "password" },
          { type: "email" },
        ]}
      />
    </AmplifyAuthenticator>
  )
}

export default App
