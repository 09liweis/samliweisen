import { HttpHeaders } from '@angular/common/http';

const API = 'https://samliweisen.onrender.com/api/';
// const API = 'http://localhost:8081/api/'
function genAPI(endpoint) {
  let apiUrl = API + endpoint + '&origin=localhost';
  return apiUrl.replace('&','?');
}

function getAuthToken() {
  return localStorage.getItem('auth-token');
}

function buildHttpOptions() {
  var authToken = getAuthToken();
  var headers = new HttpHeaders();
  headers = headers.set('Content-Type','application/json');
  if (authToken) {
    headers = headers.set('auth-token',authToken);
  }
  return {
    headers
  };
}

export {
  genAPI,
  getAuthToken,
  buildHttpOptions
};