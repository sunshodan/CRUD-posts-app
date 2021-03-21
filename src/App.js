import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./components/Card.js";
import Skeleton from "@material-ui/lab/Skeleton";

import { NavLink, Switch, Route } from "react-router-dom";

export default function App() {
  const [posts, setPosts] = useState(null);
  const [allPosts, setAllPosts] = useState(null);
  const [likedPostsIds, setLikedPostsIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch();
    let likedIds = localStorage.getItem("likedIds");
    likedIds = likedIds ? JSON.parse(likedIds) : [];
    setLikedPostsIds((prev) => likedIds);
  }, []);

  const fetch = async () => {
    let results = await axios.get("https://jsonplaceholder.typicode.com/posts");
    setPosts(results.data);
    setAllPosts(results.data);
    setLoading(false);
  };

  const handelLikeClick = (data) => {
    let likedIds = localStorage.getItem("likedIds");
    likedIds = likedIds ? JSON.parse(likedIds) : [];
    let found = likedIds.find((item) => item.id === data.id);
    if (found) {
      if (found.liked === data.liked) {
        likedIds = likedIds.filter((item) => item.id != data.id);
      } else {
        likedIds = likedIds.map((item) => {
          if (item.id === data.id) {
            item.liked = data.liked;
          }
          return item;
        });
      }
    } else {
      likedIds.push(data);
    }
    localStorage.setItem("likedIds", JSON.stringify(likedIds));
    setLikedPostsIds((prev) => likedIds);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    let filteredPosts = allPosts.filter((item) =>
      item.title.toLowerCase().includes(e.target.value.toLocaleLowerCase())
    );
    setPosts(filteredPosts);
  };

  const deletePost = async (id) => {
    const posts = allPosts.filter((post) => post.id !== id);
    const curPosts = posts.filter((post) => post.id !== id);
    setAllPosts(posts);
    setPosts(curPosts);
    await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
  };

  const editPost = (data) => {
    let curPost = allPosts.find((post) => post.id === data.id);
    if (curPost) {
      curPost.title = data.title !== "" ? data.title : curPost.title;
      curPost.body = data.body !== "" ? data.body : curPost.body;
      setAllPosts((posts) =>
        posts.map((post) => {
          if (post.id === curPost.id) {
            post = curPost;
          }
          return post;
        })
      );
      axios
        .put(
          `https://jsonplaceholder.typicode.com/posts/${curPost.id}`,
          curPost
        )
        .then((res) => console.log(res.data));
    }
  };

  const renderLoader = () => {
    let res = [];
    for (let i = 0; i < 5; i++) {
      res.push(
        <div className="loading">
          <Skeleton variant="rect" width="100%" height={10} />
          <Skeleton variant="rect" width="100%" height={120} />
          <Skeleton variant="rect" width="100%" height={30} />
        </div>
      );
    }
    return res;
  };

  return (
    <div className="App">
      <div className="post-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Posts"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e)}
          />
        </div>
        <div className="nav-links">
          <NavLink to="/" className="nav-item">
            Home
          </NavLink>
          <NavLink to="/liked" className="nav-item">
            Liked
          </NavLink>
          <NavLink to="/disliked" className="nav-item">
            DisLiked
          </NavLink>
        </div>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <>
                {posts
                  ? posts.map((posts) => (
                      <Card
                        posts={posts}
                        key={posts.id}
                        handelLikeClick={handelLikeClick}
                        likedPostsIds={likedPostsIds}
                        deletePost={deletePost}
                        editPost={editPost}
                        {...props}
                      />
                    ))
                  : renderLoader()}
              </>
            )}
          />
          <Route
            exact
            path="/liked"
            render={(props) => (
              <>
                {posts
                  ? posts
                      .filter((post) =>
                        likedPostsIds.find(
                          (liked) => liked.id === post.id && liked.liked
                        )
                      )
                      .map((posts) => (
                        <Card
                          posts={posts}
                          key={posts.id}
                          handelLikeClick={handelLikeClick}
                          likedPostsIds={likedPostsIds}
                          deletePost={deletePost}
                          editPost={editPost}
                          {...props}
                        />
                      ))
                  : renderLoader()}
              </>
            )}
          />
          <Route
            exact
            path="/disliked"
            render={(props) => (
              <>
                {posts
                  ? posts
                      .filter((post) =>
                        likedPostsIds.find(
                          (liked) => liked.id === post.id && !liked.liked
                        )
                      )
                      .map((posts) => (
                        <Card
                          posts={posts}
                          key={posts.id}
                          handelLikeClick={handelLikeClick}
                          likedPostsIds={likedPostsIds}
                          deletePost={deletePost}
                          editPost={editPost}
                          {...props}
                        />
                      ))
                  : renderLoader()}
              </>
            )}
          />
        </Switch>
      </div>
    </div>
  );
}
