import { logger } from "@/lib/logger";

describe("Logger — Structured Logging", () => {
  const originalLog = console.log;
  const originalError = console.error;
  let logOutput: string[];
  let errorOutput: string[];

  beforeEach(() => {
    logOutput = [];
    errorOutput = [];
    console.log = jest.fn((...args: string[]) => logOutput.push(...args));
    console.error = jest.fn((...args: string[]) => errorOutput.push(...args));
  });

  afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
  });

  it("outputs valid JSON for info level", () => {
    logger.info("test message");
    expect(logOutput).toHaveLength(1);
    const parsed = JSON.parse(logOutput[0]);
    expect(parsed.severity).toBe("INFO");
    expect(parsed.message).toBe("test message");
    expect(parsed.timestamp).toBeTruthy();
  });

  it("outputs valid JSON for error level", () => {
    logger.error("error message");
    expect(errorOutput).toHaveLength(1);
    const parsed = JSON.parse(errorOutput[0]);
    expect(parsed.severity).toBe("ERROR");
    expect(parsed.message).toBe("error message");
  });

  it("includes metadata in log entries", () => {
    logger.info("with meta", { component: "TestComponent", count: 42 });
    const parsed = JSON.parse(logOutput[0]);
    expect(parsed.component).toBe("TestComponent");
    expect(parsed.count).toBe(42);
  });

  it("outputs debug level to stdout", () => {
    logger.debug("debug msg");
    expect(logOutput).toHaveLength(1);
    const parsed = JSON.parse(logOutput[0]);
    expect(parsed.severity).toBe("DEBUG");
  });

  it("outputs warning level to stdout", () => {
    logger.warn("warning msg");
    expect(logOutput).toHaveLength(1);
    const parsed = JSON.parse(logOutput[0]);
    expect(parsed.severity).toBe("WARNING");
  });

  it("outputs critical level to stderr", () => {
    logger.critical("critical msg");
    expect(errorOutput).toHaveLength(1);
    const parsed = JSON.parse(errorOutput[0]);
    expect(parsed.severity).toBe("CRITICAL");
  });

  it("includes ISO timestamp in all entries", () => {
    logger.info("timestamp test");
    const parsed = JSON.parse(logOutput[0]);
    expect(() => new Date(parsed.timestamp)).not.toThrow();
    expect(parsed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
