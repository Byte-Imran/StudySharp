const swaggerSpecification = {
  openapi: "3.0.3",
  info: {
    title: "Express API",
    version: "1.0.0",
  },
  paths: {
    "/health": {
      get: {
        summary: "Check service health",
        tags: ["System"],
        responses: {
          200: { description: "Service is running." },
        },
      },
    },

    "/api/v1/users/register": {
      post: {
        summary: "Register a user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully." },
          400: { description: "Invalid data." },
          409: { description: "Email already registered." },
        },
      },
    },

    "/api/v1/users/login": {
      post: {
        summary: "Login a user",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: { description: "Login successful." },
          400: { description: "Email or password missing." },
          401: { description: "Invalid email or password." },
        },
      },
    },
  },

  components: {
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Alex Morgan" },
          email: { type: "string", example: "alex@example.com" },
          password: { type: "string", example: "mypassword123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "alex@example.com" },
          password: { type: "string", example: "mypassword123" },
        },
      },
    },
  },
};

export default swaggerSpecification;
