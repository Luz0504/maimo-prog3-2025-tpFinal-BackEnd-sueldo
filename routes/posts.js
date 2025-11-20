import express from "express";
import mongoose from "mongoose";
import Post from "../models/post.js";
import Thread from "../models/thread.js";
import User from "../models/user.js";

const router = express.Router();

// Crear un nuevo post
router.post("/", async (req, res) => {
  try {
    const { thread_id, user, content } = req.body;

    const threadExists = await Thread.findById(thread_id);
    if (!threadExists) {
      return res.status(404).send({ message: "Thread no encontrado." });
    }

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const post = new Post({
      thread_id,
      user,
      content,
    });

    await post.save();

    return res.status(201).send({
      message: "Post creado correctamente.",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al crear el post", error });
  }
});

// Obtener el post
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).send({ message: "ID de post inválido." });
    }

    const post = await Post.findById(postId)
      .populate("thread_id", "title")
      .populate("user", "username avatar_url email");

    if (!post) {
      return res.status(404).send({ message: "Post no encontrado." });
    }

    return res.status(200).send({
      message: "Post encontrado.",
      post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al obtener el post", error });
  }
});

// Obtener todos los posts de un usuario
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "ID de usuario inválido." });
    }

    const posts = await Post.find({ user: userId })
      .populate("thread_id", "title")
      .populate("user", "username avatar_url email")
      .sort({ created_at: -1 }); // opcional: posts más nuevos primero

    if (!posts || posts.length === 0) {
      return res.status(404).send({ message: "Este usuario no tiene posts." });
    }

    return res.status(200).send({
      message: "Posts del usuario encontrados.",
      posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al obtener los posts", error });
  }
});


export default router;
