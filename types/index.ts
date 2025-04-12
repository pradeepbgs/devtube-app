export type UserDetails = {
    _id: string;
    avatar: string;
    coverImage: string;
    email: string;
    fullname: string;
    isSubscribed: boolean;
    subscribedToCount: number;
    subscribersCount: number;
    username: string;
  };

  export type VideoDetailsT = {
    _id: string;
    createdAt: string;
    description: string;
    duration: number;
    isLiked: boolean;
    isPublished: boolean;
    isSubscribed: boolean;
    likesCount: number;
    owner: {
      _id: string;
      fullname: string;
      username: string;
    };
    subscribersCount: number;
    thumbnail: string;
    title: string;
    url: string;
    views: number;
  };