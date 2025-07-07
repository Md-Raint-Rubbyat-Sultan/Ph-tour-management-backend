import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";

let server: Server;
const PORT: number = 5000;

const uri: string =
  "mongodb+srv://coffee-shop:3LAg4qo7D0VT85qY@cluster0.m81o4rz.mongodb.net/ph-tour?retryWrites=true&w=majority&appName=Cluster0";

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connented to mongodb");

    server = app.listen(PORT, () => {
      console.log(`Server is running at PORT: ${PORT}`);
    });
  } catch (error: any) {
    console.log(error);
  }
})();

// signal termination or sigterm
process.on("SIGTERM", () => {
  console.log("Signal termination detected... server is shuting down..");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// sigint
process.on("SIGINT", () => {
  console.log("sigint detected... server is shuting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// unhandeled rejection error
process.on("unhandledRejection", (error: any) => {
  console.log("unhandeled rejection error", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// Promise.reject(new Error("Forget to handel this promise"));

// uncauth exception error
process.on("uncaughtException", (error: any) => {
  console.log("uncatch exption error", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
// throw new Error("I forget to catch this error localy");
