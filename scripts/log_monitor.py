def monitor_log(file_path, keywords):
    with open(file_path, 'r') as f:
        lines = f.readlines()
        for line in lines:
            for keyword in keywords:
                if keyword.lower() in line.lower():
                    print(f"Suspicious entry: {line.strip()}")

# Example usage
if __name__ == "__main__":
    monitor_log("/var/log/auth.log", ["failed", "unauthorized", "denied"])
