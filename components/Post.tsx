import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { PostProps, LikeProps, CommentProps } from "../types";
import Moment from "react-moment";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { setPost, setPostModalOpen } from "../store/store";
import { addComment, likePost, savePost } from "../util/functions";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import Likes from "./Likes";

interface Props {
  post: PostProps;
  displayName: string;
  profileUrl: string;
}

const Post = ({ post, displayName, profileUrl }: Props) => {
  const router = useRouter();

  const dispatch = useDispatch();

  const [user] = useAuthState(auth);

  const [likes, setLikes] = useState<LikeProps[]>([]);

  const [saved, setSaved] = useState<PostProps[]>([]);

  const [hasLiked, setHasLiked] = useState(false);

  const [hasSaved, setHasSaved] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [text, setText] = useState("");

  const [comments, setComments] = useState<CommentProps[]>([]);

  const openPostModal = () => {
    dispatch(setPost({ post: { ...post }, likes: [...likes] }));

    dispatch(setPostModalOpen(true));
  };

  const addCommentsHandler = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    await addComment(post.id, text, displayName, profileUrl)
      .then(() => {
        setIsLoading(false);

        setText("");
      })
      .catch((err) => {
        setIsLoading(false);

        alert(err.message);
      });
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", post.id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot: any) =>
          setComments(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", post.id, "likes"), (snapshot: any) =>
        setLikes(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      ),
    [db]
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
    [likes]
  );

  useEffect(
    () =>
      setHasSaved(saved?.findIndex((item: any) => item.id === post.id) !== -1),
    [saved]
  );

  return (
    <div className="bg-white shadow-sm w-full max-w-xl mx-auto border border-gray-300 rounded-xl">
      <div className="py-3 px-4">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push(`/profile/${post.displayName}`)}
        >
          <img
            className="w-7 h-7 rounded-full"
            loading="lazy"
            src={post.profileUrl}
            alt=""
          />

          <p className="text-sm font-semibold">{post.displayName}</p>
        </div>
      </div>

      <img
        className="w-full h-96 md:h-[450px] object-cover cursor-pointer"
        onClick={openPostModal}
        loading="lazy"
        src={post.postImgUrl}
        alt=""
      />

      <div className="py-3 px-4 space-y-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              likePost(hasLiked, post.id, user.uid, displayName, profileUrl)
            }
          >
            {hasLiked ? (
              <AiFillHeart size={25} className="on-hover text-red-500" />
            ) : (
              <AiOutlineHeart size={25} className="on-hover" />
            )}
          </button>

          <button className="flex-1" onClick={openPostModal}>
            <BiMessageRounded className="on-hover" size={25} />
          </button>

          <button onClick={() => savePost(hasSaved, user.uid, post.id, post)}>
            {hasSaved ? (
              <BsBookmarkFill size={22} className="on-hover" />
            ) : (
              <BsBookmark size={22} className="on-hover" />
            )}
          </button>
        </div>

        {likes.length > 0 && <Likes likes={likes} />}

        <div className="flex items-center space-x-1 text-sm">
          <p className="font-bold">{post.displayName}</p>

          <p>{post.caption}</p>
        </div>

        {comments.length > 0 && (
          <div className="space-y-2">
            {comments.length > 2 && (
              <p
                className="cursor-pointer text-sm text-gray-500"
                onClick={openPostModal}
              >
                View all {comments.length} comments
              </p>
            )}

            <div className="space-y-1.5">
              {comments.slice(0, 2).map((comment) => (
                <div
                  key={comment.id}
                  className="text-sm flex items-center space-x-1.5"
                >
                  <p className="font-bold">{comment.displayName}</p>

                  <p>{comment.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 uppercase tracking-wide">
          <Moment
            fromNow
            date={new Date(post?.timestamp?.seconds * 1000).toUTCString()}
          />
        </p>

        <form
          onSubmit={addCommentsHandler}
          className="flex items-center space-x-2 border-t pt-2"
        >
          <div className="flex-1 flex items-center space-x-2">
            <HiOutlineEmojiHappy size={20} />

            <input
              className="flex-1 outline-none"
              value={text}
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center text-[#458eff] disabled:text-gray-500 disabled:cursor-not-allowed font-bold"
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? (
              <div className="w-6 h-6 rounded-full border-b border-[#458eff] animate-spin" />
            ) : (
              <p>post</p>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
