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

## Example Request

To render a LaTeX document, send a POST request to the `/` endpoint with `multipart/form-data` containing the following fields:

1. **`entry`**: The relative path of the main LaTeX file (e.g., `main.tex`).
2. **`file_*`**: The binary content of the files (e.g., `file_1`, `file_2`, etc.).
3. **`path_*`**: The relative paths corresponding to the uploaded files (e.g., `path_1`, `path_2`, etc.).

### Example using NodeJS

```javascript
import { readFileSync } from "fs";

// Build the form data
const formData = new FormData();
const filePath = "path/to/main.tex";
formData.append("entry", filePath);
formData.append(`file_${index}`, new Blob([readFileSync(filePath)]));
formData.append(`path_${index}`, filePath);

// Create a post request
const res = await fetch("http://localhost:3000", {
  method: "POST",
  body: formData,
});

const json = await res.json();

const { pdf, logs } = json;
```

### Example using `curl`

```bash
curl -X POST http://localhost:3000/ \
  -F "entry=main.tex" \
  -F "path_1=main.tex" \
  -F "file_1=@path/to/main.tex" \
  -F "path_2=images/example.png" \
  -F "file_2=@path/to/example.png"
```

### Response

The response will include the rendered PDF as a base64-encoded string and [logs](https://github.com/michaelkoelle/node-latex-render?tab=readme-ov-file#logs):

```json
{
  "pdf": "JVBERi0xLjQKJcfs... (truncated base64 string)",
  "logs": "...compiler logs..."
}
```

### Additional Notes

- The `entry` field is required and should match the relative path of the main LaTeX file.
- Each `file_*` field must have a corresponding `path_*` field to specify its relative path. Ensure to at least have the entry file and path listed. Entry file path must match one of the `file_*` paths
- Ensure the `Content-Type` header is set to `multipart/form-data` in your request.
