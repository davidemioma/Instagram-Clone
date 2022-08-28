import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { doc, onSnapshot, serverTimestamp, setDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import { BsInstagram } from "react-icons/bs";
import { HiChevronLeft } from "react-icons/hi";
import { AccountProps } from "../types";

const Account = () => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const [profile, setProfile] = useState<AccountProps>();

  const [loading, setIsLoading] = useState(false);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const [seletedFile, setSeletedFile] = useState<
    string | ArrayBuffer | null | undefined
  >(null);

  const [phoneNo, setPhoneNo] = useState("");

  const selectedImage = seletedFile
    ? `${seletedFile}`
    : "https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg";

  const uploadImage = (e: React.FormEvent) => {
    const reader = new FileReader();

    const file = (e.target as HTMLFormElement).files[0];

    reader.readAsDataURL(file);

    reader.onload = (readerEvent) => {
      setSeletedFile(readerEvent.target?.result);
    };
  };

  const updateProfileHandler = async () => {
    setIsLoading(true);

    const imageRef = ref(storage, `users/${user?.uid}`);

    await uploadString(imageRef, `${seletedFile}`, "data_url").then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef);

        setSeletedFile(null);

        await setDoc(
          doc(db, "users", `${user?.uid}`),
          {
            id: user?.uid,
            email: user?.email,
            displayName: user?.displayName,
            photoUrl: user?.photoURL,
            profileUrl: downloadUrl,
            phoneNo,
            timestamp: serverTimestamp(),
          },
          { merge: true }
        )
          .then(() => {
            setIsLoading(false);

            router.push("/");
          })
          .catch((err) => {
            setIsLoading(false);

            alert(err.message);
          });
      }
    );
  };

  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${user?.uid}`), (snapshot: any) => {
        setProfile({
          id: snapshot.id,
          ...snapshot.data(),
        });
      }),
    [db]
  );

  return (
    <div className="relative bg-gray-50 w-screen h-screen overflow-hidden flex items-center justify-center">
      <Head>
        <title>Profile - Instagram</title>

        <link rel="icon" href="/logo.webp" />
      </Head>

      <button
        onClick={() => router.push("/")}
        className="absolute top-3 left-5 md:top-5 md:left-10 flex items-center space-x-0.5 hover:scale-105 transition-transform duration-200"
      >
        <HiChevronLeft size={20} />

        <p>Go back</p>
      </button>

      <div className="bg-white p-8 border">
        <img
          className="object-contain w-1/2 mx-auto"
          loading="lazy"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
          alt=""
        />

        <img
          className="my-5 mx-auto w-20 h-20 rounded-full object-cover"
          loading="lazy"
          src={profile?.profileUrl ? profile.profileUrl : selectedImage}
          alt=""
        />

        <div className="w-full space-y-4 mb-5">
          <div className="input-container">
            <label className="label">Full Name</label>

            <p className="input">
              {profile?.displayName ? profile?.displayName : user?.displayName}
            </p>
          </div>

          <div className="input-container">
            <label className="label">Email</label>

            <p className="input">
              {profile?.email ? profile?.email : user?.email}
            </p>
          </div>

          <div className="input-container">
            <label className="label">Phone Number</label>

            <input
              className="input"
              value={phoneNo}
              type="text"
              placeholder="xxx xxxx xxxx xx"
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          <div className="input-container">
            <label className="label">Profile Picture</label>

            <BsInstagram
              size={20}
              className="cursor-pointer hover:animate-bounce"
              onClick={
                !seletedFile
                  ? () => filePickerRef?.current?.click()
                  : () => setSeletedFile(null)
              }
            />

            <input
              ref={filePickerRef}
              type="file"
              accept="image/*"
              hidden
              onChange={uploadImage}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            onClick={updateProfileHandler}
            disabled={!seletedFile || !phoneNo.trim() || loading}
            className="bg-[#458eff] flex items-center justify-center disabled:bg-blue-200 py-1 rounded text-white w-10/12 hover:scale-105 transition-transform duration-200"
          >
            {loading ? (
              <div className="w-7 h-7 rounded-full border-b border-white animate-spin" />
            ) : (
              <p>Update Profile</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
