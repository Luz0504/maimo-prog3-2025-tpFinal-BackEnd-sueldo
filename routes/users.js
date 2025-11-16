import express from "express";
import User from "../models/user.js";

const router = express.Router();

//Crea usuario
router.post("/", async (req, res) => {
  try {
    const { username, avatar_url, email } = req.body;

    const user = new User({ username, avatar_url, email });
    await user.save();

    return res.status(201).send({
      message: "Usuario creado correctamente",
      user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Hubo un error al crear el usuario", error });
  }
});

//Lista usuarios
router.get("/", async (_req, res) => {
  try {
    const users = await User.find().select("_id username avatar_url emal");
    return res.status(200).send({
      message: "Todos los usuarios",
      users,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Hubo un error al listar los usuarios", error });
  }
});

export default router;
