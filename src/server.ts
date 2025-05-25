import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { render } from "node-latex-render";
import { CompilerType } from "node-latex-render/dist/compiler";
import { LogLevel } from "node-latex-render/dist/logs";

const fastify = Fastify({ logger: true });

fastify.register(multipart, {
  limits: {
    fileSize: process.env.FILE_SIZE_LIMIT
      ? parseInt(process.env.FILE_SIZE_LIMIT) * 1024 * 1024
      : 50 * 1024 * 1024,
    files: process.env.FILE_COUNT_LIMIT
      ? parseInt(process.env.FILE_COUNT_LIMIT)
      : 500,
  },
});

fastify.post("/", async (req, reply) => {
  try {
    const parts = req.parts();

    const allParts = [];
    let mainFile = "";

    for await (const part of parts) {
      if (part.type === "field") {
        if (part.fieldname === "entry") {
          mainFile = part.value as string;
        } else if (part.fieldname.startsWith("path_")) {
          allParts.push({
            kind: "path",
            index: part.fieldname.split("_")[1],
            value: part.value as string,
          });
        }
      } else if (part.type === "file" && part.fieldname.startsWith("file_")) {
        const index = part.fieldname.split("_")[1];
        const buffer = await part.toBuffer();
        allParts.push({ kind: "file", index, buffer });
      }
    }

    if (!mainFile) {
      return reply.status(400).send({ error: "`main_file` field is required" });
    }

    // Now build mapping from path -> file content
    const pathMap: { [index: string]: string } = {};
    const bufferMap: { [index: string]: ArrayBuffer } = {};
    const receivedFiles: { [relativePath: string]: ArrayBuffer } = {};

    for (const part of allParts) {
      if (part.kind === "path") {
        pathMap[part.index] = part.value as string;
      } else if (part.kind === "file") {
        bufferMap[part.index] = part.buffer as ArrayBuffer;
      }
    }

    for (const index of Object.keys(pathMap)) {
      const path = pathMap[index];
      const buffer = bufferMap[index];
      if (path && buffer) {
        receivedFiles[path] = buffer;
      }
    }

    if (!receivedFiles[mainFile]) {
      return reply.status(400).send({
        error: `main_file "${mainFile}" not found in uploaded files`,
      });
    }

    const { pdf, logs } = render(mainFile, receivedFiles, {
      compiler:
        (process.env.COMPILER_TYPE as CompilerType) || CompilerType.PDFTex,
      args: process.env.COMPILER_ARGS || undefined,
      logLevel: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
      passover: process.env.PASSOVER ? parseInt(process.env.PASSOVER) : 2,
    });

    if (!pdf) {
      return reply.status(500).send({
        error: "Failed to generate PDF",
        logs,
      });
    }

    const pdfBase64 = Buffer.from(pdf).toString("base64");

    reply.status(200).send({ pdf: pdfBase64, logs });
  } catch (err: any) {
    console.log("Error during form parsing:", err);
    req.log.error(err);
    reply.status(500).send({
      error: "Internal server error during form parsing",
      details: err.message || err.toString(),
    });
  }
});

export const startServer = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
      host: "0.0.0.0",
    });
    console.log(
      `Server running at http://localhost:${process.env.PORT || 3000}`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
