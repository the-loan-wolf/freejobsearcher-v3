import { useState, useEffect } from "react";
import { fetchProfile, Profile} from "../lib/fetchProfile";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const usePaginatedPosts = (pageSize = 10) => {
  const [posts, setPosts] = useState<Profile[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);

  const loadMore = async () => {
    if (loading || noMore) return;
    setLoading(true);

    const { profile: newPosts, lastVisible } = await fetchProfile(
      pageSize,
      lastDoc,
    );

    if (newPosts.length === 0) setNoMore(true);
    else {
      setPosts((prev) => [...prev, ...newPosts]);
      setLastDoc(lastVisible);
    }

    setLoading(false);
  };

  // load first page
  useEffect(() => {
    loadMore();
  }, []);

  return { posts, loadMore, loading, noMore };
};
