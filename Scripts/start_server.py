import subprocess
import os
import sys

def run_command_sync(command, cwd):
    print(f"\n======================================")
    print(f"Running: {command}")
    print(f"======================================")
    result = subprocess.run(command, shell=True, cwd=cwd)
    if result.returncode != 0:
        print(f"WARNING: '{command}' exited with code {result.returncode}.")
    else:
        print(f"SUCCESS: '{command}'")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    pid_file = os.path.join(script_dir, "server.pid")

    print(f"Starting deployment sequence in {project_root}...\n")
    
    # Run the pre-start checks sequentially
    run_command_sync("npm run format", cwd=project_root)
    run_command_sync("npm run typecheck", cwd=project_root)
    run_command_sync("npm run lint", cwd=project_root)
    run_command_sync("npm run build", cwd=project_root)
    
    print("\n======================================")
    print("Starting Next.js server (npm run start)...")
    print("======================================")
    
    # We use taskkill later, so starting a new process group helps on Windows
    process = subprocess.Popen(
        "npm run start", 
        shell=True, 
        cwd=project_root,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
    )
    
    with open(pid_file, "w") as f:
        f.write(str(process.pid))
        
    print(f"Server started with PID {process.pid}. Keep this terminal open or run stop_server.py to terminate.")
    
    try:
        # Block and wait for the process so the terminal remains active
        process.wait()
    except KeyboardInterrupt:
        print("\nStopping server via KeyboardInterrupt...")
        try:
            subprocess.run(f"taskkill /F /T /PID {process.pid}", shell=True)
        except Exception:
            pass
        if os.path.exists(pid_file):
            try:
                os.remove(pid_file)
            except Exception:
                pass

if __name__ == "__main__":
    main()
