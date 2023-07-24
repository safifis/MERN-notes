const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

router
    .route("/")
    .get(notesController.getAllUsers)
    .post(notesController.createNewUser)
    .patch(notesController.updateUser)
    .delete(notesController.deleteUser);

module.exports = router;
