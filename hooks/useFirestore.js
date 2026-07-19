import { useState, useEffect, useCallback } from "react";
import {
  collection, getDocs, query, orderBy, limit,
  startAfter, where, onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/config";

// Generic hook for paginated Firestore queries
export function useCollection(collectionName, options = {}) {
  const {
    orderByField = "createdAt",
    orderDirection = "desc",
    pageSize = 20,
    filterField = null,
    filterValue = null,
    realtime = false,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buildQuery = useCallback((startAfterDoc = null) => {
    let q = collection(db, collectionName);
    const constraints = [orderBy(orderByField, orderDirection), limit(pageSize)];
    if (filterField && filterValue) {
      constraints.unshift(where(filterField, "==", filterValue));
    }
    if (startAfterDoc) constraints.push(startAfter(startAfterDoc));
    return query(q, ...constraints);
  }, [collectionName, orderByField, orderDirection, pageSize, filterField, filterValue]);

  const loadData = useCallback(async (reset = false) => {
    try {
      if (reset) setLoading(true);
      const q = buildQuery(reset ? null : lastDoc);
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      if (reset) {
        setData(docs);
      } else {
        setData(prev => [...prev, ...docs]);
      }

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
      setHasMore(snapshot.docs.length === pageSize);
      setError(null);
    } catch (e) {
      setError("Failed to load data. Please try again.");
      console.log(`useCollection error (${collectionName}):`, e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [buildQuery, lastDoc, pageSize, collectionName]);

  useEffect(() => {
    if (realtime) {
      const q = buildQuery();
      const unsub = onSnapshot(q, snapshot => {
        setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }, e => {
        setError("Failed to load realtime data.");
        setLoading(false);
      });
      return () => unsub();
    } else {
      loadData(true);
    }
  }, [collectionName, filterField, filterValue]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setLastDoc(null);
    loadData(true);
  }, [loadData]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) loadData(false);
  }, [hasMore, loading, loadData]);

  return { data, loading, error, hasMore, refreshing, refresh, loadMore };
}

// Hook for user profile with real-time updates
export function useUserProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const { doc, onSnapshot } = require("firebase/firestore");
    const unsub = onSnapshot(
      doc(db, "users", uid),
      snap => {
        setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        setLoading(false);
      },
      e => { console.log("Profile error:", e); setLoading(false); }
    );
    return () => unsub();
  }, [uid]);

  return { profile, loading };
}
