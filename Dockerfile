FROM ndslabs/jupyterlab 

USER root

# Install OS dependencies
RUN apt-get update && \
    apt-get install -y curl sudo

# Install NodeJS and NPM
RUN wget https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    sudo apt-get install -y nodejs npm

# Set up plugin working directory
USER jovyan
ENV SRCDIR="/home/jovyan/work/jupyterlab_cis"
RUN mkdir -p $SRCDIR
WORKDIR $SRCDIR

# Install NPM dependencies
COPY package.json .
RUN npm install

# Copy in our extension source
COPY src/* $SRCDIR/src/
COPY style/* $SRCDIR/style/
COPY tsconfig.json .

# Perform TypeScript compile and install extension
RUN npm install -g typescript
RUN jupyter labextension install

# Add documentation last
COPY Untitled.ipynb Dockerfile README.md ./
#WORKDIR /home/jovyan
