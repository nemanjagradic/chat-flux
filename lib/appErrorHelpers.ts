import { MongoServerError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import { AppError } from "./appError";

export const handleDuplicateErrorDB = (err: MongoServerError) => {
  const fieldName = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  return new AppError(
    `A user with ${fieldName}: "${value}" already exists. Please use a different one.`,
    400,
  );
};

export const handleCastErrorDB = (err: MongooseError.CastError) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

export const handleValidationError = (err: MongooseError.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join(" ")}`, 400);
};
