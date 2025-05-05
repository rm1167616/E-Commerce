import React from 'react';
import { Table, Form, Image } from 'react-bootstrap';
import './Table.css'; // We'll use this for custom styling

const products = [
  {
    id: 1,
    name: "Raspberry Coconut Yog",
    image: "raspberry.jpg", // Replace with actual image URLs
    stock: 699,
    price: "3,59 EGP",
    category: "Yogurt",
    date: "2024/03/04 at 12:09 pm",
    isFeatured: false,
    oldPrice: null,
  },
  {
    id: 2,
    name: "Plain With Coconut",
    image: "plain.jpg",
    stock: 699,
    price: "2,19 EGP",
    category: "Yogurt",
    date: "2024/03/04 at 12:09 pm",
    isFeatured: true,
    oldPrice: null,
  },
  {
    id: 3,
    name: "Atlantic Salmon",
    image: "salmon.jpg",
    stock: 899,
    price: "7,68 EGP",
    category: "Fresh Fish",
    date: "2024/03/04 at 12:09 pm",
    isFeatured: false,
    oldPrice: null,
  },
  {
    id: 4,
    name: "Oat Milk With Vitamins",
    image: "oatmilk.jpg",
    stock: 699,
    price: "1,51 EGP",
    oldPrice: "2,16 EGP",
    category: "Milk & Cream",
    date: "2024/03/04 at 12:09 pm",
    isFeatured: false,
    editable: true,
  },
];

const ProductTable = () => {
  return (
    <Table bordered hover responsive className="product-table">
      <thead>
        <tr>
          <th><Form.Check type="checkbox" /></th>
          <th>Image</th>
          <th>Name</th>
          <th>SKU</th>
          <th>Stock</th>
          <th>Price</th>
          <th>Categories</th>
          <th>Tags</th>
          <th>Brands</th>
          <th>★</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {products.map(prod => (
          <tr key={prod.id}>
            <td><Form.Check type="checkbox" /></td>
            <td><Image src={prod.image} rounded style={{ width: '40px', height: '40px' }} /></td>
            <td>
              <strong style={{ color: '#1e73be' }}>{prod.name}</strong>
              {prod.editable && (
                <div style={{ fontSize: '12px' }}>
                  ID: 341 | <span className="text-primary">Edit</span> | <span className="text-primary">Quick Edit</span> | <span className="text-danger">Trash</span> | View | Duplicate
                </div>
              )}
            </td>
            <td>–</td>
            <td className="text-success">In stock ({prod.stock})</td>
            <td>
              {prod.oldPrice && <del>{prod.oldPrice}</del>}<br />
              {prod.price} each
            </td>
            <td className="text-primary">{prod.category}</td>
            <td>–</td>
            <td>—</td>
            <td>{prod.isFeatured ? '⭐' : '☆'}</td>
            <td>
              Published<br />
              {prod.date}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProductTable;
