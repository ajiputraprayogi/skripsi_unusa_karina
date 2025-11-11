import mysql from "mysql2/promise";

// Koneksi ke database MySQL
export const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "posyandu",
});
