const { app, cors, express, port } = require("./config/config");

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).send({ message: "Healthy" });
});

app.use((req, res, next) => {
    res.status(404).send({ message: "Page not found" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: "Something went wrong!" });
});

app.listen(port, () => {
    console.log("Listening on port ", port);
});
