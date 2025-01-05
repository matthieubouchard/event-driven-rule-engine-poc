import {Api} from "../../server/src/api_docs/api";

export const {api: apiClient} = new Api({
  baseUrl: "http://localhost:3000",
});
