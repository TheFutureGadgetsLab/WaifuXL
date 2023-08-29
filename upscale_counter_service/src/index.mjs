// Worker

export default {
  async fetch(request, env) {
    return await handleRequest(request, env);
  },
};

async function handleRequest(request, env) {
  const id = env.COUNTER.idFromName('A');
  const obj = env.COUNTER.get(id);
  const resp = await obj.fetch(request.url);
  const count = await resp.text();
  const response = new Response(count);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  return response;
}

// Durable Object

export class Counter {
  constructor(state, env) {
    this.state = state;
  }

  // Handle HTTP requests from clients.
  async fetch(request) {
    // Apply requested action.
    const url = new URL(request.url);

    // Durable Object storage is automatically cached in-memory, so reading the
    // same key every request is fast. (That said, you could also store the
    // value in a class member if you prefer.)
    let value = (await this.state.storage.get('value')) || 0;

    switch (url.pathname) {
      case '/increment':
        ++value;
        break;
      case '/':
        // Just serve the current value.
        break;
      case '/badge':
        return new Response(
          JSON.stringify({
            schemaVersion: 1,
            label: 'Images Upscaled',
            message: value.toString(),
            color: 'orange',
          }),
        );
      default:
        return new Response('Not found', { status: 404 });
    }

    // We don't have to worry about a concurrent request having modified the
    // value in storage because "input gates" will automatically protect against
    // unwanted concurrency. So, read-modify-write is safe. For more details,
    // see: https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/
    await this.state.storage.put('value', value);

    return new Response(value);
  }
}
