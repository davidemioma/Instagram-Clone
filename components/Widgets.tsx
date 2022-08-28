import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AccountProps } from "../types";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Account from "./Account";

interface Props {
  displayName: string;
  profileUrl: string;
}

const Widgets = ({ displayName, profileUrl }: Props) => {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const [accounts, setAccounts] = useState<AccountProps[]>([]);

  const [followingIds, setFollowingIds] = useState([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "users", user.uid, "following"), (snapshot) =>
        setFollowingIds(snapshot.docs.map((doc) => doc.id))
      ),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...followingIds, user.uid])
        ),
        (snapshot) =>
          setAccounts(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db, followingIds]
  );

  return (
    <div className="hidden lg:inline w-[45%] py-7 pl-7">
      <div className="flex items-center space-x-3 my-4">
        {profileUrl && (
          <img
            className="w-12 h-12 object-cover rounded-full cursor-pointer"
            onClick={() => router.push(`/profile/${displayName}`)}
            loading="lazy"
            src={profileUrl}
            alt=""
          />
        )}

        {displayName && <p className="text-sm font-bold">{displayName}</p>}
      </div>

      {accounts.length > 0 && (
        <p className="text-gray-500 font-semibold">Suggestions for you</p>
      )}

      <div className="py-4 px-2">
        {accounts.slice(0, 5).map((account) => (
          <Account key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default Widgets;
