#!/usr/bin/env python3
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
COMPOSE_FILE = ROOT / "docker-compose.yml"


def fail(message: str, code: int = 1) -> None:
    print(message, file=sys.stderr)
    raise SystemExit(code)


def require_docker() -> None:
    if shutil.which("docker") is None:
        fail("Docker is not installed or not available in PATH.")


def run_compose(args: list[str]) -> int:
    require_docker()
    if not COMPOSE_FILE.exists():
        fail(f"Missing compose file: {COMPOSE_FILE}")

    command = ["docker", "compose", "-f", str(COMPOSE_FILE), *args]
    completed = subprocess.run(command, cwd=ROOT)
    return completed.returncode


def print_help() -> None:
    print(
        """Usage: python run.py <command>

Commands:
  up       Build and start the app container in detached mode
  down     Stop and remove the app container
  build    Build the Docker image
  restart  Recreate the app container
  logs     Follow docker compose logs
  ps       Show container status
"""
    )


def main() -> int:
    command = sys.argv[1].lower() if len(sys.argv) > 1 else "help"

    if command in {"help", "-h", "--help"}:
        print_help()
        return 0
    if command == "up":
        return run_compose(["up", "--build", "-d"])
    if command == "down":
        return run_compose(["down"])
    if command == "build":
        return run_compose(["build"])
    if command == "restart":
        return run_compose(["up", "--build", "-d", "--force-recreate"])
    if command == "logs":
        return run_compose(["logs", "-f"])
    if command == "ps":
        return run_compose(["ps"])

    fail(f"Unknown command: {command}\n")
    print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
