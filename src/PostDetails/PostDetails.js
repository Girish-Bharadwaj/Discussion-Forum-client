import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./PostDetails.css";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import { IconButton, Button, TextField, CircularProgress } from "@mui/material";
import Comments from "../Comments/Comments";
import axios from "../axios/axiosConfig";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { decode } from "../functions";
import moment from "moment";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
});
function PostDetails() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState({});
  const [commentBody, setCommentBody] = useState("");
  const [selectedTab, setSelectedTab] = useState("write");
  useEffect(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/post/getbyid/${id}`);
      setPost(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [id]);
  const publishComment = async () => {
    if (decode()) {
      setIsLoading(true);
      try {
        const response = await axios.post(`/post/comment`, {
          postId: id,
          content: commentBody,
        });
        let newPost = { ...post };
        newPost.comments.push(response.data);
        setPost(newPost);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    } else {
      alert("You must be logged in to comment");
    }
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="postdetailswindow">
            <div className="postWindow">
              <div className="left">
                <IconButton>
                  <ArrowUpwardIcon />
                </IconButton>
                <span className="upvotes">{post.votesCount}</span>
                <IconButton>
                  <ArrowDownwardIcon />
                </IconButton>
              </div>
              <div className="right">
                <Link to={`/userprofile/${post?.createdBy?._id}`}>
                  <div className="author">
                    Posted by {post?.createdBy?.username}{" "}
                    <span className="time">{moment(post.date).fromNow()}</span>
                  </div>
                </Link>
                <span className="tag">{post.tag}</span>
                <h3 className="heading">{post.heading}</h3>
                <ReactMarkdown
                  className="body"
                  children={post.body}
                  remarkPlugins={[remarkGfm]}
                />
                <div className="actions">
                  <IconButton>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                  <span className="commentsCount">
                    {post.comments.length} Comments
                  </span>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                </div>
              </div>
            </div>
            <div className="writeComments">
              <h3>Write Comments</h3>
              <ReactMde
                value={commentBody}
                onChange={setCommentBody}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
              <Button onClick={publishComment}>Send</Button>
            </div>
          </div>
          <Comments comments={post.comments} />
        </>
      )}
    </>
  );
}

export default PostDetails;
