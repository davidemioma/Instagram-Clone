import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { NotificationProps } from "../types";
import Moment from "react-moment";
import { useRouter } from "next/router";

const Notifications = () => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users", `${user?.uid}`, "notifications"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setNotifications(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [db]
  );

  return (
    <div className="modal z-10 h-80 w-[calc(100vw-80px)] max-w-lg mx-auto overflow-y-scroll scrollbar-hide overflow-x-hidden">
      {notifications.length > 0 ? (
        <div className="p-2 sm:p-3 space-y-2">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push(`/profile/${item.displayName}`)}
            >
              <img
                className="w-7 h-7 rounded-full cursor-pointer"
                loading="lazy"
                src={item.profileUrl}
                alt=""
              />

              <p className="flex-1 text-xs sm:text-sm font-light">
                <span className="font-bold">{item.displayName}</span>{" "}
                {item.task === "follower"
                  ? "started following you"
                  : "likes your post"}
              </p>

              <p className="text-xs sm:text-sm">
                <Moment
                  fromNow
                  date={new Date(item?.timestamp?.seconds * 1000).toUTCString()}
                />
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center p-3">No New Notification!</p>
      )}
    </div>
  );
};

export default Notifications;
