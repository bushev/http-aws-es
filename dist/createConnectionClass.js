"use strict";
/**
 * A connection handler for Amazon ES.
 *
 * Uses the aws-sdk to make signed requests to an Amazon ES endpoint.
 *
 * @param client {Client} - The Client that this class belongs to
 * @param config {Object} - Configuration options
 * @param [config.protocol=http:] {String} - The HTTP protocol that this connection will use, can be set to https:
 * @class HttpConnector
 */
Object.defineProperty(exports, "__esModule", { value: true });
const aws4 = require("aws4");
const elasticsearch_1 = require("@elastic/elasticsearch");
function createConnectionClass(awsConfig) {
    return class extends elasticsearch_1.Connection {
        request(params, cb) {
            const originalMakeRequest = this.makeRequest;
            this.makeRequest = (reqParams) => {
                reqParams.host = this.url.host;
                // @ts-ignore
                reqParams.region = awsConfig.region;
                aws4.sign(reqParams, awsConfig.credentials);
                return originalMakeRequest(reqParams);
            };
            return super.request(params, cb);
        }
    };
}
exports.createConnectionClass = createConnectionClass;
