# latex-render-api

Rest API for rendering LaTeX documents

Environment Variables:

| Name               | Type    | Default Value | Description                                                                                                                                                                    |
| ------------------ | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `FILE_SIZE_LIMIT`  | Integer | `50`          | Maximum size of uploaded files in megabytes.                                                                                                                                   |
| `FILE_COUNT_LIMIT` | Integer | `500`         | Maximum number of files that can be uploaded in a single request.                                                                                                              |
| `COMPILER_TYPE`    | String  | `PDFTex`      | The LaTeX compiler to use (e.g.,`PDFTex`, `XeTeX`, etc.).                                                                                                                      |
| `COMPILER_ARGS`    | String  | `undefined`   | Additional arguments to pass to the LaTeX compiler.                                                                                                                            |
| `LOG_LEVEL`        | String  | `info`        | Logging level for the application (e.g.,`debug`, `info`,`typesetting`,`warn`,`error`). [More info](https://github.com/michaelkoelle/node-latex-render?tab=readme-ov-file#logs) |
| `PASSOVER`         | Integer | `2`           | Number of passes the LaTeX compiler should perform.                                                                                                                            |
| `PORT`             | Integer | `3000`        | Port on which the server will listen.                                                                                                                                          |
