const openapi = {
  openapi: "3.0.0",

  info: {
    title: "ChatBit API",
    version: "1.0.0",
    description: "API for ChatBit support application"
  },

  servers: [
    {
      url: "http://localhost:3000/"
    }
  ],

  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  full_name: {
                    type: "string"
                  },
                  email: {
                    type: "string"
                  },
                  password: {
                    type: "string"
                  },
                  role: {
                    type: "string",
                    enum: ["client", "agent"]
                  }
                }
              }
            }
          }
        }
      }
    },

    "/api/auth/login": {
      post: {
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string"
                  },
                  password: {
                    type: "string"
                  }
                }
              }
            }
          }
        }
      }
    },

    "/api/users/me": {
      get: {
        summary: "Get current user",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },

    "/api/conversations": {
      get: {
        summary: "Get conversations",
        security: [
          {
            bearerAuth: []
          }
        ]
      },

      post: {
        summary: "Create conversation",
        security: [
          {
            bearerAuth: []
          }
        ]
      }
    },
"/api/conversations/{id}/messages": {
      get: {
        summary: "Get conversation messages",
        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ]
      }
    },

    "/api/conversations/{id}/close": {
      patch: {
        summary: "Close conversation",
        security: [
          {
            bearerAuth: []
          }
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ]
      }
    }
  },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

module.exports = openapi;
