import {
  AiOutlineLike,
  AiOutlineDislike,
  AiTwotoneLike,
  AiTwotoneDislike,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import Modal from "@material-ui/core/Modal";
import { useState } from "react";

const Card = ({
  posts,
  handelLikeClick,
  likedPostsIds,
  deletePost,
  editPost,
  ...props
}) => {
  let status = likedPostsIds.find((item) => item.id === posts.id);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submitEditContent = () => {
    if (body !== "" || title !== "") {
      editPost({ id: posts.id, title, body });
      setOpenModal(false);
      setTitle("");
      setBody("");
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">{posts.title}</h4>
        </div>
        <div className="card-body">
          <p className="card-text">{posts.body}</p>
          <div className="like-section">
            <span
              className={`${status?.liked && "liked"}`}
              onClick={() => handelLikeClick({ id: posts.id, liked: true })}
            >
              {status?.liked ? <AiTwotoneLike /> : <AiOutlineLike />}
              Like
            </span>

            <span
              className={`${status && !status?.liked && "disLiked"}`}
              onClick={() => handelLikeClick({ id: posts.id, liked: false })}
            >
              {status && !status?.liked ? (
                <AiTwotoneDislike />
              ) : (
                <AiOutlineDislike />
              )}
              Dislike
            </span>
            <span onClick={() => deletePost(posts.id)}>
              <AiOutlineDelete />
              Delete
            </span>
            <span onClick={() => setOpenModal(true)}>
              <AiOutlineEdit />
              Edit
            </span>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="modal">
          <h2>Edit Post</h2>
          <div className="input-area">
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Enter content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <button onClick={submitEditContent}>Submit</button>
        </div>
      </Modal>
    </>
  );
};
export default Card;
