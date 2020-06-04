FROM jupyter/minimal-notebook

RUN pip install jupyterlab==2.1.3 && \
    jupyter serverextension enable --py jupyterlab --sys-prefix

EXPOSE 8888
CMD ["jupyter", "lab"]

USER root

RUN apt-get update && \
    apt-get install -y curl sudo screen vim emacs25

RUN wget https://deb.nodesource.com/setup_14.x | sudo -E bash - && \
    sudo apt-get install -y nodejs gnupg

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

RUN sudo apt update && sudo apt install yarn
USER jovyan


# Set up common JupyterLab extensions

RUN jupyter labextension install jupyterlab-plotly
RUN yarn add @jupyterlab/launcher-extension
RUN jupyter labextension install @jupyter-widgets/jupyterlab-manager
RUN yarn add @jupyterlab/hub-extension

RUN echo 'STEP 5'

# Set up plugin working directory
ENV SRCDIR="/home/jovyan/work/jupyterlab_cis"
RUN mkdir -p $SRCDIR
WORKDIR $SRCDIR

RUN ln -s /home/jovyan/node_modules

RUN echo 'STEP 6'

# Install NPM dependencies
RUN yarn global add typescript

RUN echo 'STEP 7'

COPY package1.json package.json

RUN echo 'STEP 8'
RUN yarn install

RUN echo 'STEP 9'
RUN rm package.json
# Copy in our extension source
COPY package.json .
COPY src/* ./src/
COPY style/* ./style/
COPY tsconfig.json .

RUN echo 'STEP 10'

# Perform TypeScript compile and install extension
RUN jupyter labextension install

RUN echo 'STEP 11'

# Set up Cy-JupyterLab extension
RUN git clone https://github.com/astro-friedel/cy-jupyterlab /home/jovyan/work/cy-jupyterlab

RUN echo 'STEP 12'


WORKDIR /home/jovyan/work/cy-jupyterlab
RUN jupyter labextension install

RUN echo 'STEP 13'

# Add documentation last
COPY Dockerfile ./
WORKDIR /home/jovyan

# Enable nbgitpuller extension
RUN pip install nbgitpuller yggdrasil-framework ipywidgets matlab_kernel plotly networkx && \
    jupyter serverextension enable --py nbgitpuller --sys-prefix

RUN echo 'STEP 14'

# Add future MATLAB location to our PATH
ENV PATH=/usr/local/matlab/bin/:$PATH
