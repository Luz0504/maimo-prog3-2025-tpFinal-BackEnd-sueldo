import express from "express";
import Forum from "../models/forum.js";
import Thread from "../models/thread.js";

const router = express.Router();

//Crea foro
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).send({ message: "El nombre es obligatorio." });
    }

    const forum = new Forum({ name, description });
    await forum.save();

    return res.status(201).send({
      message: "Foro creado correctamente",
      forum,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Hubo un error al crear el foro", error });
  }
});

//Lista foros
router.get("/", async (_req, res) => {
  try {
    const forums = await Forum.find().select("_id name description");
    return res.status(200).send({
      message: "Todos los foros",
      forums,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Hubo un error al listar los foros", error });
  }
});

//Threads por Foro
router.get("/:id/threads", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ message: "ID de foro inválido." });
    }

    const forum = await Forum.findById(id);
    if (!forum) {
      return res.status(404).send({ message: "Foro no encontrado." });
    }

    const threads = await Thread.find({ forum_id: forum._id })
      .select("_id title forum_id")
      .populate("forum_id", "name");

    return res.status(200).send({
      message: "Threads por foro",
      forum: { _id: forum._id, name: forum.name },
      threads,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Hubo un error al obtener los threads", error });
  }
});

export default router;
