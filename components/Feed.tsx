import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { PostProps } from "../types";
import Post from "./Post";

interface Props {
  displayName: string;
  profileUrl: string;
}

const Feed = ({ displayName, profileUrl }: Props) => {
  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot: any) =>
          setPosts(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db]
  );

  return (
    <div className="w-full lg:w-[55%] ">
      <div className="py-7 flex-col space-y-3">
        {posts?.map((post) => (
          <Post
            key={post.id}
            post={post}
            displayName={displayName}
            profileUrl={profileUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
