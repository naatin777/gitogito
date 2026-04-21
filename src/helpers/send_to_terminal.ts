import { closeSync, openSync, writeSync } from "node:fs";
import { platform } from "node:os";

export function sendToTerminal(sequence: string): void {
  const isWindows = platform() === "win32";
  const ttyPath = isWindows ? "CONOUT$" : "/dev/tty";

  let fd: number | undefined;

  try {
    fd = openSync(ttyPath, "w");
    writeSync(fd, sequence);
  } catch (_err) {
    process.stderr.write(sequence);
  } finally {
    if (fd !== undefined) {
      try {
        closeSync(fd);
      } catch {
        // ignore close errors
      }
    }
  }
}
