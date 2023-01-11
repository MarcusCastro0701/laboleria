import express from "express";
import cors from "cors";

//Routes
import cakesRoutes from "./routes/cakesRoutes.js"
import clientsRoutes from "./routes/clientsRoutes.js"
import ordersRoutes from "./routes/ordersRoutes.js"
//


//Configs app
const app = express();

app.use(cors());
app.use(express.json());
app.use(cakesRoutes);
app.use(clientsRoutes);
app.use(ordersRoutes);
//







const port = 4000;
app.listen(port, () => console.log(`Server running in port: ${port}`));