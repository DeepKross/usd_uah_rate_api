# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.19.0

FROM node:${NODE_VERSION}-alpine as development

# Install supervisord
RUN apk add --no-cache supervisor

# Use production node environment by default.
ENV NODE_ENV development
ENV PORT 8080
ENV EXCHANGE_RATE_API_URL oue8RYu6MKmQpdb3ZJNaK9j4s22eZv4h
ENV DATABASE_URL postgresql://postgres:secret@usd_uah_rate_api_db:5432/postgres?schema=public
ENV SMTP_HOST smtp.ukr.net
ENV SMTP_PORT 465
ENV SMTP_USER mykhailo.tanchuk@ukr.net
ENV SMTP_PASSWORD 2OPbxP4YSJnIe2es
ENV SMTP_USER_NAME Mykhailo Tanchuk

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install

COPY . .

# Copy supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose the port that the application listens on.
EXPOSE 8080

# Run supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

