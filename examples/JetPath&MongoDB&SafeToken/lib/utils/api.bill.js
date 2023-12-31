"use strict";
// import Flutterwave from "@modules/flutterwave";
// import config from "./config/config";
// import logger from "@modules/logger/logger";
// import {
//   BillingCategoryResponse,
//   CreateBillPayload,
//   CreateBillResponse,
//   GetBillingCategoriesPayload,
//   ValidateBillResponse,
//   ValidateBillingPayload,
// } from "@modules/flutterwave/interfaces/interface.bills.flutterwave";
// const flw = new Flutterwave(
//   String(config.flutterwaveAPI.key),
//   String(config.flutterwaveAPI.secret)
// );
// /**
//  * Get Bill Categories API
//  * @param {GetBillingCategoriesPayload} request
//  * @returns {Promise<BillingCategoryResponse>}
//  */
// export const getBillCategoriesAPI = async (
//   request?: GetBillingCategoriesPayload
// ): Promise<BillingCategoryResponse> => {
//   try {
//     const data = await flw.Bills.fetchBillsCat(request);
//     // if !response {}
//     return data;
//   } catch (error) {
//     logger.error("Failed to Fetch Bill categories: ", error);
//     throw new Error("Failed to Fetch Bill categories.");
//   }
// };
// /**
//  * Validate a bill service API
//  * @param {ValidateBillingPayload} request
//  * @returns {Promise<ValidateBillResponse>}
//  */
// export const validateBillAPI = async (
//   request: ValidateBillingPayload
// ): Promise<ValidateBillResponse> => {
//   try {
//     const data = await flw.Bills.validate(request);
//     return data;
//   } catch (error) {
//     logger.error("Failed to validate bill: ", error);
//     throw new Error("Failed to validate bill.");
//   }
// };
// /**
//  * Create Bill Payment API
//  * @param {CreateBillPayload} request
//  * @returns {Promise<CreateBillResponse>}
//  */
// export const createBillPaymentAPI = async (
//   request: CreateBillPayload
// ): Promise<CreateBillResponse> => {
//   try {
//     const data = await flw.Bills.createBill(request);
//     return data;
//   } catch (error) {
//     logger.error("Failed to create bill payment: ", error);
//     throw new Error("Failed to create bill payment.");
//   }
// };
// // const payload: IBillCategoryRequestFilters = {
// //   airtime: 'NG',
// //   data_bundle: customer, // '+23490803840303'
// //   power: amount,
// //   internet: 'ONCE',
// //   toll: 'AIRTIME',
// //   cable: reference, // '930rwrwr0049404444'
// //   biller_code: request,
// // };
