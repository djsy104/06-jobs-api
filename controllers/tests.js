const Test = require("../models/Tests");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllTests = async (req, res) => {
  const tests = await Test.find({ createdBy: req.user.userId }).sort(
    "createdAt",
  );
  res.status(StatusCodes.OK).json({ tests, count: tests.length });
};

const getTest = async (req, res) => {
  const {
    user: { userId },
    params: { id: testId },
  } = req;

  const test = await Test.findOne({
    createdBy: userId,
    _id: testId,
  });

  if (!test) {
    throw new NotFoundError(`Unable to find test with id ${testId}`);
  }

  res.status(StatusCodes.OK).json({ test });
};

const createTest = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const test = await Test.create(req.body);
  res.status(StatusCodes.CREATED).json({ test });
};

const updateTest = async (req, res) => {
  const {
    body: { name, type },
    user: { userId },
    params: { id: testId },
  } = req;

  if (name === "" || type === "") {
    throw new BadRequestError("'Name' and 'Type' cannot be empty");
  }

  const test = await Test.findOneAndUpdate(
    {
      createdBy: userId,
      _id: testId,
    },
    req.body,
    { new: true, runValidators: true },
  );

  if (!test) {
    throw new NotFoundError(`Unable to find test with id ${testId}`);
  }

  res.status(StatusCodes.OK).json({ test });
};

const deleteTest = async (req, res) => {
  const {
    user: { userId },
    params: { id: testId },
  } = req;

  const test = await Test.findOneAndDelete({
    createdBy: userId,
    _id: testId,
  });

  if (!test) {
    throw new NotFoundError(`Unable to find test with id ${testId}`);
  }

  res.status(StatusCodes.OK).json({ test });
};

module.exports = { getAllTests, getTest, createTest, updateTest, deleteTest };
