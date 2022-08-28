export interface AccountProps {
  displayName: string;
  email: string;
  id: string;
  phoneNo: string;
  photoUrl: string;
  profileUrl: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface PostProps {
  caption: string;
  displayName: string;
  id: string;
  postImgUrl: string;
  profileUrl: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface CommentProps {
  id: string;
  comment: string;
  displayName: string;
  profileUrl: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface LikeProps {
  id: string;
  displayName: string;
  profileUrl: string;
}

export interface NotificationProps {
  id: string;
  task: string;
  displayName: string;
  profileUrl: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}
