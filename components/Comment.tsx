import { useRouter } from "next/router";
import React from "react";
import { CommentProps } from "../types";
import Moment from "react-moment";

interface Props {
  comment: CommentProps;
  closeModalHandler: () => void;
}

const Comment = ({ comment, closeModalHandler }: Props) => {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-3 text-sm">
      <img
        className="w-8 h-8 object-cover cursor-pointer rounded-full"
        onClick={() => {
          closeModalHandler();

          router.push(`/profile/${comment?.displayName}`);
        }}
        loading="lazy"
        src={comment?.profileUrl}
        alt=""
      />

      <div>
        <p>
          <span className="font-bold">{comment?.displayName}</span>{" "}
          {comment?.comment}
        </p>

        <p className="text-xs text-gray-500">
          <Moment
            fromNow
            date={new Date(comment?.timestamp?.seconds * 1000).toUTCString()}
          />
        </p>
      </div>
    </div>
  );
};

export default Comment;
