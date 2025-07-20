
# API Documentation

This documentation provides detailed information about the API endpoints for the logistics application.

## Base URL

The base URL for all API endpoints is `/api/v1`.

## Authentication

User authentication is required for certain endpoints. The API uses a token-based authentication system.

- `POST /api/v1/users/register`: Register a new user.
- `POST /api/v1/users/login`: Log in a user and receive an authentication token.

---

## Branches

Endpoints for managing branches.

### `POST /branches/`

Creates a new branch.

**Request Body:**

```json
{
  "name": "string",
  "is_hq": "boolean"
}
```

**Responses:**

- `201 Created`: Branch created successfully.
- `400 Bad Request`: Missing branch name.

### `GET /branches/`

Retrieves all branches.

**Responses:**

- `200 OK`: A list of all branches.

### `GET /branches/<branch_id>`

Retrieves a specific branch.

**URL Parameters:**

- `branch_id` (string): The ID of the branch to retrieve.

**Responses:**

- `200 OK`: The requested branch.
- `404 Not Found`: Branch not found.

---

## Consignments

Endpoints for managing consignments.

### `POST /consignments/`

Creates a new consignment and an associated invoice.

**Request Body:**

```json
{
  "volume_cubic_meters": "number",
  "destination_address": "string",
  "sender_address": "string",
  "receiver_name": "string",
  "origin_branch_id": "string"
}
```

**Responses:**

- `201 Created`: Consignment created successfully.
- `400 Bad Request`: Missing required consignment data.

### `GET /consignments/`

Retrieves all consignments.

**Responses:**

- `200 OK`: A list of all consignments.

### `GET /consignments/<consignment_id>`

Retrieves a specific consignment.

**URL Parameters:**

- `consignment_id` (string): The ID of the consignment to retrieve.

**Responses:**

- `200 OK`: The requested consignment.
- `404 Not Found`: Consignment not found.

### `GET /consignments/status/<consignment_id>`

Retrieves the status of a specific consignment.

**URL Parameters:**

- `consignment_id` (string): The ID of the consignment.

**Responses:**

- `200 OK`: The status of the consignment.
- `404 Not Found`: Consignment not found.

### `GET /consignments/stats`

Retrieves consignment statistics.

**Query Parameters:**

- `destination` (string, required): The destination to filter by.

**Responses:**

- `200 OK`: Consignment statistics for the given destination.
- `400 Bad Request`: Missing destination.

### `GET /consignments/average_wait_time`

Calculates the average waiting time for consignments.

**Responses:**

- `200 OK`: The average waiting time for consignments in seconds.

---

## Dispatches

Endpoints for managing dispatches.

### `GET /dispatches/`

Retrieves all dispatches.

**Responses:**

- `200 OK`: A list of all dispatches.

### `GET /dispatches/<dispatch_id>`

Retrieves a specific dispatch.

**URL Parameters:**

- `dispatch_id` (string): The ID of the dispatch to retrieve.

**Responses:**

- `200 OK`: The requested dispatch.
- `404 Not Found`: Dispatch not found.

---

## Invoices

Endpoints for managing invoices.

### `GET /invoices/`

Retrieves all invoices.

**Responses:**

- `200 OK`: A list of all invoices.

### `GET /invoices/<invoice_id>`

Retrieves a specific invoice.

**URL Parameters:**

- `invoice_id` (string): The ID of the invoice to retrieve.

**Responses:**

- `200 OK`: The requested invoice.
- `404 Not Found`: Invoice not found.

---

## Trucks

Endpoints for managing trucks.

### `POST /trucks/`

Creates a new truck.

**Request Body:**

```json
{
  "truck_number": "string",
  "capacity_cubic_meters": "number",
  "current_branch_id": "string"
}
```

**Responses:**

- `201 Created`: Truck created successfully.
- `400 Bad Request`: Missing truck number.

### `GET /trucks/`

Retrieves all trucks.

**Responses:**

- `200 OK`: A list of all trucks.

### `GET /trucks/<truck_id>`

Retrieves a specific truck.

**URL Parameters:**

- `truck_id` (string): The ID of the truck to retrieve.

**Responses:**

- `200 OK`: The requested truck.
- `404 Not Found`: Truck not found.

### `PUT /trucks/<truck_id>`

Updates a truck's status or location.

**URL Parameters:**

- `truck_id` (string): The ID of the truck to update.

**Request Body:**

```json
{
  "status": "string (IDLE or IN_TRANSIT)",
  "current_branch_id": "string"
}
```

**Responses:**

- `200 OK`: Truck updated successfully.
- `404 Not Found`: Truck not found.
- `400 Bad Request`: No data provided or invalid data.

### `GET /trucks/status`

Retrieves the status of all trucks.

**Query Parameters:**

- `status` (string, optional): Filter trucks by status.

**Responses:**

- `200 OK`: A list of all trucks with their statuses.

### `GET /trucks/usage`

Retrieves the usage of all trucks over a given period.

**Query Parameters:**

- `days` (integer, optional, default=7): The number of days to look back for usage statistics.

**Responses:**

- `200 OK`: A list of trucks with their usage statistics.

### `GET /trucks/average_idle_time`

Calculates the average idle time for trucks.

**Responses:**

- `200 OK`: The average idle time of trucks in seconds.

---

## Users

Endpoints for managing users.

### `POST /users/register`

Registers a new user.

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "role": "string (ADMIN or STAFF)",
  "branch_id": "string"
}
```

**Responses:**

- `201 Created`: User created successfully.
- `400 Bad Request`: Missing username or password.
- `409 Conflict`: User already exists.

### `POST /users/login`

Logs in a user.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**

- `200 OK`: Login successful.
- `400 Bad Request`: Missing username or password.
- `401 Unauthorized`: Invalid username or password.
