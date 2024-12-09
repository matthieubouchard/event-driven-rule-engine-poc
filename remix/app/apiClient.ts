import {Api} from "../../server/src/api_docs/api";

export const {api: apiClient} = new Api({
  baseUrl: process?.env?.API_URL ?? "http://localhost:3000",
});
