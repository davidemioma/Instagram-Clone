import React from "react";
import { numberFormatter } from "../util/options";

interface Props {
  data: any;
  text: string;
  isFollower?: boolean;
}

const Number = ({ data, text, isFollower }: Props) => {
  const number = numberFormatter(data.length);

  return (
    <div className="flex items-center space-x-1">
      <div className="font-bold">
        {data?.length > 999 ? <p>{number}</p> : <p>{data?.length}</p>}
      </div>

      {isFollower ? (
        <p>
          {text}
          {data?.length > 1 && "s"}
        </p>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};

export default Number;
