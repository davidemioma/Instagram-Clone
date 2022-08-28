import React from "react";
import NumericLabel from "react-pretty-numbers";
import { option } from "../util/options";

interface Props {
  data: any;
  text: string;
  isFollower?: boolean;
}

const Number = ({ data, text, isFollower }: Props) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="font-bold">
        {data?.length > 999 ? (
          <NumericLabel params={option}>{data?.length}</NumericLabel>
        ) : (
          <p>{data?.length}</p>
        )}
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
