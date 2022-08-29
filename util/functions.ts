import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { db } from "../firebase";
import { AccountProps, PostProps } from "../types";

export const addComment = async (
  postId: string,
  text: string,
  displayName: string,
  profileUrl: string
) => {
  await addDoc(collection(db, "posts", postId, "comments"), {
    comment: text,
    displayName,
    profileUrl,
    timestamp: serverTimestamp(),
  });
};

export const likePost = async (
  hasLiked: boolean,
  postId: string,
  userId: any,
  displayName: string,
  profileUrl: string
) => {
  if (hasLiked) {
    await deleteDoc(doc(db, "posts", postId, "likes", userId));
  } else {
    await setDoc(doc(db, "posts", postId, "likes", userId), {
      displayName,
      profileUrl,
    });
  }
};

export const savePost = async (
  hasSaved: boolean,
  userId: any,
  postId: string,
  post: PostProps
) => {
  if (hasSaved) {
    await deleteDoc(doc(db, "users", userId, "saved", postId));
  } else {
    await setDoc(doc(db, "users", userId, "saved", postId), {
      caption: post.caption,
      postImgUrl: post.postImgUrl,
      displayName: post.displayName,
      profileUrl: post.profileUrl,
      timestamp: serverTimestamp(),
    });
  }
};

export const followUser = async (
  isFollowing: boolean,
  account: AccountProps,
  user: AccountProps
) => {
  if (isFollowing) {
    await deleteDoc(doc(db, "users", user.id, "following", account.id));

    await deleteDoc(doc(db, "users", account.id, "followers", user.id));
  } else {
    await setDoc(
      doc(db, "users", user.id, "following", account.id),
      {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
        photoUrl: account.photoUrl,
        profileUrl: account.profileUrl,
        phoneNo: account.phoneNo,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );

    await setDoc(
      doc(db, "users", account.id, "followers", user.id),
      {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoUrl,
        profileUrl: user.profileUrl,
        phoneNo: user.phoneNo,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );

    await addDoc(collection(db, "users", account.id, "notifications"), {
      task: "follower",
      displayName: user.displayName,
      profileUrl: user.profileUrl,
      timestamp: serverTimestamp(),
    });
  }
};
