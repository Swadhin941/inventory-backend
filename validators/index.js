const runValidation = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            errors: {
                wrap: {
                    label: "",
                },
            },
        });
        if (error) {
            return res.status(400).send({
                error: error.details.map((item) => ({ msg: item.message })),
            });
        }
        next();
    };
};

module.exports = { runValidation };
