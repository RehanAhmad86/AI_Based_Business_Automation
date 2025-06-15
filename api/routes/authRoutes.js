// import express from "express";
// import { registerUser } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", registerUser);

// export default router;

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { deleteUserAccount } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete('/delete-account', deleteUserAccount);

export default router;
