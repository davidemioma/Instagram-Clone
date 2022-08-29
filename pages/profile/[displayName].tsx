import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { useRouter } from "next/router";
import { AccountProps, PostProps } from "../../types";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  modalSelector,
  postModalSelector,
  viewSelector,
} from "../../store/ui-slice";
import { setUserModalOpen, setUserData, setText } from "../../store/store";
import { userModalSelector } from "../../store/user-slice";
import { BsGrid3X3, BsBookmark } from "react-icons/bs";
import { ImUserCheck } from "react-icons/im";
import { setView } from "../../store/store";
import UserPosts from "../../components/UserPosts";
import SavedPosts from "../../components/SavedPosts";
import PostModal from "../../components/PostModal";
import Modal from "../../components/Modal";
import { numberFormatter } from "../../util/options";
import { followUser } from "../../util/functions";
import Number from "../../components/Number";
import UserModal from "../../components/UserModal";

const Profile = () => {
  const dispatch = useDispatch();

  const [user] = useAuthState(auth);

  const router = useRouter();

  const { displayName } = router.query;

  const view = useSelector(viewSelector);

  const postModalOpen = useSelector(postModalSelector);

  const modalOpen = useSelector(modalSelector);

  const userModalOpen = useSelector(userModalSelector);

  const [myAccount, setMyAccount] = useState<AccountProps>();

  const [account, setAccount] = useState<AccountProps>();

  const [posts, setPosts] = useState<PostProps[]>([]);

  const [savedPosts, setSavedPosts] = useState<PostProps[]>([]);

  const [Followers, setFollowers] = useState([]);

  const [following, setFollowing] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);

  const [loading, setLoading] = useState(false);

  //Follow and Unfollow a user
  const onClickHandler = async () => {
    if (!account || !myAccount) return;

    setLoading(true);

    await followUser(isFollowing, account, myAccount)
      .then(() => setLoading(false))
      .catch((err) => alert(err.message));
  };

  //Show the list of followers and followings.
  const showUsersData = (data: any, text: string) => {
    dispatch(setUserData(data));

    dispatch(setText(text));

    dispatch(setUserModalOpen(true));
  };

  //Set The view to posts
  useEffect(() => {
    if (displayName !== user?.displayName) {
      dispatch(setView("posts"));
    }
  }, [displayName]);

  //Fetch current user's data
  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${user?.uid}`), (snapshot: any) => {
        if (!snapshot.exists()) {
          router.push("/account");
        } else {
          setMyAccount({
            id: snapshot.id,
            ...snapshot.data(),
          });
        }
      }),
    [db]
  );

  //Fetch Searched user's data
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users"), where("displayName", "==", displayName)),
        (snapshot: any) =>
          setAccount({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() })
      ),
    [db, displayName]
  );

  //Fetch Searched user's posts
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), where("displayName", "==", displayName)),
        (snapshot) =>
          setPosts(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db, displayName]
  );

  //Fetch current user's saved posts
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users", `${user?.uid}`, "saved"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setSavedPosts(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db, displayName]
  );

  //Fetch Searched user's followers
  useEffect(() => {
    if (account) {
      const unSub = onSnapshot(
        collection(db, "users", account?.id, "followers"),
        (snapshot) =>
          setFollowers(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      );

      return unSub;
    }
  }, [db, account]);

  //Fetch Searched user's following
  useEffect(() => {
    if (account) {
      const unSub = onSnapshot(
        collection(db, "users", account?.id, "following"),
        (snapshot) =>
          setFollowing(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      );

      return unSub;
    }
  }, [db, account]);

  //Check if current user is following searched user
  useEffect(() => {
    if (account && user?.uid !== account?.id) {
      setIsFollowing(
        Followers.findIndex((item) => item.id === user.uid) !== -1
      );
    }
  }, [Followers, displayName]);

  return (
    <div
      className={`bg-gray-50 w-screen h-screen overflow-y-scroll ${
        postModalOpen && "overflow-hidden"
      } ${modalOpen && "overflow-hidden"} ${
        userModalOpen && "overflow-hidden"
      }`}
    >
      <Head>
        <title>@{displayName} - Profile</title>

        <link rel="icon" href="/logo.webp" />
      </Head>

      <Header
        displayName={myAccount?.displayName}
        profileUrl={myAccount?.profileUrl}
      />

      <main>
        <div className="flex items-center space-x-5 md:space-x-10 py-6 sm:py-8 px-5 mx-auto max-w-3xl">
          <img
            className="w-20 h-20 md:w-32 md:h-32 object-cover border-2 border-gray-400 rounded-full"
            loading="lazy"
            src={account?.profileUrl}
            alt=""
          />

          <div className="flex-1">
            <div className="flex items-center space-x-5 mb-4">
              <h1 className="text-2xl font-light">{account?.displayName}</h1>

              {user.displayName !== displayName && (
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

            <div className="hidden sm:inline-flex items-center space-x-5 md:space-x-8">
              <Number data={posts} text="Post" isFollower />

              <div
                className="cursor-pointer"
                onClick={() => showUsersData(Followers, "Followers")}
              >
                <Number data={Followers} text="Follower" isFollower />
              </div>

              <div
                className="cursor-pointer"
                onClick={() => showUsersData(following, "Following")}
              >
                <Number data={following} text="Following" />
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden grid grid-cols-3 justify-items-center w-full border-t border-gray-300 p-3">
          <div className="flex flex-col items-center">
            <div className="font-bold">
              {posts.length > 999 ? (
                <p>{numberFormatter(posts.length)}</p>
              ) : (
                <p>{posts.length}</p>
              )}
            </div>

            <p className="text-gray-500">Post{posts.length > 1 && "s"}</p>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => showUsersData(Followers, "Followers")}
          >
            <div className="font-bold">
              {Followers.length > 999 ? (
                <p>{numberFormatter(Followers.length)}</p>
              ) : (
                <p>{Followers.length}</p>
              )}
            </div>

            <p className="text-gray-500">
              Follower{Followers.length > 1 && "s"}
            </p>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => showUsersData(following, "Following")}
          >
            <div className="font-bold">
              {following.length > 999 ? (
                <p>{numberFormatter(following.length)}</p>
              ) : (
                <p>{following.length}</p>
              )}
            </div>

            <p className="text-gray-500">Following</p>
          </div>
        </div>

        <div className="w-full max-w-[calc(1024px-64px)] mx-auto border-t border-gray-300">
          <div className="flex items-center justify-center space-x-20 px-4 max-w-sm mx-auto">
            <button
              onClick={() => dispatch(setView("posts"))}
              className={`${
                view === "posts" && "border-t-2 border-black"
              } profileBtn`}
            >
              <BsGrid3X3 className="text-xs" />

              <p>Posts</p>
            </button>

            {user.displayName === displayName && (
              <button
                onClick={() => dispatch(setView("saved"))}
                className={`${
                  view === "saved" && "border-t-2 border-black"
                } profileBtn`}
              >
                <BsBookmark className="text-xs" />

                <p>Saved</p>
              </button>
            )}
          </div>
        </div>

        <div>
          {view === "posts" ? (
            <UserPosts posts={posts} />
          ) : (
            <div>
              {user.displayName === displayName && (
                <SavedPosts posts={savedPosts} />
              )}
            </div>
          )}
        </div>
      </main>

      {modalOpen && (
        <Modal
          displayName={`${myAccount?.displayName}`}
          profileUrl={`${myAccount?.profileUrl}`}
        />
      )}

      {postModalOpen && (
        <PostModal
          displayName={myAccount.displayName}
          profileUrl={myAccount.profileUrl}
        />
      )}

      {userModalOpen && <UserModal />}
    </div>
  );
};

export default Profile;
