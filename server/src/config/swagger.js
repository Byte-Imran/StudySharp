const swaggerSpecification = {
  openapi: "3.0.3",
  info: {
    title: "studySharp API",
    version: "1.0.0",
    description:
      "REST API documentation for studySharp authentication, users, profile, and social features.",
  },
  servers: [
    {
      url: process.env.SERVER_URL || "http://localhost:5000",
      description: "StudySharp API server",
    },
  ],
  tags: [
    { name: "System", description: "Service status endpoints" },
    { name: "Authentication", description: "Local and Google authentication" },
    { name: "Users", description: "User profile and account endpoints" },
    { name: "Social", description: "Follower and following endpoints" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description: "HttpOnly JWT cookie set by login, registration, or Google OAuth.",
      },
    },
    responses: {
      Error: {
        description: "An API error response.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          statusCode: { type: "integer", example: 200 },
          message: { type: "string", example: "Request successful." },
          data: { type: "object", nullable: true },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Request failed." },
          details: { type: "object", nullable: true },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "alex morgan" },
          email: { type: "string", format: "email", example: "alex@example.com" },
          img: { type: "string", example: "https://res.cloudinary.com/demo/avatar.png" },
          nickname: { type: "string", example: "alexm" },
          bio: { type: "string", example: "Building better study communities." },
          education: { type: "string", example: "Computer Science" },
          location: { type: "string", example: "Delhi, India" },
          quote: { type: "string", example: "Learn something new every day." },
          skills: {
            type: "array",
            maxItems: 20,
            items: { type: "string", maxLength: 40 },
            example: ["JavaScript", "React", "MongoDB"],
          },
          followersCount: { type: "integer", minimum: 0, example: 12 },
          followingCount: { type: "integer", minimum: 0, example: 8 },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 80, example: "Alex Morgan" },
          email: { type: "string", format: "email", example: "alex@example.com" },
          password: { type: "string", minLength: 8, maxLength: 72, example: "mypassword123" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "alex@example.com" },
          password: { type: "string", example: "mypassword123" },
        },
      },
      UpdateProfileRequest: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 80 },
          nickname: { type: "string", maxLength: 40 },
          bio: { type: "string", maxLength: 300 },
          education: { type: "string", maxLength: 120 },
          location: { type: "string", maxLength: 100 },
          quote: { type: "string", maxLength: 180 },
          skills: {
            type: "array",
            maxItems: 20,
            items: { type: "string", maxLength: 40 },
          },
        },
      },
      PublicUser: {
        type: "object",
        properties: {
          id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "alex morgan" },
          email: { type: "string", format: "email", example: "alex@example.com" },
          img: { type: "string", example: "https://res.cloudinary.com/demo/avatar.png" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Check service health",
        responses: {
          200: {
            description: "Service is running.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
        },
      },
    },

    "/api/v1/users/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully and JWT cookie set." },
          400: { $ref: "#/components/responses/Error" },
          409: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: { description: "Login successful and JWT cookie set." },
          400: { $ref: "#/components/responses/Error" },
          401: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout the current user",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "JWT cookie cleared." },
          500: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get the current authenticated user",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "Current user profile.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiResponse" },
              },
            },
          },
          401: { $ref: "#/components/responses/Error" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update the current user's profile",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileRequest" },
            },
          },
        },
        responses: {
          200: { description: "Profile updated successfully." },
          400: { $ref: "#/components/responses/Error" },
          401: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/me/avatar": {
      patch: {
        tags: ["Users"],
        summary: "Upload or replace the current user's profile image",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "PNG, JPEG, or WebP image up to 5 MB.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile image uploaded successfully." },
          400: { $ref: "#/components/responses/Error" },
          401: { $ref: "#/components/responses/Error" },
          500: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get another user's public profile",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", example: "507f1f77bcf86cd799439011" },
          },
        ],
        responses: {
          200: { description: "User profile fetched successfully." },
          401: { $ref: "#/components/responses/Error" },
          404: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/{id}/follow": {
      post: {
        tags: ["Social"],
        summary: "Follow a user",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          200: { description: "User followed successfully." },
          400: { $ref: "#/components/responses/Error" },
          401: { $ref: "#/components/responses/Error" },
          404: { $ref: "#/components/responses/Error" },
        },
      },
      delete: {
        tags: ["Social"],
        summary: "Unfollow a user",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          200: { description: "User unfollowed successfully." },
          400: { $ref: "#/components/responses/Error" },
          401: { $ref: "#/components/responses/Error" },
          404: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/{id}/followers": {
      get: {
        tags: ["Social"],
        summary: "Get a user's followers",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          200: {
            description: "Followers fetched successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PublicUser" },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Error" },
          404: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/users/{id}/following": {
      get: {
        tags: ["Social"],
        summary: "Get a user's following list",
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/UserId" }],
        responses: {
          200: {
            description: "Following users fetched successfully.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PublicUser" },
                },
              },
            },
          },
          401: { $ref: "#/components/responses/Error" },
          404: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/auth/google": {
      get: {
        tags: ["Authentication"],
        summary: "Start Google OAuth",
        description:
          "Redirects the browser to Google, sets an OAuth state cookie, and uses the configured backend callback URL.",
        parameters: [
          {
            name: "prompt",
            in: "query",
            required: false,
            schema: { type: "string", example: "select_account" },
          },
        ],
        responses: {
          302: { description: "Redirect to Google OAuth consent." },
          500: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/auth/google/callback": {
      get: {
        tags: ["Authentication"],
        summary: "Google OAuth callback",
        description:
          "Google redirects here after consent. The server validates OAuth state, creates or links the user, sets the JWT cookie, and redirects to the frontend.",
        parameters: [
          {
            name: "code",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "state",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          302: { description: "Redirect to the frontend with oauth=success or oauth_failed." },
          401: { $ref: "#/components/responses/Error" },
          500: { $ref: "#/components/responses/Error" },
        },
      },
    },

    "/api/v1/auth/github": {
      get: {
        tags: ["Authentication"],
        summary: "Start GitHub OAuth",
        description:
          "Redirects to GitHub OAuth and requests access to the user's verified email.",
        responses: {
          302: { description: "Redirect to GitHub OAuth consent." },
          500: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/api/v1/auth/github/callback": {
      get: {
        tags: ["Authentication"],
        summary: "GitHub OAuth callback",
        parameters: [
          {
            name: "code",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "state",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          302: { description: "Redirect to the frontend after GitHub authentication." },
          401: { $ref: "#/components/responses/Error" },
          500: { $ref: "#/components/responses/Error" },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Authentication", "Users"],
        summary: "Get the current OAuth or local user",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Current authenticated user." },
          401: { $ref: "#/components/responses/Error" },
        },
      },
    },
  },
};

swaggerSpecification.components.parameters = {
  UserId: {
    name: "id",
    in: "path",
    required: true,
    schema: { type: "string", example: "507f1f77bcf86cd799439011" },
  },
};

export default swaggerSpecification;
