import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPostModalOpen } from "../store/store";
import { postSelector } from "../store/ui-slice";
import Moment from "react-moment";
import { CommentProps } from "../types";
import Comment from "./Comment";
import PostModalBtm from "./PostModalBtm";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";

interface Props {
  displayName: string;
  profileUrl: string;
}

const PostModal = ({ displayName, profileUrl }: Props) => {
  const router = useRouter();

  const dispatch = useDispatch();

  const post = useSelector(postSelector);

  const [comments, setComments] = useState<CommentProps[]>([]);

  const closeModalHandler = () => {
    dispatch(setPost(null));

    dispatch(setPostModalOpen(false));
  };

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", post?.post?.id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot: any) =>
          setComments(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db, post?.post?.id]
  );

  return (
    <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-black/50">
      <BiX
        className="absolute z-50 top-3 right-5 cursor-pointer"
        onClick={closeModalHandler}
        size={35}
        color="white"
      />

      <div className="absolute z-50 top-10 left-1/2 -translate-x-1/2 w-screen h-screen">
        <div className="bg-white w-[80%] sm:w-[60%] md:w-1/2 lg:w-[85%] h-[90%] max-w-5xl mx-auto rounded overflow-hidden">
          <div className="hidden lg:inline-flex w-full h-full">
            <img
              className="h-full w-1/2 object-cover"
              loading="lazy"
              src={post?.post.postImgUrl}
              alt=""
            />

            <div className="w-1/2 h-full relative overflow-hidden">
              <div className="flex px-4 h-16 items-center space-x-2 border-b">
                <img
                  className="w-8 h-8 object-cover cursor-pointer rounded-full"
                  onClick={() => {
                    closeModalHandler();

                    router.push(`/profile/${post?.post?.displayName}`);
                  }}
                  loading="lazy"
                  src={post?.post.profileUrl}
                  alt=""
                />

                <p className="text-sm font-bold">{post?.post.displayName}</p>
              </div>

              <div className="flex items-center space-x-3 p-4 text-sm">
                <img
                  className="w-8 h-8 object-cover cursor-pointer rounded-full"
                  onClick={() => {
                    closeModalHandler();

                    router.push(`/profile/${post?.post.displayName}`);
                  }}
                  loading="lazy"
                  src={post?.post.profileUrl}
                  alt=""
                />

                <div>
                  <p>
                    <span className="font-bold">{post?.post.displayName}</span>{" "}
                    {post?.post.caption}
                  </p>

                  <p className="text-gray-500 text-xs">
                    Edited.{" "}
                    <Moment
                      fromNow
                      date={new Date(
                        post?.post?.timestamp?.seconds * 1000
                      ).toUTCString()}
                    />
                  </p>
                </div>
              </div>

              <div className="p-6 pt-2 space-y-3 h-[500px] overflow-y-scroll scrollbar-hide">
                {comments.map((comment: CommentProps, i: number) => (
                  <Comment
                    key={1}
                    comment={comment}
                    closeModalHandler={closeModalHandler}
                  />
                ))}
              </div>

              <div className="absolute bottom-0 w-full">
                <PostModalBtm
                  displayName={displayName}
                  profileUrl={profileUrl}
                />
              </div>
            </div>
          </div>

          <div className="lg:hidden relative h-full">
            <div className="flex px-4 h-16 items-center space-x-2">
              <img
                className="w-8 h-8 object-cover cursor-pointer rounded-full"
                onClick={() => {
                  closeModalHandler();

                  router.push(`/profile/${post?.post.displayName}`);
                }}
                loading="lazy"
                src={post?.post.profileUrl}
                alt=""
              />

              <p className="text-sm font-bold">{post?.post.displayName}</p>
            </div>

            <img
              className="w-full object-cover h-[calc(100%-64px)]"
              loading="lazy"
              src={post?.post.postImgUrl}
              alt=""
            />

            <div className="absolute bottom-0 w-full">
              <PostModalBtm displayName={displayName} profileUrl={profileUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
