import React, { useEffect, useState } from "react";
import { CommentProps, LikeProps, PostProps } from "../types";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import NumericLabel from "react-pretty-numbers";
import { option } from "../util/options";
import { db } from "../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { useDispatch } from "react-redux";
import { setPost, setPostModalOpen } from "../store/store";

interface Props {
  post: PostProps;
}

const PostByName = ({ post }: Props) => {
  const dispatch = useDispatch();

  const [likes, setLikes] = useState<LikeProps[]>([]);

  const [comments, setComments] = useState<CommentProps[]>([]);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", post.id, "likes"), (snapshot) =>
        setLikes(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      ),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", post.id, "comments"), (snapshot) =>
        setComments(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      ),
    [db]
  );

  const openPostModal = () => {
    dispatch(setPost({ post: { ...post }, likes: [...likes] }));

    dispatch(setPostModalOpen(true));
  };

  return (
    <div
      className="relative overflow-hidden h-36 md:h-56 lg:h-72 cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={openPostModal}
    >
      <img
        className="absolute top-0 w-full h-full object-cover"
        loading="lazy"
        src={post.postImgUrl}
        alt=""
      />

      {isHovering && (
        <div className="absolute z-10 top-0 w-full h-full bg-black/25" />
      )}

      {isHovering && (
        <div className="absolute z-20 text-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <div className="flex items-center space-x-10">
            <div className="flex items-center space-x-2">
              <AiFillHeart size={20} />

              {likes.length > 999 ? (
                <NumericLabel params={option}>{likes.length}</NumericLabel>
              ) : (
                <p>{likes.length}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <FaComment size={20} />

              {comments.length > 999 ? (
                <NumericLabel params={option}>{comments.length}</NumericLabel>
              ) : (
                <p>{comments.length}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostByName;
