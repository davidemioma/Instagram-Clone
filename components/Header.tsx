import React, { useState } from "react";
import { signOut } from "@firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import {
  AiOutlinePlus,
  AiFillHome,
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { VscBookmark } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { setModalOpen, setView } from "../store/store";
import Notifications from "./Notifications";

interface Props {
  profileUrl: string;
  displayName: string;
}

const Header = ({ profileUrl, displayName }: Props) => {
  const router = useRouter();

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);

  const [openNotification, setOpenNotification] = useState(false);

  return (
    <header className="h-16 sticky top-0 z-20 shadow-md bg-gray-50 flex items-center">
      <div className="w-full max-w-5xl mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between">
          <img
            className="object-contain cursor-pointer w-24 sm:w-32"
            onClick={() => router.push("/")}
            loading="lazy"
            src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
            alt=""
          />

          <div className="flex items-center space-x-4">
            <AiFillHome
              className="on-hover text-xl sm:text-2xl"
              onClick={() => router.push("/")}
            />

            <button
              onClick={() => dispatch(setModalOpen(true))}
              className="flex w-6 h-6 text-xl rounded-lg items-center justify-center border-2 border-black on-hover"
            >
              <AiOutlinePlus />
            </button>

            <div className="relative">
              <button
                className="on-hover mt-1.5"
                onClick={() => {
                  setOpenNotification((prev) => !prev);

                  setOpenModal(false);
                }}
              >
                {openNotification ? (
                  <AiFillHeart size={25} />
                ) : (
                  <AiOutlineHeart size={25} />
                )}
              </button>

              {openNotification && <Notifications />}
            </div>

            <div className="relative">
              <img
                className={`${
                  openModal && "border-2 border-gray-500"
                } w-6 h-6 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200`}
                onClick={() => {
                  setOpenModal((prev) => !prev);

                  setOpenNotification(false);
                }}
                loading="lazy"
                src={profileUrl}
                alt=""
              />

              {openModal && (
                <div className="modal">
                  <div>
                    <div
                      className="options"
                      onClick={() => {
                        dispatch(setView("posts"));

                        router.push(`/profile/${displayName}`);

                        setOpenModal(false);
                      }}
                    >
                      <CgProfile />

                      <p className="text-sm">Profile</p>
                    </div>

                    <div
                      className="options"
                      onClick={() => {
                        dispatch(setView("saved"));

                        router.push(`/profile/${displayName}`);

                        setOpenModal(false);
                      }}
                    >
                      <VscBookmark />

                      <p className="text-sm">Saved</p>
                    </div>
                  </div>

                  <button
                    className="w-full border-t py-2 px-4 text-left text-sm hover:bg-gray-100"
                    onClick={() => signOut(auth).then(() => router.push("/"))}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
