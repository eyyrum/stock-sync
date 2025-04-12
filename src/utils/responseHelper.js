class ResponseHelper {
  static success(message, data = null, code = 200) {
    const response = {
      success: true,
      code,
      message
    };

    if (data) {
      response.data = data;
      if (Array.isArray(data)) {
        response.count = data.length;
      }
    }

    return response;
  }

  static error(message, code = 500, error = null) {
    const response = {
      success: false,
      code,
      message
    };

    if (error && process.env.NODE_ENV === 'development') {
      response.error = error.stack || error.message || error;
    }

    return response;
  }
}

module.exports = ResponseHelper; 