import express, { Application, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandlers";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import "./app/config/passport.ts";

const app: Application = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to PH-Tour-Management",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
