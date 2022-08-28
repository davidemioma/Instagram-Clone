import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "@firebase/firestore";
import Header from "../components/Header";
import Feed from "../components/Feed";
import Widgets from "../components/Widgets";
import { AccountProps } from "../types";
import Modal from "../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { modalSelector, postModalSelector } from "../store/ui-slice";
import PostModal from "../components/PostModal";
import { setView } from "../store/store";

const Home = () => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const [account, setAccount] = useState<AccountProps>();

  const modalOpen = useSelector(modalSelector);

  const postModalOpen = useSelector(postModalSelector);

  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${user?.uid}`), (snapshot: any) => {
        if (!snapshot.exists()) {
          router.push("/account");
        } else {
          setAccount({
            id: snapshot.id,
            ...snapshot.data(),
          });

          dispatch(setView("posts"));
        }
      }),
    [db]
  );

  return (
    <div
      className={`bg-gray-50 w-screen h-screen overflow-y-scroll ${
        postModalOpen && "overflow-hidden"
      } ${modalOpen && "overflow-hidden"}`}
    >
      <Head>
        <title>Home - Instagram</title>

        <link rel="icon" href="/logo.webp" />
      </Head>

      {account && (
        <Header
          displayName={`${account?.displayName}`}
          profileUrl={`${account?.profileUrl}`}
        />
      )}

      {account && (
        <main className="flex px-6 md:px-8 max-w-4xl mx-auto">
          <Feed
            displayName={`${account?.displayName}`}
            profileUrl={`${account?.profileUrl}`}
          />

          <Widgets
            displayName={`${account?.displayName}`}
            profileUrl={`${account?.profileUrl}`}
          />
        </main>
      )}

      {modalOpen && (
        <Modal
          displayName={`${account?.displayName}`}
          profileUrl={`${account?.profileUrl}`}
        />
      )}

      {postModalOpen && (
        <PostModal
          displayName={`${account?.displayName}`}
          profileUrl={`${account?.profileUrl}`}
        />
      )}
    </div>
  );
};

export default Home;
