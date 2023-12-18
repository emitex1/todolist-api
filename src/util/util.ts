import express, { Request, Response } from "express";

export const returnSuccess = (
  res: Response,
  data: unknown,
  message?: string
) => {
  let responseObj: { count?: number; data: unknown; message?: string } = {
    data,
    message,
  };
  if (Array.isArray(data)) {
    responseObj.count = data.length;
  }
  return res.status(200).json(responseObj);
};

export const returnFailure = (
  res: Response,
  status: number,
  message?: string
) =>
  res.status(status).json({
    message,
  });
