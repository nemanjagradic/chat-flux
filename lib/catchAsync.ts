// lib/catchAsyncAction.ts
import { AppError } from "./appError";
import { MongoServerError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import {
  handleDuplicateErrorDB,
  handleCastErrorDB,
  handleValidationError,
} from "./appErrorHelpers";

type ActionResult<T> = T | { error: string };

export const catchAsyncAction = <T, R>(fn: (data: T) => Promise<R>) => {
  return async (data: T): Promise<ActionResult<R>> => {
    try {
      return await fn(data);
    } catch (err: unknown) {
      let error: AppError;

      if (err instanceof AppError) {
        error = err;
      } else if (err instanceof MongooseError.ValidationError) {
        error = handleValidationError(err);
      } else if (err instanceof MongooseError.CastError) {
        error = handleCastErrorDB(err);
      } else if (err instanceof MongoServerError && err.code === 11000) {
        error = handleDuplicateErrorDB(err);
      } else {
        error = new AppError(
          err instanceof Error ? err.message : "Something went wrong",
          500,
        );
      }

      return { error: error.message };
    }
  };
};
