import os
import subprocess

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    pid_file = os.path.join(script_dir, "server.pid")
    
    if not os.path.exists(pid_file):
        print("PID file not found. Server may not be running.")
        return
        
    with open(pid_file, "r") as f:
        pid_str = f.read().strip()
        
    if not pid_str:
        print("Invalid PID file.")
        return
        
    pid = int(pid_str)
    print(f"Stopping server with PID {pid}...")
    try:
        # Use taskkill to forcefully kill process tree on Windows
        subprocess.run(f"taskkill /F /T /PID {pid}", shell=True, check=True)
        print("Server stopped successfully.")
    except Exception as e:
        print(f"Failed to stop server: {e}")
        
    os.remove(pid_file)

if __name__ == "__main__":
    main()
