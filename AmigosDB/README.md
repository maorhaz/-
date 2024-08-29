# Online Store Database Schema

This repository contains the database schema design for an online store. The schema covers essential aspects of an online retail system, including customers, products, orders, and payments.

## Database Schema

### Tables

#### `customers`
Stores information about the customers.

| Column Name      | Data Type        | Description                       |
|------------------|------------------|-----------------------------------|
| `customer_id`    | INT (Primary Key)| Unique identifier for each customer |
| `first_name`     | VARCHAR(50)      | Customer's first name             |
| `last_name`      | VARCHAR(50)      | Customer's last name              |
| `email`          | VARCHAR(100)     | Customer's email address          |
| `phone`          | VARCHAR(15)      | Customer's phone number           |
| `address`        | VARCHAR(255)     | Customer's physical address       |
| `city`           | VARCHAR(50)      | Customer's city                   |
| `state`          | VARCHAR(50)      | Customer's state or region        |
| `postal_code`    | VARCHAR(10)      | Customer's postal or ZIP code     |
| `country`        | VARCHAR(50)      | Customer's country                |
| `created_at`     | DATETIME         | Account creation timestamp        |

#### `products`
Stores information about the products available in the shop.

| Column Name      | Data Type        | Description                       |
|------------------|------------------|-----------------------------------|
| `product_id`     | INT (Primary Key)| Unique identifier for each product|
| `name`           | VARCHAR(100)     | Name of the product               |
| `description`    | TEXT             | Description of the product        |
| `price`          | DECIMAL(10, 2)   | Price of the product              |
| `stock_quantity` | INT              | Quantity of the product in stock  |
| `category_id`    | INT (Foreign Key)| Reference to the product category |
| `created_at`     | DATETIME         | Product creation timestamp        |

#### `categories`
Organizes products into categories.

| Column Name      | Data Type        | Description                       |
|------------------|------------------|-----------------------------------|
| `category_id`    | INT (Primary Key)| Unique identifier for each category|
| `name`           | VARCHAR(50)      | Name of the category              |
| `description`    | TEXT             | Description of the category       |

#### `orders`
Stores information about customer orders.

| Column Name      | Data Type        | Description                       |
|------------------|------------------|-----------------------------------|
| `order_id`       | INT (Primary Key)| Unique identifier for each order  |
| `customer_id`    | INT (Foreign Key)| Reference to the customer         |
| `order_date`     | DATETIME         | Date and time of the order        |
| `total_amount`   | DECIMAL(10, 2)   | Total amount of the order         |
| `status`         | VARCHAR(50)      | Status of the order (e.g., pending, shipped) |
| `shipping_address` | VARCHAR(255)   | Shipping address for the order    |

#### `order_items`
Stores information about the products in each order.

| Column Name      | Data Type        | Description                       |
|------------------|------------------|-----------------------------------|
| `order_item_id`  | INT (Primary Key)| Unique identifier for each order item |
| `order_id`       | INT (Foreign Key)| Reference to the order            |
| `product_id`     | INT (Foreign Key)| Reference to the product          |
| `quantity`       | INT              | Quantity of the product ordered   |
| `price`          | DECIMAL(10, 2)   | Price of the product at the time of order |

#### `payments`
Stores information about payments made for orders.

| Column Name      | Data Type        | Description                       |
|------------------|------------------|-----------------------------------|
| `payment_id`     | INT (Primary Key)| Unique identifier for each payment|
| `order_id`       | INT (Foreign Key)| Reference to the order            |
| `payment_date`   | DATETIME         | Date and time of the payment      |
| `amount`         | DECIMAL(10, 2)   | Amount paid                       |
| `payment_method` | VARCHAR(50)      | Method of payment (e.g., credit card, PayPal) |
| `status`         | VARCHAR(50)      | Status of the payment (e.g., completed, failed) |

#### `inventory`
Tracks inventory changes such as stock adjustments or product restocks.

| Column Name      | Data Type        | Description                       |
|------------------|------------------|-----------------------------------|
| `inventory_id`   | INT (Primary Key)| Unique identifier for each inventory record |
| `product_id`     | INT (Foreign Key)| Reference to the product          |
| `quantity_change`| INT              | Change in quantity (positive for restock, negative for sale) |
| `change_date`    | DATETIME         | Date and time of the change       |
| `reason`         | VARCHAR(100)     | Reason for the inventory change (e.g., sale, restock) |

### Relationships

- **Customers to Orders**: One-to-Many (One customer can have many orders)
- **Orders to OrderItems**: One-to-Many (One order can have many order items)
- **Products to Categories**: Many-to-One (Many products can belong to one category)
- **Products to OrderItems**: One-to-Many (One product can be in many order items)
- **Orders to Payments**: One-to-One (Each order has one payment)
- **Products to Inventory**: One-to-Many (One product can have many inventory changes)

### Usage

To visualize this schema, you can use the following dbdiagram.io code:

```plaintext
Table customers {
  customer_id INT [pk, increment]
  first_name VARCHAR(50)
  last_name VARCHAR(50)
  email VARCHAR(100) [unique]
  phone VARCHAR(15)
  address VARCHAR(255)
  city VARCHAR(50)
  state VARCHAR(50)
  postal_code VARCHAR(10)
  country VARCHAR(50)
  created_at DATETIME
}

Table products {
  product_id INT [pk, increment]
  name VARCHAR(100)
  description TEXT
  price DECIMAL(10, 2)
  stock_quantity INT
  category_id INT [ref: > categories.category_id]
  created_at DATETIME
}

Table categories {
  category_id INT [pk, increment]
  name VARCHAR(50)
  description TEXT
}

Table orders {
  order_id INT [pk, increment]
  customer_id INT [ref: > customers.customer_id]
  order_date DATETIME
  total_amount DECIMAL(10, 2)
  status VARCHAR(50)
  shipping_address VARCHAR(255)
}

Table order_items {
  order_item_id INT [pk, increment]
  order_id INT [ref: > orders.order_id]
  product_id INT [ref: > products.product_id]
  quantity INT
  price DECIMAL(10, 2)
}

Table payments {
  payment_id INT [pk, increment]
  order_id INT [ref: > orders.order_id]
  payment_date DATETIME
  amount DECIMAL(10, 2)
  payment_method VARCHAR(50)
  status VARCHAR(50)
}

Table inventory {
  inventory_id INT [pk, increment]
  product_id INT [ref: > products.product_id]
  quantity_change INT
  change_date DATETIME
  reason VARCHAR(100)
}
