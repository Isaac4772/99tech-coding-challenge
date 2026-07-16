import { describe, test, expect, spyOn, mock, afterEach } from "bun:test";
import * as service from "@/services/task.service";
import * as controller from "@/controllers/task.controller";

// Unit tests for the controller branches the e2e suite can't reach:
function mockRes() {
  const res: any = {};
  res.status = mock(() => res);
  res.json = mock(() => res);
  return res;
}

afterEach(() => {
  mock.restore();
});

describe("task.controller (branches)", () => {
  test("taskCreateController forwards errors to next()", async () => {
    const err = new Error("boom");
    spyOn(service, "createTaskService").mockRejectedValue(err);
    const req: any = { body: {} };
    const res = mockRes();
    const next = mock();
    await controller.taskCreateController(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test("getTaskByIdController responds 400 when id is not a string, without hitting the service", async () => {
    const spy = spyOn(service, "getTaskByIdService");
    const req: any = { params: {} };
    const res = mockRes();
    const next = mock();
    await controller.getTaskByIdController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(spy).not.toHaveBeenCalled();
  });

  test("updateTaskController responds 400 when id is not a string, without hitting the service", async () => {
    const spy = spyOn(service, "updateTaskService");
    const req: any = { params: {}, body: {} };
    const res = mockRes();
    const next = mock();
    await controller.updateTaskController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(spy).not.toHaveBeenCalled();
  });

  test("updateTaskController forwards errors to next()", async () => {
    const err = new Error("boom");
    spyOn(service, "updateTaskService").mockRejectedValue(err);
    const req: any = { params: { id: "id-1" }, body: {} };
    const res = mockRes();
    const next = mock();
    await controller.updateTaskController(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test("deleteTaskController responds 400 when id is not a string, without hitting the service", async () => {
    const spy = spyOn(service, "deleteTaskService");
    const req: any = { params: {} };
    const res = mockRes();
    const next = mock();
    await controller.deleteTaskController(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(spy).not.toHaveBeenCalled();
  });
});
