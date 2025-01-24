"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core3 = require("@keystone-6/core");

// schemas/Product.ts
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_access = require("@keystone-6/core/access");
var Product = (0, import_core.list)({
  access: import_access.allowAll,
  fields: {
    name: (0, import_fields.text)({ validation: { isRequired: true } }),
    price: (0, import_fields.integer)({
      validation: { isRequired: true },
      defaultValue: 0
    }),
    description: (0, import_fields.text)({
      ui: {
        displayMode: "textarea"
      }
    }),
    isFeatured: (0, import_fields.checkbox)({ defaultValue: false }),
    productImage: (0, import_fields.image)({
      storage: "localImages"
    })
    // categories: relationship({
    //     ref: 'Category.products',
    //     many: true,
    // }),
  },
  ui: {
    listView: {
      initialColumns: ["name", "price", "isFeatured"],
      pageSize: 10
    }
  }
});

// schemas/User.ts
var import_core2 = require("@keystone-6/core");
var import_fields2 = require("@keystone-6/core/fields");
var import_access2 = require("@keystone-6/core/access");
var User = (0, import_core2.list)({
  access: import_access2.allowAll,
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true } }),
    email: (0, import_fields2.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    password: (0, import_fields2.password)({ validation: { isRequired: true } })
  }
});

// schemas/index.ts
var lists = {
  Product,
  User
};

// keystone.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var import_path = __toESM(require("path"));
var import_dotenv = __toESM(require("dotenv"));
console.log("Starting Keystone init...");
var envPath = import_path.default.resolve(__dirname, "../.env");
console.log("Using env file at:", envPath);
import_dotenv.default.config({ path: envPath });
console.log("SESSION_SECRET is:", process.env.SESSION_SECRET);
var sessionConfig = {
  maxAge: 60 * 60 * 24 * 30,
  // 30 days
  secret: process.env.SESSION_SECRET || "some-long-secret-value"
};
console.log("Creating auth config...");
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"]
  }
});
console.log("Setting up Keystone config...");
var keystone_default = withAuth(
  (0, import_core3.config)({
    db: {
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    storage: {
      localImages: {
        kind: "local",
        type: "image",
        generateUrl: (path2) => `/images${path2}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      }
    },
    session: (0, import_session.statelessSessions)(sessionConfig),
    ui: {
      // Restrict the Admin UI to signed-in admin users:
      isAccessAllowed: (context) => !!context.session?.data
    },
    server: {
      port: 3001,
      cors: {
        origin: ["http://localhost:3000"],
        credentials: true
      }
    }
  })
);
//# sourceMappingURL=config.js.map
