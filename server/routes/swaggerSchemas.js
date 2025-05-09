/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         cart_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 3
 *         store_id:
 *           type: integer
 *           example: 2
 *         product_id:
 *           type: integer
 *           example: 5
 *         quantity:
 *           type: integer
 *           example: 2
 *         selected_attributes:
 *           type: object
 *           example: {"color": "Black", "size": "Medium"}
 *         added_at:
 *           type: string
 *           format: date-time
 *           example: "2023-06-15T14:30:00Z"
 *         Product:
 *           type: object
 *           properties:
 *             product_id:
 *               type: integer
 *               example: 5
 *             name:
 *               type: string
 *               example: "Wireless Headphones"
 *             price:
 *               type: number
 *               format: float
 *               example: 49.99
 *             stock_quantity:
 *               type: integer
 *               example: 50
 *         Store:
 *           type: object
 *           properties:
 *             store_id:
 *               type: integer
 *               example: 2
 *             name:
 *               type: string
 *               example: "Tech Store"
 *
 *     Order:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 3
 *         store_id:
 *           type: integer
 *           example: 2
 *         total_amount:
 *           type: number
 *           format: float
 *           example: 105.98
 *         shipping_address:
 *           type: string
 *           example: "123 Main St, City, Country, 12345"
 *         shipping_cost:
 *           type: number
 *           format: float
 *           example: 5.99
 *         payment_method:
 *           type: string
 *           example: "credit_card"
 *         status:
 *           type: string
 *           enum: [pending, paid, processing, shipped, delivered, cancelled]
 *           example: "pending"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-06-15T14:30:00Z"
 *         Store:
 *           type: object
 *           properties:
 *             store_id:
 *               type: integer
 *               example: 2
 *             name:
 *               type: string
 *               example: "Tech Store"
 *         OrderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               order_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *               selected_attributes:
 *                 type: object
 *                 example: {"color": "Black", "size": "Medium"}
 *               Product:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: integer
 *                     example: 5
 *                   name:
 *                     type: string
 *                     example: "Wireless Headphones"
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 49.99
 *
 *     OrderWithUser:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 3
 *         store_id:
 *           type: integer
 *           example: 2
 *         total_amount:
 *           type: number
 *           format: float
 *           example: 105.98
 *         shipping_address:
 *           type: string
 *           example: "123 Main St, City, Country, 12345"
 *         shipping_cost:
 *           type: number
 *           format: float
 *           example: 5.99
 *         payment_method:
 *           type: string
 *           example: "credit_card"
 *         status:
 *           type: string
 *           enum: [pending, paid, processing, shipped, delivered, cancelled]
 *           example: "pending"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-06-15T14:30:00Z"
 *         User:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *               example: 3
 *             name:
 *               type: string
 *               example: "John Doe"
 *             email:
 *               type: string
 *               example: "john.doe@example.com"
 *         Store:
 *           type: object
 *           properties:
 *             store_id:
 *               type: integer
 *               example: 2
 *             name:
 *               type: string
 *               example: "Tech Store"
 *         OrderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               order_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *               selected_attributes:
 *                 type: object
 *                 example: {"color": "Black", "size": "Medium"}
 *               Product:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: integer
 *                     example: 5
 *                   name:
 *                     type: string
 *                     example: "Wireless Headphones"
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 49.99
 */
