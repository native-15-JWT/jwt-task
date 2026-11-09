
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { getPosts, getNewToken } from "../utils/authDataService";
import { authActions } from "../store/authSlice";

const COLORS = {
  primary800: "#1b1a2f",
  primary500: "#6256d8",
  white: "#ffffff",
};

function WelcomeScreen() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const refreshToken = useSelector((state) => state.auth.refreshToken);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);

      let response;

      try {
        response = await getPosts(token);
      } catch (requestError) {
        const status = requestError.response?.status;

        if (status !== 401 && status !== 403) {
          throw requestError;
        }

        if (!refreshToken) {
          throw requestError;
        }

        const refreshResponse = await getNewToken(refreshToken);

        const newToken =
          refreshResponse.data?.accessToken ||
          refreshResponse.data?.token;

        if (!newToken) {
          throw new Error("New access token was not returned.");
        }

        dispatch(authActions.setToken(newToken));

        response = await getPosts(newToken);
      }

      const receivedPosts = response.data?.posts || response.data;

      setPosts(Array.isArray(receivedPosts) ? receivedPosts : []);
    } catch (requestError) {
      setError("Не вдалося завантажити публікації.");

      console.log(
        "Posts loading failed:",
        requestError.response?.data || requestError.message
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token, refreshToken, dispatch]);

  useEffect(() => {
    loadPosts();
    // Завантажуємо публікації один раз при відкритті екрана.
    // Оновлення токена не повинно запускати цей запит повторно.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refreshPostsHandler() {
    setIsRefreshing(true);
    loadPosts();
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary500} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        testID="Posts"
        data={posts}
        keyExtractor={(item, index) =>
          item.id ? String(item.id) : String(index)
        }
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postTitle}>
              {item.title || "Без назви"}
            </Text>

            <Text style={styles.postText}>
              {item.body || item.description || ""}
            </Text>
          </View>
        )}
        onRefresh={refreshPostsHandler}
        refreshing={isRefreshing}
        ListEmptyComponent={
          !error ? (
            <Text style={styles.empty}>Публікацій поки немає.</Text>
          ) : null
        }
      />
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary800,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary800,
  },
  post: {
    backgroundColor: "#302e4a",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  postTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postText: {
    color: COLORS.white,
    fontSize: 14,
  },
  error: {
    color: "#ff7777",
    textAlign: "center",
    marginVertical: 12,
  },
  empty: {
    color: COLORS.white,
    textAlign: "center",
    marginTop: 24,
  },
});
