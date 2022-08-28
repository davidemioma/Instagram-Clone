import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postSelector } from "../store/ui-slice";
import { LikeProps, PostProps } from "../types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { addComment, likePost, savePost } from "../util/functions";
import Likes from "./Likes";
import Moment from "react-moment";
import { collection, onSnapshot } from "@firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  displayName: string;
  profileUrl: string;
}

const PostModalBtm = ({ displayName, profileUrl }: Props) => {
  const post = useSelector(postSelector);

  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState<LikeProps[]>([]);

  const [saved, setSaved] = useState<PostProps[]>([]);

  const [hasLiked, setHasLiked] = useState(false);

  const [hasSaved, setHasSaved] = useState(false);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  const addCommentHandler = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    await addComment(post?.post?.id, text, displayName, profileUrl)
      .then(() => {
        setLoading(false);

        setText("");
      })
      .catch((err) => {
        setLoading(false);

        alert(err.message);
      });
  };

  useEffect(
    () =>
      onSnapshot(
        collection(db, "posts", post.post.id, "likes"),
        (snapshot: any) =>
          setLikes(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db, post.post.id]
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${user?.uid}`, "saved"),
        (snapshot: any) =>
          setSaved(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db]
  );

  useEffect(
    () =>
      setHasLiked(
        likes?.findIndex(
          (item: any) => item?.displayName === user?.displayName
        ) !== -1
      ),
    [db, likes]
  );

  useEffect(
    () =>
      setHasSaved(
        saved?.findIndex((item: any) => item.id === post.post.id) !== -1
      ),
    [db, saved, post.post.id]
  );

  return (
    <div className="bg-white border-t">
      <div className="flex items-center space-x-3 w-full p-3 pb-2">
        <button
          onClick={() =>
            likePost(hasLiked, post.post.id, user?.uid, displayName, profileUrl)
          }
        >
          {hasLiked ? (
            <AiFillHeart size={25} className="on-hover text-red-500" />
          ) : (
            <AiOutlineHeart size={25} className="on-hover" />
          )}
        </button>

        <button className="flex-1">
          <BiMessageRounded className="on-hover" size={25} />
        </button>

        <button
          onClick={() => savePost(hasSaved, user?.uid, post.post.id, post.post)}
        >
          {hasSaved ? (
            <BsBookmarkFill size={22} className="on-hover" />
          ) : (
            <BsBookmark size={22} className="on-hover" />
          )}
        </button>
      </div>

      {post.likes.length > 0 && (
        <div className="px-3 pb-1">
          <Likes likes={post?.likes} />
        </div>
      )}

      <p className="ml-3 pb-3 lg:pb-0 lg:mb-1 text-xs text-gray-500 uppercase tracking-wide">
        <Moment
          fromNow
          date={new Date(post?.post?.timestamp?.seconds * 1000).toUTCString()}
        />
      </p>

      <form
        onSubmit={addCommentHandler}
        className="hidden w-full lg:inline-flex items-center space-x-2 border-t p-3"
      >
        <HiOutlineEmojiHappy size={20} />

        <input
          className="flex-1 outline-none"
          value={text}
          type="text"
          placeholder="Add a comment..."
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="flex items-center justify-center text-[#458eff] disabled:text-gray-500 disabled:cursor-not-allowed font-bold"
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <div className="w-6 h-6 rounded-full border-b border-[#458eff] animate-spin" />
          ) : (
            <p>post</p>
          )}
        </button>
      </form>
    </div>
  );
};

export default PostModalBtm;
