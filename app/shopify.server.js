import "@shopify/shopify-app-remix/adapters/node";
import {
    AppDistribution,
    DeliveryMethod,
    shopifyApp,
    LATEST_API_VERSION,
} from "@shopify/shopify-app-remix";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";
import mongoose from "mongoose";
import prisma from "./db.server";
import GraphQLServer from "./graphql/graphql.server";
import {Agenda} from "agenda";

const shopify = shopifyApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
    apiVersion: LATEST_API_VERSION,
    scopes: process.env.SCOPES?.split(","),
    appUrl: process.env.SHOPIFY_APP_URL || "",
    authPathPrefix: "/auth",
    sessionStorage: new PrismaSessionStorage(prisma),
    distribution: AppDistribution.AppStore,
    restResources,
    webhooks: {
        APP_UNINSTALLED: {
            deliveryMethod: DeliveryMethod.Http,
            callbackUrl: "/webhooks",
        },
    },
    hooks: {
        afterAuth: async ({ session }) => {
            await shopify.registerWebhooks({session});
        },
    },
    future: {
        v3_webhookAdminContext: true,
        v3_authenticatePublic: true,
    },
    ...(process.env.SHOP_CUSTOM_DOMAIN
        ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
        : {}),
});


const dbConnectionString = "mongodb+srv://trungvt4697:20194697@cluster0.vikgmv5.mongodb.net/gr3?retryWrites=true&w=majority&appName=Cluster0";
export const agenda = new Agenda({
   db: {
       address: dbConnectionString,
       collection: 'auctionJobs',
   }
});

mongoose.set("debug", true);
mongoose.set("debug", { color: true });
mongoose
    .connect(dbConnectionString)
    .then((result) => {
        console.log("Connect to mongodb successfully");
        GraphQLServer();
        agenda.start().then(r => {
            console.log('agenda is running');
        });
    })
    .catch((err) => {
        console.log("Error occurred when connect to mongodb: ", err.message);
    });

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
