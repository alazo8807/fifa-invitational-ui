import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/matches";

function matchUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getMatches() {
  return http.get(apiEndpoint);
}

export function getMatch(matchId) {
  return http.get(matchUrl(matchId));
}

export function saveMatch(match) {
  if (match._id) {
    const body = { ...match };
    delete body._id;
    return http.put(matchUrl(match._id), body);
  }

  return http.post(apiEndpoint, match);
}

export function deleteMatch(matchId) {
  return http.delete(matchUrl(matchId));
}
