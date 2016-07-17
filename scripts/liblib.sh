docker run -it \
  -v /usr/bin/docker:/usr/bin/docker \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /lib64/libdevmapper.so.1.02:/usr/lib/x86_64-linux-gnu/libdevmapper.so.1.02 \
  -v /lib64/libudev.so.0:/usr/lib/x86_64-linux-gnu/libudev.so.0 \
  node:6.2.2-slim \
  bash
# /usr/lib/x86_64-linux-gnu/
