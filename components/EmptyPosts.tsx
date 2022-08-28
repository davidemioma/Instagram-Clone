import React from "react";

const EmptyPosts = () => {
  return (
    <div className="w-full max-w-[calc(1024px-64px)] mx-auto grid md:grid-cols-2">
      <div className="bg-white w-full h-48 md:h-96 md:col-start-2 flex flex-col items-center justify-center">
        <p className="font-semibold text-center">
          Start capturing and sharing your moments.
        </p>

        <p className="mt-1 mb-3 text-sm text-center">
          Get the app to share your first photo or video.
        </p>

        <div className="flex items-center space-x-2">
          <img
            className="w-32 object-contain cursor-pointer"
            loading="lazy"
            src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Yfc020c87j0.png"
            alt=""
          />

          <img
            className="w-32 object-contain cursor-pointer"
            loading="lazy"
            src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
            alt=""
          />
        </div>
      </div>

      <img
        className="w-full object-cover h-96 md:row-start-1"
        loading="lazy"
        src="/assets/empty.jpeg"
        alt=""
      />
    </div>
  );
};

export default EmptyPosts;
