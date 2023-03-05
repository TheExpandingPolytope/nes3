# dapp dependencies stage
FROM --platform=linux/riscv64 riscv64/ubuntu:22.04 as dapp-build

ARG DEBIAN_FRONTEND=noninteractive
ARG TZ=Etc/UTC

RUN apt update && apt install -y python3 python3-opencv python3-shapely python3-requests python3-base58 python3-pycryptodome python3-pip ffmpeg mesa-utils git make libsdl2-2.0-0 
RUN apt update && apt install -y wget cmake gnupg2
RUN apt update && apt install -y xvfb
RUN apt update && apt install -y libglfw3 libglfw3-dev


# RUN pip3 install eth_abi protobuf

# RUN apt remove -y python3-pip

RUN apt update && apt install -y libsdl2-dev mesa-vulkan-drivers
ENV SDL2_LIBRARY=/usr/lib/x86_64-linux-gnu/libSDL2-2.0.so.0
ENV SDL2_INCLUDE_DIR=/usr/include/SDL2
ENV CMAKE_PREFIX_PATH="/usr/lib/x86_64-linux-gnu:/usr/lib/riscv64-linux-gnu"
ENV PATH="/path/to/vulkan-sdk/bin:${PATH}"
# # Get the path of the mesa-vulkan-drivers installation
# RUN MESAPATH="$(dpkg -L mesa-vulkan-drivers | grep bin/glslc | xargs dirname)"

# # Set the environment variable for glslc to be accessible to everyone
# ENV PATH="$MESAPATH:$PATH"

# # Test if glslc is now accessible
# RUN glslc --version


# WORKDIR /opt/cartesi/dapp
# RUN export GOOS=linux && \
#     export GOARCH=riscv64 && \
#     export CC_FOR_TARGET=riscv64-cartesi-linux-gnu-gcc && \
#     export CMAKE_C_COMPILER=riscv64-cartesi-linux-gnu-gcc && \
#     export CMAKE_CXX_COMPILER=riscv64-cartesi-linux-gnu-g++ && \
#     export CXX_FOR_TARGET=riscv64-cartesi-linux-gnu-g++ && \
#     git clone https://github.com/Dillonb/n64.git && \
#     cd n64 && \
#     mkdir build && cd build && \
#     cmake .. -DCMAKE_BUILD_TYPE=Release -DCMAKE_SDL2_LIBRARY=/usr/lib/riscv64-linux-gnu/libSDL2-2.0.so.0 -DCMAKE_SDL2_INCLUDE_DIR=/usr/include/SDL2 && \
#     make

WORKDIR /opt


# dapp files stage
FROM cartesi/toolchain:0.12.0 as dapp-files-build

WORKDIR /opt/cartesi/dapp

COPY dapp .
