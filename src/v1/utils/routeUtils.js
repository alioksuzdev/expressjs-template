const { Router } = require('express');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const authUtils = require('./authUtils');
const requestMethods = require('../constants/requestMethods');

module.exports = {
  mountRoutes(routes) {
    const app = Router();
    routes.forEach((route) => {
      const {
        path, method, controller, validator, requiresAuthentication = true, files = [],
      } = route;

      const handler = async (request, response) => {
        try {
          await validator(request);
          await authUtils.authenticateRequest(request, requiresAuthentication);
          const payload = await controller(request);
          if (payload.behaviourOverride) {
            if (payload.behaviourOverride === 'redirect') {
              const { redirectUri } = payload;
              return response.redirect(307, redirectUri);
            }
          }
          return response.send(payload);
        } catch (e) {
          let statusCode = 500;
          if (e.isPleebError) {
            statusCode = e.code;
            delete e.isPleebError;
          }
          e.code = statusCode;
          response.status(statusCode);
          return response.send(e);
        }
      };

      if (method === requestMethods.GET) {
        app.get(path, handler);
      }
      if (method === requestMethods.POST) {
        if (files.length > 0) {
          app.post(path, upload.fields(files), handler);
        } else {
          app.post(path, handler);
        }
      }
      if (method === requestMethods.PUT) {
        if (files.length > 0) {
          app.put(path, upload.fields(files), handler);
        } else {
          app.put(path, handler);
        }
      }
      if (method === requestMethods.DELETE) {
        app.delete(path, handler);
      }
    });

    return app;
  },
};
