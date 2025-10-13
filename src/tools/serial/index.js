// src/tools/serial/index.js
// Central export for all serial number decoding tools by brand.
// Add new brands here as they’re created.

export * as jandy from "./jandy";
// export * as hayward from "./hayward";
// export * as pentair from "./pentair";
// Example usage:
// import { jandy } from "@/tools/serial";
// const info = jandy.decodeJandyJxiSerial("LB2430XXXXNGVF");