## Infrastructure decisions
- Store uploaded images in a new top-level `images/` directory alongside `Client/` and `Server/`.
- Save only the image path in MongoDB so the frontend can read files directly from the `images/` folder.
- Keep the base image path in an environment variable for easy reconfiguration later.
- Use MongoDB Atlas for the database; the Atlas URI will be provided via environment variables.
