//
// Instance for calling
// Backend API
//
import axios from 'axios';

export default axios.create({
  baseURL: '/api',
  timeout: 15000
})
