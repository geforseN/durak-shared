import { isObject } from "./guards/is-object";
import { isString } from "./guards/is-string";

export function parseWebSocketEventData(data: unknown) {
  if (typeof data !== "string") {
    throw new TypeError("WebSocket event data is not a string");
  }
  const json = JSON.parse(data) as unknown;
  if (!json || !isObject(json)) {
    throw new TypeError("WebSocket event data is not an object");
  }
  if (!("event" in json) || !isString(json.event)) {
    throw new Error(
      "WebSocket event data does not have 'event' string property"
    );
  }
  if (!("payload" in json) || !isObject(json.payload)) {
    throw new Error(
      "WebSocket event data does not have 'payload' object property"
    );
  }
  return json as {
    event: string;
    payload: object;
  };
}
