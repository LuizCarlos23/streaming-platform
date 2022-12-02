const router = require("express").Router();

const errorHandler = require("./middlewares/errorHandler")
const auth = require("./middlewares/auth");

const UserController = require("./controllers/usersController")
const VideosController = require("./controllers/videosController");
const TagsController = require("./controllers/tagsController");

//users
router.post("/users", UserController.Create)
router.post("/login", UserController.Login)

//videos
router.post("/videos", auth, VideosController.Create)
router.get("/videos", auth, VideosController.List)
router.get("/videos/:id", auth, VideosController.GetById)
router.put("/videos/:id", auth, VideosController.Update)
router.delete("/videos/:id", auth, VideosController.Delete)

//tags
router.post("/tags", auth, TagsController.Create)
router.get("/tags", auth, TagsController.List)
router.get("/tags/:title_tag/videos", auth, TagsController.Videos)
router.put("/tags/:id", auth, TagsController.Update)
router.delete("/tags/:id", auth, TagsController.Delete)

//not found
router.all("", (req, res) => res.status(404).json())

//error
router.use(errorHandler)

module.exports = router