-- USERS
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone_number VARCHAR(20),
    gender ENUM('Male', 'Female') NOT NULL,
    birthday DATE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- OPTIONAL ADMIN DATA (only for is_admin = TRUE)
CREATE TABLE AdminData (
    admin_id INT PRIMARY KEY,
    security_key VARCHAR(255) NOT NULL,
    token TEXT,
    validate_period DATE NOT NULL,
    created_by INT,
    FOREIGN KEY (admin_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- STORES
CREATE TABLE Stores (
    store_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    background_img TEXT,
    logo TEXT,
    meta_title TEXT,
    meta_description TEXT,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    UNIQUE KEY unique_user_store (created_by) -- Ensures each user can have only one store
);

-- CATEGORIES (store-specific)
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    parent_category_id INT NULL, -- Added for hierarchical categories
    name VARCHAR(100) NOT NULL,
    description TEXT,
    img_path TEXT,
    seen_number INT DEFAULT 0,
    FOREIGN KEY (store_id) REFERENCES Stores(store_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- PRODUCTS
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    main_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0, -- Added stock tracking
    seen_number INT DEFAULT 0,
    category_id INT,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES Stores(store_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- PRODUCT IMAGES
CREATE TABLE ProductImages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    img_path TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE, -- Added to identify main product image
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- PRODUCT ATTRIBUTES (size, color, material, etc.)
CREATE TABLE ProductAttributes (
    attribute_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL, -- Made attributes store-specific
    name VARCHAR(100) NOT NULL, -- e.g. Size, Color
    FOREIGN KEY (store_id) REFERENCES Stores(store_id) ON DELETE CASCADE
);

-- ATTRIBUTE OPTIONS (values for each attribute)
CREATE TABLE AttributeOptions (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_id INT NOT NULL,
    value VARCHAR(100) NOT NULL,
    FOREIGN KEY (attribute_id) REFERENCES ProductAttributes(attribute_id) ON DELETE CASCADE
);

-- PRODUCT-ATTRIBUTE-OPTION RELATIONSHIP
CREATE TABLE ProductAttributeValues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    attribute_id INT NOT NULL,
    option_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (attribute_id) REFERENCES ProductAttributes(attribute_id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES AttributeOptions(option_id) ON DELETE CASCADE
);

-- OFFERS (store-specific)
CREATE TABLE Offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2),
    start_date DATETIME, -- Added start/end dates
    end_date DATETIME,
    offer_img TEXT,
    seen_number INT DEFAULT 0,
    FOREIGN KEY (store_id) REFERENCES Stores(store_id) ON DELETE CASCADE
);

-- PRODUCT-OFFER RELATIONSHIP
CREATE TABLE ProductOffers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    offer_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (offer_id) REFERENCES Offers(offer_id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_offer (product_id, offer_id)
);

-- ORDERS
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT NOT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT, -- Added shipping information
    shipping_cost DECIMAL(10,2) DEFAULT 0.00,
    payment_method VARCHAR(50),
    status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES Stores(store_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ORDER ITEMS
CREATE TABLE OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    selected_attributes JSON, -- Store selected attribute options
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- CART
CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_attributes JSON, -- Store selected attribute options
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES Stores(store_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- USER STORE RELATIONSHIP (for saved/favorite stores)
CREATE TABLE UserStores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES Stores(store_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id)
);

-- USER PRODUCT RELATIONSHIP (for saved/favorite products)
CREATE TABLE UserProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- REVIEWS
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    UNIQUE KEY unique_user_product_review (user_id, product_id)
);