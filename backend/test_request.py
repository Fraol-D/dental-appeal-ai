import json
import urllib.error
import urllib.request


API_URL = "http://127.0.0.1:8000/generate-appeal"


def main() -> None:
    payload = {
        "denial_text": "Claim denied due to frequency limitation for prophylaxis; service billed too soon after prior cleaning.",
        "payer_name": "Delta Dental",
        "cdt_code": "D1110",
    }

    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        API_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read().decode("utf-8")
            parsed = json.loads(body)
            print(json.dumps(parsed, indent=2))
    except urllib.error.HTTPError as error:
        error_body = error.read().decode("utf-8", errors="replace")
        print(f"HTTP {error.code}: {error_body}")
    except urllib.error.URLError as error:
        print(f"Connection error: {error}")


if __name__ == "__main__":
    main()
