class RadixNode {
  part: string;
  children: {};
  handler: null;
  isDynamic: boolean;
  constructor(part = "") {
    this.part = part;
    this.children = {};
    this.handler = null;
    this.isDynamic = part.startsWith(":");
  }
}
class RadixTree {
  root: RadixNode;
  constructor() {
    this.root = new RadixNode();
  }

  insert(url, handler) {
    const parts = url.split("/").filter(Boolean);
    let node = this.root;
    for (const part of parts) {
      if (!node.children[part]) {
        node.children[part] = new RadixNode(part);
      }
      node = node.children[part];
    }
    node.handler = handler;
  }

  match(url: string) {
    const parts = url.split("/").filter(Boolean);
    let node = this.root;
    const params = {};

    for (const part of parts) {
      if (node.children[part]) {
        node = node.children[part];
      } else {
        let found = false;
        for (const key in node.children) {
          if (node.children[key].isDynamic) {
            params[node.children[key].part.slice(1)] = part;
            node = node.children[key];
            found = true;
            break;
          }
        }
        if (!found) {
          return null; // No match found
        }
      }
    }
    return node.handler ? { handler: node.handler, params } : null;
  }
}

const tree = new RadixTree();

tree.insert("/user/:id", () => {
  //   console.log("User Handler");
  return new Response("User Handler");
});
tree.insert("/post/:id", () => {
  //   console.log("Post Handler");
  return new Response("Post Handler");
});

Bun.serve({
  port: 9802,
  fetch: () => {
    // Matching
    const handler = tree.match("/user/123");
    if (handler) {
      return handler.handler();
    } else {
      return new Response("Not Found");
    }
  },
});
