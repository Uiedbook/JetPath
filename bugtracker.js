const ctx = {};
const method = function () {
  return this;
};

ctx.method = method.bind(ctx); // the problem is here

ctx.val = 1;
const ctx2 = Object.create(ctx);
ctx2.val = 2;
// at this point we can't edit ctx2 even if we want to;
console.log(ctx2.method()); // { method: [Function: bound method], val: 1 }

// we want { method: [Function: bound method], val: 2 }
