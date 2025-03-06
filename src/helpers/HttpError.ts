const HttpError = (message: string, status: number) => {
  const error: {
    message: string;
    status?: number;
  } = new Error(message);
  error.status = status;

  return error;
};

export { HttpError };
