import { collection, doc, onSnapshot } from "@firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { AccountProps } from "../types";
import { followUser } from "../util/functions";

interface Props {
  account: AccountProps;
}

const Account = ({ account }: Props) => {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const [myAccount, setMyAccount] = useState<AccountProps>();

  const [following, setFollowing] = useState<AccountProps[]>([]);

  const [isFollowing, setIsFollowing] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  //Fetch current user's data
  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${user?.uid}`), (snapshot: any) =>
        setMyAccount({
          id: snapshot.id,
          ...snapshot.data(),
        })
      ),
    [db]
  );

  //Function to follow a user
  const onClickHandler = async () => {
    if (!myAccount) return;

    setIsLoading(true);

    await followUser(isFollowing, account, myAccount)
      .then(() => setIsLoading(false))
      .catch((err) => alert(err.message));
  };

  //Fetching the current user following
  useEffect(
    () =>
      onSnapshot(collection(db, "users", user?.uid, "following"), (snapshot) =>
        setFollowing(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      ),
    [db]
  );

  //Checking to see if the current user is currently following the searched accounts
  useEffect(
    () =>
      setIsFollowing(
        following.findIndex((item) => item.id === account.id) !== -1
      ),
    [following]
  );

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center space-x-3">
        <img
          className="w-10 h-10 object-cover cursor-pointer rounded-full"
          onClick={() => router.push(`/profile/${account.displayName}`)}
          loading="lazy"
          src={account.profileUrl}
          alt=""
        />

        <p className="font-bold">{account.displayName}</p>
      </div>

      <button
        className="text-[#458eff] disabled:cursor-not-allowed font-bold flex items-center justify-center"
        onClick={onClickHandler}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="w-7 h-7 rounded-full border-b border-[#458eff]" />
        ) : (
          <p>Follow</p>
        )}
      </button>
    </div>
  );
};

export default Account;
