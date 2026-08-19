# Taken from: https://spwoodcock.dev/blog/2026-03-03-automate-garage-standalone/
# Modified to add environment variable support

# chroot into the s3 container's filesystem so the garage binary runs
# with its own libs/linker, while the shared network namespace keeps
# 127.0.0.1:3901 pointing at the live Garage server
G="chroot /proc/1/root /garage -c /etc/garage.toml"

# Wait for server
for i in $(seq 1 20); do
    if $G node id -q 2>/dev/null; then break; fi
    echo "Waiting for Garage RPC... ($i/20)"
    sleep 3
done
$G node id -q || { echo "Garage RPC not ready"; exit 1; }

# Init garage nodes
if $G status 2>&1 | grep -q 'NO ROLE ASSIGNED'; then
    NODE_ID=$($G node id -q | cut -c1-16)
    $G layout assign "$NODE_ID" -z local -c 1G
    $G layout apply --version 1
fi

# Create S3 bucket
$G key import --yes -n "$S3_ACCESS_KEY_NAME" \
    "$S3_ACCESS_KEY_ID" \
    "$S3_ACCESS_KEY_SECRET" || true
$G bucket create "$S3_BUCKET" || true
$G bucket allow "$S3_BUCKET" --key "$S3_ACCESS_KEY_NAME" --read --write --owner || true
$G bucket website --allow "$S3_BUCKET"

echo "Garage initialized."
