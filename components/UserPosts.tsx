import React from "react";
import { PostProps } from "../types";
import EmptyPosts from "./EmptyPosts";
import PostByName from "./PostByName";

interface Props {
  posts: PostProps[];
}

const UserPosts = ({ posts }: Props) => {
  return (
    <div>
      {posts.length > 0 ? (
        <div className="w-full max-w-[calc(1024px-64px)] mx-auto">
          <div className="grid grid-cols-3 gap-1 sm:gap-5 md:gap-8">
            {posts?.map((post) => (
              <PostByName key={post.id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyPosts />
      )}
    </div>
  );
};

export default UserPosts;
