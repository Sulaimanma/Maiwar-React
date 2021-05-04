import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";

import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignOut,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { useEffect, useState } from "react";
import Map from "./component/Map";
import "./App.css";
import Sidebar from "./component/Sidebar/Sidebar";
import { listHeritages } from "./graphql/queries";

Amplify.configure(awsconfig);
function App() {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  const [heritages, setHeritages] = useState([]);

  useEffect(() => {
    fetchHeritages();
  }, []);

  const fetchHeritages = async () => {
    try {
      const heritageData = await API.graphql(graphqlOperation(listHeritages));
      const heritageList = heritageData.data.listHeritages.items;
      console.log("dataaaaaaaa", heritageData);
    } catch (error) {
      console.log("error on fetching heritages", error);
    }
  };

  //Load the user information
  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);
  console.log(user);

  return authState === AuthState.SignedIn && user ? (
    <div className="App" id="App">
      <div className="signOut">
        <div className="greeting">Hello, {user.attributes.email}</div>
        <button
          className="signoutBtn"
          onClick={() => {
            Auth.signOut();
          }}
        >
          Sign Out
        </button>
      </div>
      {/* map module */}
      <Map />
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
  );
}

export default App;