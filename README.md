# latex-render-api

Rest API for rendering LaTeX documents

### Environment Variables:

| Name               | Type    | Default Value | Description                                                                                                                                                                    |
| ------------------ | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FILE_SIZE_LIMIT`  | Integer | `50`          | Maximum size of uploaded files in megabytes.                                                                                                                                   |
| `FILE_COUNT_LIMIT` | Integer | `500`         | Maximum number of files that can be uploaded in a single request.                                                                                                              |
| `COMPILER_TYPE`    | String  | `PDFTex`      | The LaTeX compiler to use (e.g.,`PDFTex`, `XeTeX`, etc.).                                                                                                                      |
| `COMPILER_ARGS`    | String  | `undefined`   | Additional arguments to pass to the LaTeX compiler.                                                                                                                            |
| `LOG_LEVEL`        | String  | `info`        | Logging level for the application (e.g.,`debug`, `info`,`typesetting`,`warn`,`error`). [More info](https://github.com/michaelkoelle/node-latex-render?tab=readme-ov-file#logs) |
| `PASSOVER`         | Integer | `2`           | Number of passes the LaTeX compiler should perform.                                                                                                                            |
| `PORT`             | Integer | `3000`        | Port on which the server will listen.                                                                                                                                          |

## Docker Instructions

To pull and run the Docker container from Docker Hub:

```bash
docker run -p 3000:3000 michaelkoelle/latex-render-api:latest
```

## Docker Compose Instructions

To use Docker Compose with the image from Docker Hub, create a `docker-compose.yml` file with the following content:

```yaml
version: "3.8"
services:
  latex-render-api:
    image: michaelkoelle/latex-render-api:latest
    ports:
      - "3000:3000"
    environment:
      FILE_SIZE_LIMIT: 100
```

Then run the following commands:

```bash
# Start the services
docker-compose up

# Stop the services
docker-compose down
```

## Compile and Run Locally

To compile and run the application yourself:

1. Clone the repository:

   ```bash
   git clone https://github.com/michaelkoelle/latex-render-api.git
   cd latex-render-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the application:

   ```bash
   npm run build
   ```

4. Start the server:

   ```bash
   npm start
   ```

The server will be running at `http://localhost:3000`.
