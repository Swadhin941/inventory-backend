const { app, cors, express, port } = require("./config/config");
const userRouter = require("./router/auth/user.router");
const { dbConfig } = require("./config/db");

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        // credentials: true, for any routes
    }),
);
app.use(express.json());
app.use("/auth", userRouter);

app.get("/health", (req, res) => {
    res.status(200).send({ message: "Healthy" });
});

app.use((req, res, next) => {
    res.status(404).send({ message: "Page not found" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: "Something went wrong!" });
});

app.listen(port, async () => {
    console.log("Listening on port ", port);
    await dbConfig();
});
