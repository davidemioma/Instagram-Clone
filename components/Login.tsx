import React from "react";
import Head from "next/head";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import { signInWithGoogle } from "../firebase";

const Login = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-50 flex items-center justify-center h-screen w-screen overflow-hidden">
      <Head>
        <title>Login - Instagram</title>

        <link rel="icon" href="/logo.webp" />
      </Head>

      <div className="hidden md:inline relative h-3/5 w-80">
        <Image src="/assets/login-bg.jpeg" layout="fill" />
      </div>

      <div className="bg-white p-8 border">
        <img
          className="object-contain w-1/2 mx-auto"
          loading="lazy"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
          alt=""
        />

        <button
          onClick={() => signInWithGoogle().then(() => router.push("/"))}
          className="mt-5 py-1 w-2/3 mx-auto flex items-center justify-center space-x-2 border rounded hover:scale-105 transition-transform duration-200"
        >
          <FcGoogle size={20} />

          <p>Sign In With Google</p>
        </button>
      </div>
    </div>
  );
};

export default Login;
