import express from "express";
import Thread from "../models/thread.js";
import Post from "../models/post.js";
import Forum from "../models/forum.js";

const router = express.Router();

//Crea un thread dentro de un foro
router.post("/", async (req, res) => {
  try {
    const { forum_id, title } = req.body;

    const forumExists = await Forum.findById(forum_id);
    if (!forumExists) {
      return res.status(404).send({ message: "El foro no existe." });
    }

    const thread = new Thread({ forum_id, title });
    await thread.save();

    return res.status(201).send({
      message: "Thread creado correctamente",
      thread,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error al crear el thread", error });
  }
});

//obtener los posts dentro de un thread
router.get("/:threadId/posts", async (req, res) => {
  try {
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId).populate("forum_id", "name");
    if (!thread) {
      return res.status(404).send({ message: "Thread no encontrado." });
    }

    const posts = await Post.find({ thread_id: threadId })
      .select("_id user content imagen created_at updated_at")
      .populate("user", "username avatar_url");

    return res.status(200).send({
      message: "Posts del thread",
      thread: {
        _id: thread._id,
        title: thread.title,
        forum: thread.forum_id.name,
      },
      posts
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Error al obtener los posts", error });
  }
});

export default router;
