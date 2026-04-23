import { post } from "../../../shared/api/httpClient";

export async function evaluateProblem(problem) {
  return post("/evaluate", { problem });
}
