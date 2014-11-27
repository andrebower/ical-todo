/**
 * Created by aab on 27.11.2014.
 */
"use strict";

exports.createHttpOptions = function (options, method, headers, suffix) {
   return {
        auth: options.auth,
        hostname: options.hostname,
        port: options.port || 80,
        path: options.path + suffix,
        method: method,
        headers: headers
    }
};

