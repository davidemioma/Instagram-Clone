import React, { useRef, useState } from "react";
import { BiX } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setModalOpen } from "../store/store";
import { BsArrowLeft } from "react-icons/bs";
import Svg from "./Svg";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { auth, db, storage } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";

interface Props {
  displayName: string;
  profileUrl: string;
}

const Modal = ({ displayName, profileUrl }: Props) => {
  const dispatch = useDispatch();

  const [user] = useAuthState(auth);

  const [loading, setLoading] = useState(false);

  const [seletedFile, setSelectedFile] = useState<
    string | ArrayBuffer | null | undefined
  >(null);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);

  const [caption, setCaption] = useState("");

  const uploadImageHandler = (e: React.FormEvent) => {
    const reader = new FileReader();

    const file = (e.target as HTMLFormElement).files[0];

    reader.readAsDataURL(file);

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target?.result);
    };
  };

  const sharePostHandler = async () => {
    const exit = () => {
      setLoading(false);

      setSelectedFile(null);

      setCaption("");

      dispatch(setModalOpen(false));
    };

    setLoading(true);

    const imageRef = ref(storage, `posts/${user?.uid}/images`);

    await uploadString(imageRef, `${seletedFile}`, "data_url").then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef);

        await addDoc(collection(db, "posts"), {
          caption,
          postImgUrl: downloadUrl,
          displayName,
          profileUrl,
          timestamp: serverTimestamp(),
        })
          .then(() => {
            exit();
          })
          .catch((err: any) => {
            exit();

            alert(err.message);
          });
      }
    );
  };

  return (
    <div className="fixed z-40 top-0 left-0 w-screen h-screen bg-black/50">
      <BiX
        className="absolute z-50 top-3 right-5 cursor-pointer"
        onClick={() => dispatch(setModalOpen(false))}
        size={30}
        color="white"
      />

      <div className="bg-white absolute z-50 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-full max-w-xl rounded-xl">
        <div className="flex items-center space-x-4 py-2 px-4 border-b">
          {step > 1 && (
            <BsArrowLeft
              className="cursor-pointer"
              size={25}
              onClick={() => {
                setSelectedFile(null);

                setStep(1);
              }}
            />
          )}

          <h2 className="flex-1 font-semibold text-center">Create new Post</h2>

          {seletedFile && (
            <div>
              {step === 1 ? (
                <button className="text-[#458eff]" onClick={() => setStep(2)}>
                  Next
                </button>
              ) : (
                <button
                  className="flex items-center justify-center text-[#458eff] disabled:text-gray-500 disabled:cursor-not-allowed"
                  onClick={sharePostHandler}
                  disabled={!seletedFile || !caption.trim() || loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 rounded-full border-b border-[#458eff] animate-spin" />
                  ) : (
                    <p>Share</p>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {step === 1 && (
          <div>
            {seletedFile ? (
              <div>
                <img
                  className="w-full h-80 md:h-[500px] object-cover"
                  src={`${seletedFile}`}
                  alt=""
                />
              </div>
            ) : (
              <div className="flex flex-col items-center py-28">
                <Svg />

                <h1 className="mt-2 mb-3 text-2xl font-light">
                  Drag photos here
                </h1>

                <input
                  ref={filePickerRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={uploadImageHandler}
                />

                <button
                  onClick={() => filePickerRef?.current?.click()}
                  className="bg-[#458eff] text-white text-sm py-1 px-4 rounded"
                >
                  Select from computer
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col sm:flex-row">
            <img
              className="w-full sm:w-[300px] h-32 sm:h-[500px] object-cover"
              src={`${seletedFile}`}
              alt=""
            />

            <div className="py-2 px-4">
              <div className="flex space-x-3 mb-3">
                <img className="w-6 h-6 rounded-full" src={profileUrl} alt="" />

                <p className="font-bold text-sm">{displayName}</p>
              </div>

              <textarea
                className="w-full outline-none px-2 py-1"
                value={caption}
                rows={5}
                placeholder="Write a caption..."
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
