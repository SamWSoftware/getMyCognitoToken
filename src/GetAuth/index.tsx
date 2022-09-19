import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { useState } from "react";
import { useLocalState } from "../utils";
import { Profile } from "../App";

interface Props {
  region: string;
  userPoolId: string;
  userPoolClientId: string;
}

export const GetAuth = (props: Props) => {
  console.log("inside get auth");

  return (
    <div>
      <Authenticator>
        {({ signOut }) => <ShowToken {...props} signOut={signOut} />}
      </Authenticator>
    </div>
  );
};

const ShowToken = ({
  region,
  userPoolClientId,
  userPoolId,
  signOut,
}: Props & { signOut: (() => void) | undefined }) => {
  const [token, setToken] = useState("loading");

  setTimeout(async () => {
    const user = await Auth.currentSession();
    const token = user.getIdToken().getJwtToken();

    setToken(token);
  }, 2000);

  const [profileName, setProfileName] = useState("");
  const [profiles, setProfiles] = useLocalState<Record<string, Profile>>(
    "profiles",
    {}
  );

  const saveProfile = () => {
    const id = `${region}_${userPoolId}_${userPoolClientId}`;
    const newProfile: Profile = {
      id,
      name: profileName,
      region,
      userPoolClientId,
      userPoolId,
    };
    setProfiles({
      ...profiles,
      [id]: newProfile,
    });
  };

  const profileExists =
    profiles[`${region}_${userPoolId}_${userPoolClientId}`]?.name;

  return (
    <div className="getAuthContainer">
      <div>
        <h2>Login Details:</h2>
        {profileExists ? <div>Profile Name: {profileExists}</div> : null}
        <div>Region: {region}</div>
        <div>User Pool Id: {userPoolId}</div>
        <div>User Pool Client ID: {userPoolClientId}</div>
        <div>
          <label>
            {profileExists ? "Update Profile Name:" : "Save as a Profile:"}
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </label>
        </div>
        <button onClick={saveProfile}>
          {profileExists ? "Update Profile" : "Save Profile"}
        </button>
      </div>

      <div className="tokenContainer">
        <h2>Token:</h2>
        <div>{token}</div>
        <div>
          <button
            disabled={token == "loading"}
            onClick={() => {
              navigator.clipboard.writeText(token);
            }}
          >
            Copy to Clipboard
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              window.location.reload();
            }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              signOut && signOut();
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
