import { useRouter } from "next/router";
import React from "react";
import { LikeProps } from "../types";
import NumberFormat from "react-number-format";

interface Props {
  likes: LikeProps[];
}

const Likes = ({ likes }: Props) => {
  const router = useRouter();

  return (
    <div className="flex text-sm items-center space-x-1">
      <img
        className="w-6 h-6 rounded-full cursor-pointer"
        onClick={() => router.push(`/profile/${likes[0]?.displayName}`)}
        loading="lazy"
        src={likes[0]?.profileUrl}
        alt=""
      />

      <p>
        Liked by <span className="font-bold">{likes[0]?.displayName}</span>
      </p>

      {likes?.length > 1 && (
        <div className="hidden sm:inline">
          {likes?.length > 2 ? (
            <p>
              and{" "}
              <span className="font-bold">
                <NumberFormat
                  value={likes?.length - 1}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={""}
                />{" "}
                others
              </span>
            </p>
          ) : (
            <p>
              and <span className="font-bold">{likes[1]?.displayName}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Likes;
