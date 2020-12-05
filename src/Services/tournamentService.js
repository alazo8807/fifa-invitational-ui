import http from "./httpService";

const apiEndpoint = "/tournaments";

function tournamentUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getTournaments(useCurrentUser=false) {
  if (useCurrentUser) return http.get(`${apiEndpoint}/me`);
  
  return http.get(apiEndpoint);
}

export function getTournament(tournamentId) {
  return http.get(tournamentUrl(tournamentId));
}

export function saveTournament(tournament) {
  if (tournament._id) {
    const body = { ...tournament };
    delete body._id;
    return http.put(tournamentUrl(tournament._id), body);
  }

  return http.post(apiEndpoint, tournament);
}

export function deleteTournament(tournamentId) {
  return http.delete(tournamentUrl(tournamentId));
}
