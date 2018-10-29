import axios from 'axios';
import {store} from '../store';
import {wrapApiErrors} from '../utils';

const Api = {
  get(route, data, params) {
    return this.xhr(route, data, params, 'get');
  },

  put(route, data, params) {
    return this.xhr(route, data, params, 'put');
  },

  post(route, data, params) {
    return this.xhr(route, data, params, 'post');
  },

  postFormData(route, data, params) {
    return this.xhr(route, data, params, 'post', true);
  },

  delete(route, data, params) {
    return this.xhr(route, data, params, 'delete');
  },

  replaceVariables(route, params) {
    Object.keys(params).forEach((key) => {
      route = route.replace(`:${key}`, params[key]);
    });
    return route;
  },

  all(promises) {
    return axios.all(promises);
  },

  xhr(route, data = {}, params = {}, method, isFormData) {
    const state = store.getState();
    const {auth: {user}} = state;

    const sendRequest = (axiosInstance, mockInstance = false) => {
      const url = this.replaceVariables(route, params);
      let headers = {
        'Content-Type': 'application/json',
      };

      if (isFormData) {
        headers = {
          'Content-Type': 'multipart/form-data',
        };
      }

      if (user) {
        headers.Authorization = `Bearer ${state.auth.user.token}`;
      }
      const options = {
        baseURL: API_URL,
        url,
        method,
        headers,
        crossdomain: true,
      };

      if (method === 'get') {
        options.params = data;
      } else {
        options.data = data;

        if (isFormData) {
          const formdata = new FormData();

          Object.keys(data).forEach((key) => {
            formdata.append(key, data[key]);
          });

          options.data = formdata;
        }
      }

      return axiosInstance(options)
        .then((res) => {
          if (mockInstance) {
            mockInstance.reset();
            mockInstance = false;
          }
          return res.data;
        })
        .catch(error => wrapApiErrors(error));
    };
    return sendRequest(axios.create());
  }
};

export default Api;
