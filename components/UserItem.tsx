import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { AccountProps } from "../types";
import { ImUserCheck } from "react-icons/im";
import { collection, doc, onSnapshot, query, where } from "@firebase/firestore";
import { followUser } from "../util/functions";

interface Props {
  account: AccountProps;
}

const UserItem = ({ account }: Props) => {
  const [user] = useAuthState(auth);

  const [myAccount, setMyAccount] = useState<AccountProps>();

  const [loading, setLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);

  const onClickHandler = async () => {
    setLoading(true);

    await followUser(isFollowing, account, myAccount)
      .then(() => setLoading(true))
      .catch((err) => alert(err.message));
  };

  //Fetch current user's data
  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${user.uid}`), (snapshot: any) =>
        setMyAccount({
          id: snapshot.id,
          ...snapshot.data(),
        })
      ),
    [db]
  );

  //Check if current user is following this account
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users", account.id, "followers"),
          where("id", "==", user.uid)
        ),
        (snapshot) => {
          if (snapshot.docs.length > 0) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        }
      ),
    [db]
  );

  return (
    <>
      {account && (
        <div className="flex items-center space-x-3">
          <img
            className="w-8 h-8 rounded-full"
            src={account?.profileUrl}
            alt=""
          />

          <p className="flex-1 text-sm font-semibold">{account.displayName}</p>

          {user.uid !== account.id && (
            <button
              className={`${
                isFollowing ? "unfollowBtn" : "followBtn"
              } disabled:cursor-not-allowed`}
              onClick={onClickHandler}
              disabled={loading}
            >
              {isFollowing ? <ImUserCheck size={20} /> : <p>Follow</p>}
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default UserItem;
