import React, { useEffect, useState } from "react";

import "./App.css";
import { GetAuth } from "./GetAuth";
import { useLocalState } from "./utils";

export interface Profile {
  id: string;
  name: string;
  region: string;
  userPoolId: string;
  userPoolClientId: string;
}

function App() {
  const [region, setRegion] = useLocalState<string>("region", "");
  const [userPoolId, setUserPoolId] = useLocalState<string>("userPoolId", "");
  const [userPoolClientId, setUserPoolClientId] = useLocalState<string>(
    "userPoolClientId",
    ""
  );
  const [profiles, setProfiles] = useLocalState<Record<string, Profile>>(
    "profiles",
    {}
  );
  const [selectedProfile, setSelectedProfile] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [jumpToLogin, setJumpToLogin] = useLocalState("jumpToLogin", false);

  const doAuth = () => {
    if (!region || !userPoolId || !userPoolClientId) {
      return;
    }
    setJumpToLogin(true);
    window.location.reload();
  };

  useEffect(() => {
    if (jumpToLogin) {
      setShowLogin(true);
      setJumpToLogin(false);
    }
  }, []);

  const chooseProfile = (profileId: string) => {
    setSelectedProfile(profileId);
    const { region, userPoolId, userPoolClientId } = profiles[
      profileId
    ] as Profile;
    setRegion(region);
    setUserPoolId(userPoolId);
    setUserPoolClientId(userPoolClientId);
  };

  return (
    <div className="App">
      {!showLogin ? (
        <div className="userPoolSelection">
          {Object.values(profiles).length !== 0 ? (
            <div>
              <div>
                You've got some saved profiles. Choose a profile to insert the
                details.
              </div>
              <label>Choose a saved profile:</label>
              <select
                name="selectedProfile"
                id="selectedProfile"
                value={selectedProfile}
                onChange={(e) => chooseProfile(e.target.value)}
              >
                <option></option>
                {Object.values(profiles).map((profileData) => {
                  return (
                    <option value={profileData.id}>{profileData.name}</option>
                  );
                })}
              </select>
            </div>
          ) : null}
          <form className="options">
            <div>
              <label>Choose a region:</label>
              <select
                name="region"
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="us-east-2">us-east-2</option>
                <option value="us-east-1">us-east-1 </option>
                <option value="us-west-1">us-west-1</option>
                <option value="us-west-2">us-west-2</option>
                <option value="af-south-1">af-south-1</option>
                <option value="ap-east-1">ap-east-1</option>
                <option value="ap-southeast-3">ap-southeast-3</option>
                <option value="ap-south-1">ap-south-1</option>
                <option value="ap-northeast-3">ap-northeast-3</option>
                <option value="ap-northeast-2">ap-northeast-2</option>
                <option value="ap-southeast-1">ap-southeast-1</option>
                <option value="ap-southeast-2">ap-southeast-2</option>
                <option value="ap-northeast-1">ap-northeast-1</option>
                <option value="ca-central-1">ca-central-1</option>
                <option value="eu-central-1">eu-central-1</option>
                <option value="eu-west-1">eu-west-1</option>
                <option value="eu-west-2">eu-west-2</option>
                <option value="eu-south-1">eu-south-1</option>
                <option value="eu-west-3">eu-west-3</option>
                <option value="eu-north-1">eu-north-1</option>
                <option value="me-south-1">me-south-1</option>
                <option value="me-central-1">me-central-1</option>
                <option value="sa-east-1">sa-east-1</option>
              </select>
            </div>
            <div>
              <label>
                User Pool ID:
                <input
                  type="text"
                  value={userPoolId}
                  onChange={(e) => setUserPoolId(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                User Pool Client ID:
                <input
                  type="text"
                  value={userPoolClientId}
                  onChange={(e) => setUserPoolClientId(e.target.value)}
                />
              </label>
            </div>
            <div>
              <button
                disabled={!(userPoolId && userPoolClientId && region)}
                onClick={doAuth}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <GetAuth
          region={region}
          userPoolId={userPoolId}
          userPoolClientId={userPoolClientId}
        />
      )}
    </div>
  );
}

export default App;
