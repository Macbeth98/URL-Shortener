#DEFAULTS
FILE ?= test/**/*.test.ts

# Default target
all: dev

# Start the application
start:
	npm run start

# Run the application in development mode
dev:
	npm run dev

# Run tests. Usage: make test FILE=path/to/test/file
test:
	npm run test -- ${FILE}

# Run tests with coverage. Usage: make test-coverage FILE=path/to/test/file
test-coverage:
	npm run test:coverage -- ${FILE}

.PHONY: start dev test test-coverage
