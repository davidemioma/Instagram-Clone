import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDataSelector, userTextSelector } from "../store/user-slice";
import { XIcon } from "@heroicons/react/solid";
import { setText, setUserData, setUserModalOpen } from "../store/store";
import UserItem from "./UserItem";

const UserModal = () => {
  const dispatch = useDispatch();

  const userText = useSelector(userTextSelector);

  const userData = useSelector(userDataSelector);

  const closeModalHandler = () => {
    dispatch(setUserData(null));

    dispatch(setText(""));

    dispatch(setUserModalOpen(false));
  };

  return (
    <div className="fixed z-30 top-0 w-screen h-screen overflow-hidden">
      <div
        className="bg-black/50 absolute top-0 w-screen h-screen overflow-hidden z-40"
        onClick={closeModalHandler}
      />

      <div className="absolute w-[90%] max-w-md z-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="bg-white w-[90%] max-w-md mx-auto h-64 rounded-xl">
          <div className="flex items-center w-full h-12 border-b px-3 space-x-3">
            <div className="flex-1">
              <p className="text-center">{userText}</p>
            </div>

            <XIcon className="h-6 cursor-pointer" onClick={closeModalHandler} />
          </div>

          <div className="py-2 px-3 space-y-2 h-[calc(256px-48px)] overflow-x-hidden overflow-y-scroll scrollbar-hide">
            {userData.map((data) => (
              <UserItem key={data.id} account={data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
