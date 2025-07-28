"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRouter = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middleware/validateRequest");
const tour_validation_1 = require("./tour.validation");
const tour_controller_1 = require("./tour.controller");
const multer_config_1 = require("../../config/multer.config");
const router = (0, express_1.Router)();
// Tour-Types
router.post("/create-tour-type", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tour_validation_1.tourTypeZodSchema), tour_controller_1.TourControllers.createTourType);
router.get("/tour-types", tour_controller_1.TourControllers.getAllTourTypes);
router.get("/tour-types/:id", tour_controller_1.TourControllers.getSingleTourTypes);
router.patch("/tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(tour_validation_1.tourTypeZodSchema), tour_controller_1.TourControllers.updateTourTypes);
router.delete("tour-types/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourControllers.deleteTourTypes);
// Tour
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("flies"), (0, validateRequest_1.validateRequest)(tour_validation_1.createTourZodSchema), tour_controller_1.TourControllers.createTour);
router.get("/", tour_controller_1.TourControllers.getAllTours);
router.get("/:slug", tour_controller_1.TourControllers.getAllTours);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("flies"), (0, validateRequest_1.validateRequest)(tour_validation_1.updateTourZodSchema), tour_controller_1.TourControllers.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourControllers.deleteTour);
exports.TourRouter = router;
