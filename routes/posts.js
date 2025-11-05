import express from "express";
import mongoose from "mongoose";
import Post from "../models/post.js";
import Thread from "../models/thread.js";
import User from "../models/user.js";

const router = express.Router();

// Crear un nuevo post
router.post("/", async (req, res) => {
  try {
    const { thread_id, user_id, content } = req.body;

    if (!thread_id || !user_id || !content) {
      return res.status(400).send({ message: "Faltan campos obligatorios." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(thread_id) ||
      !mongoose.Types.ObjectId.isValid(user_id)
    ) {
      return res.status(400).send({ message: "ID inválido." });
    }

    const threadExists = await Thread.findById(thread_id);
    if (!threadExists) {
      return res.status(404).send({ message: "Thread no encontrado." });
    }

    const userExists = await User.findById(user_id);
    if (!userExists) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const post = new Post({ thread_id, user_id, content });
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

// Obtener un post por ID
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).send({ message: "ID de post inválido." });
    }

    const post = await Post.findById(postId)
      .populate("user_id", "username avatar_url")
      .populate("thread_id", "title");

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

// Eliminar un post
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).send({ message: "ID de post inválido." });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).send({ message: "Post no encontrado." });
    }

    return res.status(200).send({
      message: "Post eliminado correctamente.",
      post: deletedPost,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Error al eliminar el post", error });
  }
});

export default router;
