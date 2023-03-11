const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const Report = require("../models/Report");
const helper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await report.deleteMany({});
  const reportObjects = helper.initialreports.map(
    (report) => new Report(report)
  );
  const promiseArray = reportObjects.map((report) => report.save());
  await Promise.all(promiseArray);
});

test("all reports are returned", async () => {
  const response = await api.get("/reports");
  expect(response.body).toHaveLength(helper.initialreports.length);
});

test("a specific report is within the returned reports", async () => {
  const response = await api.get("/reports");
  const contents = response.body.map((r) => r.title);
  expect(contents).toContain("fighting");
});

test("a valid report can be added", async () => {
  const newreport = {
    title: "sexual harrsement",
    withness: "Victim",
    tbody: "sexual harrsement could you define the complexity of the grey area.",
    img: ["img1.jpg"],
  };
  await api
    .post("/reports")
    .send(newreport)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const reportAtEnd = await helper.reportInDB();
  expect(reportAtEnd).toHaveLength(helper.initialreports.length + 1);
  const contents = reportAtEnd.map((n) => n.title);
  expect(contents).toContain("sexual harrsement");
});

test("report without title is not added", async () => {
  const newreport = {
    withness: "Victim",
    tbody: "best report in England with free wifi, and accomodation",
    img: ["img1.jpg"],
  };
  await api.post("/reports").send(newreport).expect(400);

  const reportAtEnd = await helper.reportInDB();

  expect(reportAtEnd).toHaveLength(helper.initialreports.length);
});

test("a specific report can be viewed", async () => {
  const reportAtStart = await helper.reportInDB();

  const reportToView = reportAtStart[0];
  const result = await api
    .get(`/reports/${reportToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(result.body).toEqual(reportToView);
});

test("a report can be deleted", async () => {
  const reportAtStart = await helper.reportInDB();
  const reportToDelete = reportAtStart[0];

  await api.get(`/reports/${reportToDelete.id}`).expect(204);

  const reportAtEnd = await helper.reportInDB();
  expect(reportAtEnd).toHaveLength(helper.initialreports - 1);

  const contents = reportAtEnd.map((r) => r.title);
  expect(contents).not.toContain(reportToDelete.title);
});

afterAll(async () => {
  await mongoose.connection.close();
});
