
Of course. Here is the database design based on the information in `models/tables.py`:

The database schema is defined using SQLAlchemy and consists of the following tables:

### Enums

Before diving into the tables, it's important to note the use of enumerations (Enums) to define a set of named values for specific columns. This ensures data consistency and readability.

*   **`UserRole`**: Defines the roles a user can have.
    *   `STAFF`: Regular staff member.
    *   `MANAGER`: Manager with elevated privileges.
*   **`TruckStatus`**: Represents the current status of a truck.
    *   `AVAILABLE`: The truck is at a branch and ready for a dispatch.
    *   `IN_TRANSIT`: The truck is currently on a dispatch.
    *   `IDLE`: The truck is not in use.
*   **`ConsignmentStatus`**: Tracks the status of a consignment.
    *   `AWAITING_DISPATCH`: The consignment has been received at the origin branch and is waiting to be loaded onto a truck.
    *   `DISPATCHED`: The consignment is on a truck and in transit to the destination.
    *   `DELIVERED`: The consignment has been delivered to the receiver.

### Tables

#### 1. `users`

This table stores information about the users of the application.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String(60) | Primary Key | Unique identifier for the user. |
| `username` | String(80) | Unique, Not Null | The user's login name. |
| `password_hash` | String(256) | Not Null | The hashed password for the user. |
| `role` | Enum(UserRole) | Not Null, Default: `STAFF` | The role of the user (`STAFF` or `MANAGER`). |
| `branch_id` | String(60) | Foreign Key (`branches.id`), Not Null | The ID of the branch the user belongs to. |

#### 2. `branches`

This table stores information about the company's branches.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String(60) | Primary Key | Unique identifier for the branch. |
| `name` | String(100) | Not Null | The name of the branch. |
| `is_hq` | Boolean | Default: `False` | Indicates if the branch is the headquarters. |

**Relationships:**

*   Has a one-to-many relationship with the `users` table (one branch can have multiple users).
*   Has a one-to-many relationship with the `trucks` table (one branch can have multiple trucks).

#### 3. `trucks`

This table stores information about the company's trucks.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String(60) | Primary Key | Unique identifier for the truck. |
| `truck_number` | String(50) | Unique, Not Null | The unique identification number of the truck. |
| `capacity_cubic_meters` | Float | Not Null, Default: `500.0` | The carrying capacity of the truck in cubic meters. |
| `status` | Enum(TruckStatus) | Not Null, Default: `AVAILABLE` | The current status of the truck. |
| `current_branch_id` | String(60) | Foreign Key (`branches.id`) | The ID of the branch where the truck is currently located. |

**Relationships:**

*   Has a many-to-one relationship with the `branches` table.

#### 4. `consignments`

This table stores information about individual consignments.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String(60) | Primary Key | Unique identifier for the consignment. |
| `volume_cubic_meters` | Float | Not Null | The volume of the consignment in cubic meters. |
| `destination_address` | String(255) | Not Null | The delivery address for the consignment. |
| `sender_address` | String(255) | Not Null | The address where the consignment was picked up from. |
| `receiver_name` | String(100) | Not Null | The name of the person or company receiving the consignment. |
| `status` | Enum(ConsignmentStatus) | Not Null, Default: `AWAITING_DISPATCH` | The current status of the consignment. |
| `origin_branch_id` | String(60) | Foreign Key (`branches.id`), Not Null | The ID of the branch where the consignment originated. |
| `dispatch_id` | String(60) | Foreign Key (`dispatches.id`) | The ID of the dispatch that includes this consignment. |

**Relationships:**

*   Has a many-to-one relationship with the `branches` table.
*   Has a many-to-one relationship with the `dispatches` table.
*   Has a one-to-one relationship with the `invoices` table.

#### 5. `invoices`

This table stores invoice information related to each consignment.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String(60) | Primary Key | Unique identifier for the invoice. |
| `consignment_id` | String(60) | Foreign Key (`consignments.id`), Unique, Not Null | The ID of the consignment this invoice is for. |
| `amount` | Float | Not Null | The total amount of the invoice. |

**Relationships:**

*   Has a one-to-one relationship with the `consignments` table.

#### 6. `dispatches`

This table represents a truck's journey to a destination, carrying one or more consignments.

| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String(60) | Primary Key | Unique identifier for the dispatch. |
| `truck_id` | String(60) | Foreign Key (`trucks.id`), Not Null | The ID of the truck used for the dispatch. |
| `destination_address` | String(255) | Not Null | The common destination address for all consignments in this dispatch. |

**Relationships:**

*   Has a many-to-one relationship with the `trucks` table.
*   Has a one-to-many relationship with the `consignments` table (one dispatch can contain multiple consignments).
