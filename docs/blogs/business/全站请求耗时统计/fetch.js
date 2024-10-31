import EventBus from './EventBus';

const fetch = (url, options) => {
  const id = Math.random().toString(36).slice(2);
  const fetchStartEvent = new CustomEvent('fetchStart', {
    detail: {
      id,
      url,
      method: options.method || 'GET',
    },
  });
  EventBus.dispatchEvent(fetchStartEvent);
  return window.fetch(url, options)
    .then((response) => {
      const fetchEndEvent = new CustomEvent('fetchEnd', {
        detail: {
          id,
          url,
          method: options.method || 'GET',
        },
      });
      EventBus.dispatchEvent(fetchEndEvent);
      return response;

    });
};

export default fetch;