import Amplify, { API, Auth, graphqlOperation } from "aws-amplify"
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
import Sidebar from "./component/Sidebar/Sidebar"
import { listHeritages } from "./graphql/queries"
import { HeritageContext } from "./component/Helpers/Context"
import { Route } from "react-router"
import HeritageInput from "./component/HeritageInput"

Amplify.configure(awsconfig)

function App() {
  const [authState, setAuthState] = useState()
  const [user, setUser] = useState()
  const [heritages, setHeritages] = useState([])

  useEffect(() => {
    fetchHeritages()
  }, [])

  const fetchHeritages = async () => {
    try {
      const heritageData = await API.graphql(
        graphqlOperation(listHeritages, { limit: 500 })
      )
      const heritageList = heritageData.data.listHeritages.items.filter(
        function (place) {
          return place.uuid === 2
        }
      )

      setHeritages(heritageList)
    } catch (error) {
      console.log("error on fetching heritages", error)
    }
  }

  //Load the user information
  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState)
      setUser(authData)
    })
  }, [])
  console.log("heritages on the homepage", heritages)

  return authState === AuthState.SignedIn && user ? (
    <div className="App" id="App">
      <HeritageContext.Provider value={{ heritages, fetchHeritages }}>
        <div className="signOut">
          <div className="greeting">Hello, {user.attributes.email}</div>
          <button
            className="signoutBtn"
            onClick={() => {
              Auth.signOut()
            }}
          >
            Sign Out
          </button>
        </div>
        {/* map module */}
        <Route exact path="/test" component={HeritageInput}></Route>
        <Route exact path="/" component={Map}></Route>
      </HeritageContext.Provider>
    </div>
  ) : (
    // Sign up window
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
