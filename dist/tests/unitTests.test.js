"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const http_1 = __importDefault(require("http"));
const server_1 = require("../server");
const node_test_1 = require("node:test");
const path_1 = __importDefault(require("path"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const port = 8000;
function makeMultipartRequest(options, formData) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      const req = http_1.default.request(options, (res) => {
        let data = "";
        // Collect data chunks
        res.on("data", (chunk) => {
          data += chunk;
        });
        // Handle end of response
        res.on("end", () => {
          try {
            const parsedBody = JSON.parse(data);
            resolve({ statusCode: res.statusCode || 500, body: parsedBody });
          } catch (err) {
            reject(new Error("Failed to parse JSON response"));
          }
        });
      });
      // Handle request errors
      req.on("error", reject);
      // Set a timeout to prevent the request from hanging indefinitely
      req.setTimeout(10000, () => {
        req.destroy(new Error("Request timed out"));
      });
      // Pipe the formData to the request
      formData.pipe(req);
    });
  });
}
// describe("Image Processing API", () => {
// let server: http.Server;
// before((done: any) => {
//   server = app.listen(port, done);
// });
// after((done: any) => {
//   server.close(done);
//   stop();
// });
// afterEach(() => {
//   setTimeout(() => {}, 5000);
// });
//finally??
(0, node_test_1.describe)("POST /img-upload", () => {
  let server;
  (0, node_test_1.before)((done) => {
    server = server_1.app.listen(port, done);
  });
  (0, node_test_1.after)((done) => {
    server.close(done);
    (0, server_1.stop)();
  });
  (0, node_test_1.it)("should upload an image successfully", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const form = new form_data_1.default();
      form.append(
        "filename",
        fs_1.default.createReadStream(
          path_1.default.resolve(__dirname, "test.jpg")
        )
      );
      const options = {
        hostname: "localhost",
        port: port,
        path: "/img-upload",
        method: "POST",
        headers: form.getHeaders(),
      };
      const res = yield makeMultipartRequest(options, form);
      assert_1.strict.equal(res.statusCode, 200);
      assert_1.strict.equal(res.body.status, "success");
      assert_1.strict.equal(res.body.message, "File uploaded successfully!");
    })
  );
  //should fix my code
  // it("should handle upload errors", async () => {
  //   const form = new FormData();
  //   const options = {
  //     hostname: "localhost",
  //     port: port,
  //     path: "/img-upload",
  //     method: "POST",
  //     headers: form.getHeaders(),
  //   };
  //   const res = await makeMultipartRequest(options, form);
  //   assert.equal(res.statusCode, 400);
  //   assert.equal(res.body.status, "error");
  //   assert.equal(res.body.message, "Failed to upload file.");
  // });
});
(0, node_test_1.describe)("POST /img-resize", () => {
  let server;
  (0, node_test_1.before)((done) => {
    server = server_1.app.listen(port, done);
  });
  (0, node_test_1.after)((done) => {
    server.close(done);
    (0, server_1.stop)();
  });
  (0, node_test_1.it)("should resize image successfully", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const form = new form_data_1.default();
      form.append(
        "filename",
        fs_1.default.createReadStream(
          path_1.default.resolve(__dirname, "test.jpg")
        )
      );
      const options = {
        hostname: "localhost",
        port: port,
        path: "/img-resize?width=100&height=100",
        method: "POST",
        headers: form.getHeaders(),
      };
      const res = yield makeMultipartRequest(options, form);
      assert_1.strict.equal(res.statusCode, 200);
      assert_1.strict.equal(res.body.status, "success");
      assert_1.strict.ok(res.body.filename.includes("resized"));
    })
  );
  (0, node_test_1.it)("should return error if no file uploaded", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const options = {
        hostname: "localhost",
        port: port,
        path: "/img-resize?width=100&height=100",
        method: "POST",
      };
      // Empty form without a file
      const form = new form_data_1.default();
      const res = yield makeMultipartRequest(options, form);
      assert_1.strict.equal(res.statusCode, 400);
      assert_1.strict.equal(res.body.status, "error");
      assert_1.strict.equal(res.body.message, "No file uploaded.");
    })
  );
});
(0, node_test_1.describe)("POST /img-crop", () => {
  let server;
  (0, node_test_1.before)((done) => {
    server = server_1.app.listen(port, done);
  });
  (0, node_test_1.after)((done) => {
    server.close(done);
    (0, server_1.stop)();
  });
  (0, node_test_1.it)("should crop the image successfully", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const form = new form_data_1.default();
      form.append(
        "filename",
        fs_1.default.createReadStream(
          path_1.default.resolve(__dirname, "test.jpg")
        )
      );
      const options = {
        hostname: "localhost",
        port: port,
        path: "/img-crop/?left=10&top=10&width=100&height=100",
        method: "POST",
      };
      const res = yield makeMultipartRequest(options, form);
      assert_1.strict.equal(res.statusCode, 200);
      assert_1.strict.equal(res.body.status, "success");
      assert_1.strict.ok(res.body.filename.includes("cropped"));
    })
  );
  (0, node_test_1.it)(
    "should return error if no file uploaded for cropping",
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const options = {
          hostname: "localhost",
          port: port,
          path: "/img-crop?width=100&height=100&top=10&left=10",
          method: "POST",
        };
        const form = new form_data_1.default();
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 400);
        assert_1.strict.equal(res.body.status, "error");
        assert_1.strict.equal(res.body.message, "No file uploaded.");
      })
  );
});
(0, node_test_1.describe)("POST /img-download", () => {
  let server;
  (0, node_test_1.before)((done) => {
    server = server_1.app.listen(port, done);
  });
  (0, node_test_1.after)((done) => {
    server.close(done);
    (0, server_1.stop)();
  });
  (0, node_test_1.it)(
    "should return error if no file uploaded for download",
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const options = {
          hostname: "localhost",
          port: port,
          path: "/img-downlaod",
          method: "POST",
        };
        const form = new form_data_1.default();
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 400);
        assert_1.strict.equal(res.body.status, "error");
        assert_1.strict.equal(res.body.message, "No file uploaded.");
      })
  );
});
(0, node_test_1.describe)("POST /img-filter", () => {
  let server;
  (0, node_test_1.before)((done) => {
    server = server_1.app.listen(port, done);
  });
  (0, node_test_1.after)((done) => {
    server.close(done);
    (0, server_1.stop)();
  });
  (0, node_test_1.it)("should apply grayscale filter to the image", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const form = new form_data_1.default();
      form.append(
        "filename",
        fs_1.default.createReadStream(
          path_1.default.resolve(__dirname, "test.jpg")
        )
      );
      const options = {
        hostname: "localhost",
        port: port,
        path: "/img-filter?filter=grayscale",
        method: "POST",
        headers: form.getHeaders(),
      };
      const res = yield makeMultipartRequest(options, form);
      assert_1.strict.equal(res.statusCode, 200);
      assert_1.strict.equal(res.body.status, "success");
      assert_1.strict.ok(res.body.filename.includes("grayscale"));
    })
  );
  (0, node_test_1.it)("should apply blur filter to the image", () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const form = new form_data_1.default();
      form.append(
        "filename",
        fs_1.default.createReadStream(
          path_1.default.resolve(__dirname, "test.jpg")
        )
      );
      const options = {
        hostname: "localhost",
        port: port,
        path: "/img-filter?filter=blur",
        method: "POST",
        headers: form.getHeaders(),
      };
      const res = yield makeMultipartRequest(options, form);
      assert_1.strict.equal(res.statusCode, 200);
      assert_1.strict.equal(res.body.status, "success");
      assert_1.strict.ok(res.body.filename.includes("blur"));
    })
  );
  (0, node_test_1.it)(
    "should return error if no file uploaded for filtering",
    () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const options = {
          hostname: "localhost",
          port: port,
          path: "/img-filter?filter=grayscale",
          method: "POST",
        };
        const form = new form_data_1.default();
        const res = yield makeMultipartRequest(options, form);
        assert_1.strict.equal(res.statusCode, 400);
        assert_1.strict.equal(res.body.status, "error");
        assert_1.strict.equal(res.body.message, "No file uploaded.");
      })
  );
});
// });
