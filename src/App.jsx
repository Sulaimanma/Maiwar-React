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
import { listHeritagess } from "./graphql/queries"
import { HeritageContext } from "./component/Helpers/Context"
import { Route } from "react-router"
import HeritageInput from "./component/HeritageInput"
import { Button } from "react-bootstrap"

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
        graphqlOperation(listHeritagess, { limit: 500 })
      )
      console.log(
        "heritages on the homepage!!!!!!!!!!!!!!!!!!!!!!!!!",
        heritageData
      )
      const heritageList = await heritageData.data.listHeritagess.items
      //   .filter(
      //   function (place) {
      //     return place.heritageType != "Burial"
      //   }
      // )

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
    console.log("user data", user)
  }, [])

  // console.log("heritages on the homepage!!!!!!!!!!!!!!!!!!!!!!!!!", heritages)

  // return authState === AuthState.SignedIn && user ? (
  return (
    <div className="App" id="App">
      <HeritageContext.Provider value={{ heritages, fetchHeritages }}>
        {/* <div className="signOut">
          <div className="greeting">Hello, {user.attributes.email}</div>
          <Button
            variant="secondary"
            size="sm"
            className="signoutBtn"
            onClick={() => {
              Auth.signOut()
            }}
          >
            Sign Out
          </Button>
        </div> */}
        {/* map module */}
        <Route exact path="/test" component={HeritageInput}></Route>
        <Route exact path="/" component={Map}></Route>
      </HeritageContext.Provider>
    </div>
  )
  // ) : (
  //   // Sign up window
  //   <AmplifyAuthenticator>
  //     <AmplifySignUp
  //       slot="sign-up"
  //       formFields={[
  //         { type: "username" },
  //         { type: "password" },
  //         { type: "email" },
  //       ]}
  //     />
  //   </AmplifyAuthenticator>
  // )
}

export default App
