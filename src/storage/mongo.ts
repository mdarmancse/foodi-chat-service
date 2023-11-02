import { connect } from "mongoose";

export async function connectMongoDB() {
  const dbUrl = process.env.MONGO_URI || "";
  const con = await connect(dbUrl);

  console.log(
    `Connected to MongoDB at ${con.connection.host}:${con.connection.port}`,
  );
}
