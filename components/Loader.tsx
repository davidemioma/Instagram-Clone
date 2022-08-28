import React from "react";
import Head from "next/head";

const Loader = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden animate-pulse">
      <Head>
        <title>Instagram</title>

        <link rel="icon" href="/logo.webp" />
      </Head>

      <img
        className="absolute object-contain top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40"
        loading="lazy"
        src="/logo.webp"
        alt=""
      />

      <img
        className="absolute w-44 object-contain bottom-3 left-1/2 -translate-x-1/2"
        loading="lazy"
        src="/assets/meta.png"
        alt=""
      />
    </div>
  );
};

export default Loader;
