import axios from 'axios';

// Shipcheck parses this function without importing Axios or executing it.
export function example() {
  return axios.get('https://api.example.test/v1/users', {params: {q: 'alice'}});
}
